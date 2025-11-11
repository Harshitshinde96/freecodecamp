const http = require('http');

function req(options, data) {
  return new Promise((resolve, reject) => {
    const r = http.request(options, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

(async () => {
  try {
    // 1. Create user
    let res = await req({ method: 'POST', hostname: '127.0.0.1', port: 3000, path: '/api/users', headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'username=fcc_test');
    console.log('CREATE USER', res.statusCode, res.body);
    const user = JSON.parse(res.body);

    // 2. List users
    res = await req({ method: 'GET', hostname: '127.0.0.1', port: 3000, path: '/api/users' });
    console.log('LIST USERS', res.statusCode, res.body);

    // 3. Add exercise
    res = await req({ method: 'POST', hostname: '127.0.0.1', port: 3000, path: `/api/users/${user._id}/exercises`, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }, 'description=test&duration=60&date=1990-01-01');
    console.log('ADD EXERCISE', res.statusCode, res.body);

    // 4. Get logs
    res = await req({ method: 'GET', hostname: '127.0.0.1', port: 3000, path: `/api/users/${user._id}/logs` });
    console.log('GET LOGS', res.statusCode, res.body);
  } catch (err) {
    console.error('ERROR', err.message);
  }
})();