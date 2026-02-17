import http from 'http';

const email = 'test@example.com';
const password = 'testpass123';

const data = JSON.stringify({ email, password });

const options = {
  hostname: 'localhost',
  port: 1999,
  path: '/api/admin/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS:`, JSON.stringify(res.headers, null, 2));
  
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('BODY:', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  process.exit(1);
});

req.write(data);
req.end();
