const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath).substring(1);
  const mimeTypes = { html: 'text/html', js: 'application/javascript', css: 'text/css' };
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});