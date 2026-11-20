const { execSync } = require('child_process');

try {
  const jsonArg = JSON.stringify({ site_id: "9c7961f3-08c9-43d0-84d2-f60ef7930cb8" });
  // Pass via stdin or escaped quotes
  const out = execSync(`netlify api listSiteDeploys --data ${JSON.stringify(jsonArg)}`, {
    encoding: 'utf8'
  });
  const deploys = JSON.parse(out);
  console.log('Total deploys fetched:', deploys.length);

  // Find the currently published production deploy
  const live = deploys.find(d => d.context === 'production' && d.state === 'ready');
  if (live) {
    console.log('=== CURRENT LIVE PRODUCTION DEPLOY ===');
    console.log('ID:', live.id);
    console.log('Published At:', live.published_at);
    console.log('Deploy URL:', live.deploy_url);
    console.log('Title/Message:', live.title || live.error_message || '(none)');
  }

  console.log('\n=== RECENT 5 DEPLOYS ===');
  deploys.slice(0, 5).forEach(d => {
    console.log(`- ID: ${d.id} | Context: ${d.context} | State: ${d.state} | Created: ${d.created_at}`);
  });
} catch (e) {
  console.error('Error fetching deploys:', e.message);
  if (e.stdout) console.log('stdout:', e.stdout);
  if (e.stderr) console.error('stderr:', e.stderr);
}
