(() => {
  let db = null;
  let currentUser = null;
  const $ = id => document.getElementById(id);

  function show(id) {
    ['setupNotice', 'loginPanel', 'dashboard'].forEach(x => {
      const el = $(x);
      if (el) el.hidden = (x !== id);
    });
    const headerLogout = $('headerLogout');
    if (headerLogout) {
      headerLogout.style.display = (id === 'dashboard') ? 'inline-block' : 'none';
    }
  }

  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  function formatWaNumber(phone) {
    const digits = String(phone || '').replace(/\D/g, '');
    if (digits.length === 10) return '91' + digits;
    if (digits.length === 11 && digits.startsWith('0')) return '91' + digits.slice(1);
    return digits;
  }

  const cfg = window.DESIGN_HAUS_CONFIG;
  if (!cfg || !cfg.supabaseUrl || cfg.supabaseUrl.includes('YOUR-PROJECT') ||
      !cfg.supabaseAnonKey || cfg.supabaseAnonKey.includes('YOUR_') || !window.supabase) {
    show('setupNotice');
  } else {
    try {
      db = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
      init();
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      show('setupNotice');
    }
  }

  async function init() {
    try {
      const { data: { session } } = await db.auth.getSession();
      if (session) {
        currentUser = session.user;
        await enter();
      } else {
        show('loginPanel');
      }

      db.auth.onAuthStateChange(async (_event, session) => {
        if (session) {
          currentUser = session.user;
          await enter();
        } else {
          currentUser = null;
          show('loginPanel');
        }
      });
    } catch (err) {
      console.error('Auth initialization error:', err);
      show('loginPanel');
    }
  }

  // --- Login Form ---
  $('loginForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const errEl = $('loginError');
    const btn = $('loginBtn');
    if (errEl) errEl.textContent = '';
    if (btn) { btn.disabled = true; btn.textContent = 'Verifying…'; }

    const f = new FormData(e.currentTarget);
    try {
      const { data, error } = await db.auth.signInWithPassword({
        email: f.get('email').trim(),
        password: f.get('password')
      });
      if (error) {
        if (errEl) errEl.textContent = error.message;
      }
    } catch (err) {
      if (errEl) errEl.textContent = err.message || 'Authentication error';
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Sign in to Dashboard'; }
    }
  });

  // --- Toggle Password Reset Form ---
  $('togglePasswordReset')?.addEventListener('click', e => {
    e.preventDefault();
    const f = $('passwordResetForm');
    if (f) f.hidden = !f.hidden;
  });

  // --- Password Reset Request ---
  $('passwordResetForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = f.get('resetEmail').trim();
    const msg = $('resetMessage');
    if (msg) msg.textContent = 'Sending reset instructions…';

    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname
    });

    if (error) {
      if (msg) { msg.textContent = error.message; msg.className = 'error'; }
    } else {
      if (msg) {
        msg.textContent = 'Password reset instructions have been sent to your email.';
        msg.className = 'status';
      }
      e.currentTarget.reset();
    }
  });

  // --- Sign Out ---
  $('logout')?.addEventListener('click', () => db.auth.signOut());
  $('headerLogout')?.addEventListener('click', () => db.auth.signOut());

  async function enter() {
    show('dashboard');
    const badge = $('userBadge');
    if (badge && currentUser) {
      badge.textContent = `Signed in as ${currentUser.email}`;
    }
    const sessionDetails = $('sessionDetails');
    if (sessionDetails && currentUser) {
      sessionDetails.innerHTML = `<strong>Account:</strong> ${esc(currentUser.email)}<br><strong>User UID:</strong> <code>${esc(currentUser.id)}</code><br><strong>Last Sign In:</strong> ${new Date(currentUser.last_sign_in_at || Date.now()).toLocaleString()}`;
    }

    await Promise.all([
      loadProjects(),
      loadLeads(),
      loadServices(),
      loadTestimonials()
    ]);
  }

  // --- Tab Navigation ---
  document.querySelectorAll('.tab').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.toggle('active', x === b));
      const target = b.dataset.tab;
      ['projectsTab', 'leadsTab', 'servicesTab', 'testimonialsTab', 'accountTab'].forEach(t => {
        const el = $(t);
        if (el) el.hidden = (t !== target + 'Tab');
      });
    });
  });

  // --- Refresh Buttons ---
  $('refreshProjectsBtn')?.addEventListener('click', () => loadProjects());
  $('refreshLeadsBtn')?.addEventListener('click', () => loadLeads());
  $('refreshServicesBtn')?.addEventListener('click', () => loadServices());
  $('refreshTestimonialsBtn')?.addEventListener('click', () => loadTestimonials());

  // ===========================================================================
  // 1. PROJECTS MANAGEMENT
  // ===========================================================================
  $('projectForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const file = f.get('image');
    const msg = $('projectMessage');
    const btn = $('saveProjectBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Uploading photograph…'; }
    if (msg) msg.textContent = 'Uploading to storage bucket…';

    try {
      const path = `projects/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      const up = await db.storage.from('project-images').upload(path, file, { upsert: false });
      if (up.error) throw up.error;

      const { data: { publicUrl } } = db.storage.from('project-images').getPublicUrl(path);

      const newProj = {
        title: f.get('title').trim(),
        category: f.get('category'),
        typology: (f.get('typology') || 'Residential Architecture').trim(),
        location: (f.get('location') || 'Bankapur / Haveri, Karnataka').trim(),
        description: (f.get('description') || '').trim(),
        image_url: publicUrl,
        is_featured: f.get('is_featured') === 'on',
        is_published: f.get('is_published') === 'on',
        created_by: currentUser.id
      };

      const ins = await db.from('projects').insert(newProj);
      if (ins.error) throw ins.error;

      e.currentTarget.reset();
      if (msg) {
        msg.textContent = 'Project published successfully!';
        msg.className = 'status';
      }
      await loadProjects();
    } catch (err) {
      if (msg) {
        msg.textContent = err.message || 'Error saving project';
        msg.className = 'error';
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Upload & Publish Project'; }
    }
  });

  async function loadProjects() {
    const el = $('adminProjects');
    if (!el) return;
    el.innerHTML = '<p class="empty">Loading published projects…</p>';

    const { data, error } = await db.from('projects').select('*').order('created_at', { ascending: false });
    if (error) {
      el.innerHTML = `<p class="empty error">${esc(error.message)}</p>`;
      return;
    }

    if (!data || !data.length) {
      el.innerHTML = '<p class="empty">No dynamic projects in database yet. Add your first project using the form.</p>';
      return;
    }

    el.innerHTML = data.map(p => `
      <div class="admin-item">
        <img src="${esc(p.image_url)}" alt="${esc(p.title)}" loading="lazy">
        <div class="admin-item-content">
          <b>${esc(p.title)}</b>
          <small>${esc(p.category)} · ${esc(p.typology || 'Architecture')} · ${esc(p.location || 'Karnataka')}</small>
          <p>${esc(p.description || 'No description provided.')}</p>
          <div style="display:flex;gap:12px;font-size:12px;">
            <span style="color:${p.is_published ? '#2e6930' : '#888'};">● ${p.is_published ? 'Published Live' : 'Draft / Unpublished'}</span>
            ${p.is_featured ? '<span style="color:#a58c63;font-weight:700;">★ Featured on Home</span>' : ''}
          </div>
        </div>
        <div class="admin-item-actions">
          <button data-id="${p.id}" class="btn-edit edit-project-btn">Edit</button>
          <button data-id="${p.id}" class="btn-delete delete-project-btn">Delete</button>
        </div>
      </div>
    `).join('');

    // Hook delete buttons
    el.querySelectorAll('.delete-project-btn').forEach(b => {
      b.addEventListener('click', async () => {
        if (!confirm('Permanently delete this project?')) return;
        const { error } = await db.from('projects').delete().eq('id', b.dataset.id);
        if (error) alert('Error: ' + error.message);
        else loadProjects();
      });
    });

    // Hook edit buttons
    el.querySelectorAll('.edit-project-btn').forEach(b => {
      b.addEventListener('click', () => {
        const item = data.find(x => x.id === b.dataset.id);
        if (item) openEditProjectModal(item);
      });
    });
  }

  function openEditProjectModal(p) {
    const modal = $('editProjectModal');
    if (!modal) return;
    $('editProjectId').value = p.id;
    $('editProjectTitle').value = p.title || '';
    $('editProjectCategory').value = p.category || 'residential';
    $('editProjectTypology').value = p.typology || '';
    $('editProjectLocation').value = p.location || '';
    $('editProjectDescription').value = p.description || '';
    $('editProjectFeatured').checked = !!p.is_featured;
    $('editProjectPublished').checked = p.is_published !== false;
    $('editProjectStatus').textContent = '';
    modal.hidden = false;
  }

  function closeEditProjectModal() {
    const modal = $('editProjectModal');
    if (modal) modal.hidden = true;
  }

  $('closeProjectModal')?.addEventListener('click', closeEditProjectModal);
  $('cancelEditProject')?.addEventListener('click', closeEditProjectModal);

  $('editProjectForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const id = $('editProjectId').value;
    const updates = {
      title: $('editProjectTitle').value.trim(),
      category: $('editProjectCategory').value,
      typology: $('editProjectTypology').value.trim(),
      location: $('editProjectLocation').value.trim(),
      description: $('editProjectDescription').value.trim(),
      is_featured: $('editProjectFeatured').checked,
      is_published: $('editProjectPublished').checked
    };

    const statusEl = $('editProjectStatus');
    if (statusEl) statusEl.textContent = 'Saving changes…';

    const { error } = await db.from('projects').update(updates).eq('id', id);
    if (error) {
      if (statusEl) { statusEl.textContent = error.message; statusEl.className = 'error'; }
    } else {
      closeEditProjectModal();
      await loadProjects();
    }
  });

  // ===========================================================================
  // 2. ENQUIRIES & LEADS MANAGEMENT
  // ===========================================================================
  async function loadLeads() {
    const el = $('adminLeads');
    if (!el) return;
    el.innerHTML = '<p class="empty">Loading enquiries…</p>';

    const { data, error } = await db.from('leads').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) {
      el.innerHTML = `<p class="empty error">${esc(error.message)}</p>`;
      return;
    }

    const unreadCount = data ? data.filter(x => !x.is_read).length : 0;
    const badge = $('unreadLeadCount');
    if (badge) badge.textContent = unreadCount;

    if (!data || !data.length) {
      el.innerHTML = '<p class="empty">No website enquiries received yet. All new contact inquiries will appear here in real-time.</p>';
      return;
    }

    el.innerHTML = data.map(x => `
      <div class="admin-item" style="${!x.is_read ? 'border-left:4px solid var(--gold);' : ''}">
        <div class="admin-item-content">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;flex-wrap:wrap;">
            <b>${esc(x.name)}</b>
            <span class="status-badge status-badge-${esc(x.status || 'new')}">${esc((x.status || 'new').toUpperCase())}</span>
            <small style="margin:0;">${new Date(x.created_at).toLocaleString()}</small>
          </div>
          <small>
            Phone: <a href="tel:${esc(x.phone)}" style="color:inherit;font-weight:700;">${esc(x.phone)}</a>
            ${x.email ? ` · Email: <a href="mailto:${esc(x.email)}" style="color:inherit;">${esc(x.email)}</a>` : ''}
          </small>
          <div style="font-size:13px;color:#333;margin:8px 0;background:#f8f6f0;padding:10px 14px;border-radius:2px;">
            <strong>Discipline:</strong> ${esc(x.service)}<br>
            ${x.location ? `<strong>Site Location:</strong> ${esc(x.location)}<br>` : ''}
            ${x.budget ? `<strong>Budget:</strong> ${esc(x.budget)}<br>` : ''}
            ${x.message ? `<strong>Project Vision:</strong> ${esc(x.message)}` : ''}
          </div>
          <div style="display:flex;gap:15px;align-items:center;margin-top:10px;flex-wrap:wrap;">
            <label style="display:flex;align-items:center;gap:6px;font-size:12px;text-transform:none;">
              Status:
              <select data-id="${x.id}" class="lead-status-select" style="padding:4px 8px;font-size:12px;">
                <option value="new" ${x.status === 'new' ? 'selected' : ''}>New Enquiry</option>
                <option value="contacted" ${x.status === 'contacted' ? 'selected' : ''}>Contacted</option>
                <option value="in_progress" ${x.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                <option value="closed" ${x.status === 'closed' ? 'selected' : ''}>Closed / Won</option>
                <option value="archived" ${x.status === 'archived' ? 'selected' : ''}>Archived</option>
              </select>
            </label>
            <button data-id="${x.id}" data-read="${x.is_read}" class="btn-sm secondary toggle-read-btn" type="button">
              ${x.is_read ? 'Mark as Unread' : 'Mark as Read'}
            </button>
          </div>
        </div>
        <div class="admin-item-actions">
          <a class="btn-wa" href="https://wa.me/${esc(formatWaNumber(x.phone))}?text=Hello%20${encodeURIComponent(x.name)}%2C%20thank%20you%20for%20contacting%20DESIGN%20HAUS.%20I%20am%20Er.%20Nadeem%20Keli%20and%20am%20following%20up%20on%20your%20project%20enquiry." target="_blank" rel="noopener">
            WhatsApp ↗
          </a>
          <button data-id="${x.id}" class="btn-delete delete-lead-btn" type="button">Delete</button>
        </div>
      </div>
    `).join('');

    // Status change listener
    el.querySelectorAll('.lead-status-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        const { error } = await db.from('leads').update({ status: sel.value }).eq('id', sel.dataset.id);
        if (error) alert('Could not update status: ' + error.message);
        else loadLeads();
      });
    });

    // Toggle read listener
    el.querySelectorAll('.toggle-read-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const current = btn.dataset.read === 'true';
        const { error } = await db.from('leads').update({ is_read: !current }).eq('id', btn.dataset.id);
        if (error) alert('Error: ' + error.message);
        else loadLeads();
      });
    });

    // Delete lead listener
    el.querySelectorAll('.delete-lead-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Permanently delete this enquiry record?')) return;
        const { error } = await db.from('leads').delete().eq('id', btn.dataset.id);
        if (error) alert('Error: ' + error.message);
        else loadLeads();
      });
    });
  }

  // ===========================================================================
  // 3. SERVICES MANAGEMENT
  // ===========================================================================
  async function loadServices() {
    const el = $('adminServices');
    if (!el) return;
    el.innerHTML = '<p class="empty">Loading services…</p>';

    const { data, error } = await db.from('services').select('*').order('order_index', { ascending: true });
    if (error) {
      el.innerHTML = `<p class="empty error">${esc(error.message)}</p>`;
      return;
    }

    if (!data || !data.length) {
      el.innerHTML = `
        <div class="empty">
          <p>No customized services in database yet.</p>
          <button id="seedServicesBtn" class="btn-primary" type="button" style="margin-top:10px;">Initialize Default 6 Studio Services</button>
        </div>
      `;
      $('seedServicesBtn')?.addEventListener('click', seedDefaultServices);
      return;
    }

    el.innerHTML = data.map(s => `
      <div class="admin-item">
        <div class="admin-item-content">
          <b>${esc(s.category_number)} · ${esc(s.title)}</b>
          <p>${esc(s.description)}</p>
          <span style="font-size:12px;color:${s.is_visible ? '#2e6930' : '#888'};">
            ● ${s.is_visible ? 'Visible on Website' : 'Hidden from Website'}
          </span>
        </div>
        <div class="admin-item-actions">
          <button data-id="${s.id}" data-visible="${s.is_visible}" class="btn-sm secondary toggle-service-btn" type="button">
            ${s.is_visible ? 'Hide Service' : 'Show Service'}
          </button>
        </div>
      </div>
    `).join('');

    el.querySelectorAll('.toggle-service-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const current = btn.dataset.visible === 'true';
        const { error } = await db.from('services').update({ is_visible: !current }).eq('id', btn.dataset.id);
        if (error) alert('Error: ' + error.message);
        else loadServices();
      });
    });
  }

  async function seedDefaultServices() {
    const defaults = [
      { slug: 'architecture', category_number: '01', title: 'Architecture & Building Planning', description: 'Comprehensive architectural concepts, zoning and building plans tailored to site conditions.', image_url: 'assets/projects/exterior-04.webp', order_index: 1 },
      { slug: 'visualisation', category_number: '02', title: '2D Plans & 3D Visualisation', description: 'Working drawings, 2D floor plans and photorealistic 3D elevations before construction begins.', image_url: 'assets/projects/exterior-12.webp', order_index: 2 },
      { slug: 'interiors', category_number: '03', title: 'Interior Design & Renovation', description: 'Considered room layouts, lighting direction, false ceiling plans and renovation concepts.', image_url: 'assets/projects/interior-02.webp', order_index: 3 },
      { slug: 'build', category_number: '04', title: 'Construction & Turnkey Projects', description: 'Turnkey building execution from foundation to structural framing and final finishes.', image_url: 'assets/projects/exterior-18.webp', order_index: 4 },
      { slug: 'consultancy', category_number: '05', title: 'Estimation, Permissions & Supervision', description: 'BOQ estimations, statutory building permissions and rigorous on-site structural supervision.', image_url: 'assets/projects/exterior-29.webp', order_index: 5 },
      { slug: 'realestate', category_number: '06', title: 'Commercial Design & Real Estate', description: 'Design and advisory support for commercial complexes, layout plotting and real estate development.', image_url: 'assets/projects/exterior-22.webp', order_index: 6 }
    ];

    const { error } = await db.from('services').insert(defaults);
    if (error) alert('Seeding error: ' + error.message);
    else loadServices();
  }

  // ===========================================================================
  // 4. TESTIMONIALS MANAGEMENT
  // ===========================================================================
  $('testimonialForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = $('testimonialMessage');
    const btn = $('saveTestimonialBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }

    const entry = {
      client_name: f.get('client_name').trim(),
      project_title: f.get('project_title').trim(),
      location: (f.get('location') || 'Karnataka, India').trim(),
      quote: f.get('quote').trim(),
      rating: parseInt(f.get('rating') || '5', 10),
      is_published: f.get('is_published') === 'on'
    };

    const { error } = await db.from('testimonials').insert(entry);
    if (error) {
      if (msg) { msg.textContent = error.message; msg.className = 'error'; }
    } else {
      e.currentTarget.reset();
      if (msg) { msg.textContent = 'Testimonial added successfully!'; msg.className = 'status'; }
      await loadTestimonials();
    }

    if (btn) { btn.disabled = false; btn.textContent = 'Save Testimonial'; }
  });

  async function loadTestimonials() {
    const el = $('adminTestimonials');
    if (!el) return;
    el.innerHTML = '<p class="empty">Loading testimonials…</p>';

    const { data, error } = await db.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) {
      el.innerHTML = `<p class="empty error">${esc(error.message)}</p>`;
      return;
    }

    if (!data || !data.length) {
      el.innerHTML = '<p class="empty">No client testimonials saved yet. Add authentic feedback from completed client projects using the form.</p>';
      return;
    }

    el.innerHTML = data.map(t => `
      <div class="admin-item">
        <div class="admin-item-content">
          <b>${esc(t.client_name)} · ${'★'.repeat(t.rating || 5)}</b>
          <small>${esc(t.project_title)} (${esc(t.location)})</small>
          <p>“${esc(t.quote)}”</p>
          <span style="font-size:12px;color:${t.is_published ? '#2e6930' : '#888'};">
            ● ${t.is_published ? 'Published' : 'Hidden'}
          </span>
        </div>
        <div class="admin-item-actions">
          <button data-id="${t.id}" data-published="${t.is_published}" class="btn-sm secondary toggle-test-btn" type="button">
            ${t.is_published ? 'Unpublish' : 'Publish'}
          </button>
          <button data-id="${t.id}" class="btn-delete delete-test-btn" type="button">Delete</button>
        </div>
      </div>
    `).join('');

    el.querySelectorAll('.toggle-test-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const cur = btn.dataset.published === 'true';
        const { error } = await db.from('testimonials').update({ is_published: !cur }).eq('id', btn.dataset.id);
        if (error) alert('Error: ' + error.message);
        else loadTestimonials();
      });
    });

    el.querySelectorAll('.delete-test-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Permanently delete this testimonial?')) return;
        const { error } = await db.from('testimonials').delete().eq('id', btn.dataset.id);
        if (error) alert('Error: ' + error.message);
        else loadTestimonials();
      });
    });
  }

  // ===========================================================================
  // 5. SECURITY & UPDATE PASSWORD
  // ===========================================================================
  $('updatePasswordForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p1 = f.get('newPassword');
    const p2 = f.get('confirmPassword');
    const msg = $('passwordMessage');

    if (p1 !== p2) {
      if (msg) { msg.textContent = 'Passwords do not match.'; msg.className = 'error'; }
      return;
    }

    if (msg) msg.textContent = 'Updating password…';

    const { error } = await db.auth.updateUser({ password: p1 });
    if (error) {
      if (msg) { msg.textContent = error.message; msg.className = 'error'; }
    } else {
      if (msg) { msg.textContent = 'Password updated successfully!'; msg.className = 'status'; }
      e.currentTarget.reset();
    }
  });

})();
