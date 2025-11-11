const fs = require('fs');
const path = require('path');
const http = require('http');
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const filepath = path.join(__dirname, 'uploads', 'testfile.txt');
fs.writeFileSync(filepath, 'hello world');

const stats = fs.statSync(filepath);
const filename = path.basename(filepath);

const payload = [];
payload.push(Buffer.from(`--${boundary}\r\n`));
payload.push(Buffer.from(`Content-Disposition: form-data; name="upfile"; filename="${filename}"\r\n`));
payload.push(Buffer.from(`Content-Type: text/plain\r\n\r\n`));
payload.push(fs.readFileSync(filepath));
payload.push(Buffer.from(`\r\n--${boundary}--\r\n`));
const body = Buffer.concat(payload);

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/api/fileanalyse',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': body.length
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('BODY', data);
  });
});
req.on('error', (e) => console.error('ERR', e));
req.write(body);
req.end();
