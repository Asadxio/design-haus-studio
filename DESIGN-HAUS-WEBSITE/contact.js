(() => {
  const form = document.getElementById('enquiryForm');
  if (!form) return;

  const SERVICE_MAP = {
    'architecture': 'Architecture',
    'visualisation': 'Architecture',
    'visualization': 'Architecture',
    'construction': 'Construction',
    'build': 'Construction',
    'consultancy': 'Construction',
    'estimation': 'Construction',
    'interiors': 'Interiors',
    'interior': 'Interiors',
    'realestate': 'Real Estate',
    'commercial': 'Real Estate'
  };

  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('service');
  if (serviceParam) {
    const select = form.querySelector('[name="service"]');
    if (select) {
      const target = SERVICE_MAP[serviceParam.toLowerCase()];
      if (target) {
        select.value = target;
      } else {
        const key = serviceParam.toLowerCase().replace(/[^a-z]/g, '');
        const match = [...select.options].find(o => o.value.toLowerCase().replace(/[^a-z]/g, '').includes(key));
        if (match) select.value = match.value;
      }
    }
  }

  const projectParam = params.get('project');
  if (projectParam) {
    const msgArea = form.querySelector('[name="message"]');
    if (msgArea && !msgArea.value) {
      msgArea.value = `Inquiring about project design study: "${projectParam.trim()}". Please advise on architectural planning and timeline.`;
    }
  }

  const cfg = window.DESIGN_HAUS_CONFIG;
  const db = (cfg && cfg.supabaseUrl && !cfg.supabaseUrl.includes('YOUR-PROJECT') &&
              cfg.supabaseAnonKey && !cfg.supabaseAnonKey.includes('YOUR_') && window.supabase)
              ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey)
              : null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    if (d.get('_hp_website')) {
      console.warn('Spam submission detected.');
      return;
    }
    const name = (d.get('name') || '').trim();
    const phone = (d.get('phone') || '').trim();
    const email = (d.get('email') || '').trim();
    const service = (d.get('service') || '').trim();
    const location = (d.get('location') || '').trim();
    const budget = (d.get('budget') || '').trim();
    const message = (d.get('message') || '').trim();

    const lead = {
      name,
      phone,
      email,
      service,
      location,
      budget,
      message,
      status: 'new',
      is_read: false
    };

    const status = document.getElementById('formStatus');
    const waLines = [
      'Hello DESIGN HAUS, I would like to discuss an architectural project.',
      '',
      `• Name: ${name}`,
      `• Phone: ${phone}`,
      email ? `• Email: ${email}` : '',
      `• Discipline: ${service}`,
      location ? `• Location: ${location}` : '',
      budget ? `• Approximate Budget: ${budget}` : '',
      message ? `• Requirements: ${message}` : '',
      '',
      'Please advise on next steps. Thank you!'
    ].filter(Boolean);

    const waText = waLines.join('\n');
    const waUrl = `https://wa.me/919036389529?text=${encodeURIComponent(waText)}`;

    if (status) {
      status.innerHTML = `Connecting to WhatsApp… If WhatsApp does not open automatically, <a href="${waUrl}" target="_blank" rel="noopener" style="text-decoration:underline;color:#a58c63;font-weight:700;">click here to message Er. Nadeem Keli directly ↗</a>`;
    }

    // Save lead in background if Supabase is connected
    if (db) {
      db.from('leads').insert(lead).catch(err => {
        console.warn('Could not store enquiry in Supabase:', err.message);
      });
    }

    // Fire GA4 lead generation event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        service: service || 'General Enquiry',
        city: location || 'Karnataka'
      });
    }

    // Direct location redirect avoids browser popup blockers
    setTimeout(() => {
      window.location.href = waUrl;
    }, 400);
  });
})();
