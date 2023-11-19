const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    const chunks = [];

    req.on('data', chunk => {
      const buf = Buffer.from(chunk);
      const str = buf.toString();
      chunks.push(str);
    });

    req.on('end', () => {
      try {
        const data = chunks.join('');
        const obj = JSON.parse(data);

        if (!obj.num1 || typeof obj.num1 !== 'number') {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid request. Please provide a valid JSON payload with a single integer field "num1".');
          return;
        }

        const num1 = obj.num1;

        if (num1 % 2 === 0) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(`The number ${num1} is even`);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end(`The number ${num1} is odd`);
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON format in the request body.');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Invalid endpoint. Only POST requests are accepted at the root ("/").');
  }
});

module.exports = server;
