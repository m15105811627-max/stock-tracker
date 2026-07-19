const http = require('http');
const fs = require('fs');
const path = require('path');
const DIR = __dirname;

http.createServer((req, res) => {
  let file = req.url === '/' ? '/index.html' : req.url;
  file = path.join(DIR, file);
  try {
    const data = fs.readFileSync(file);
    const ext = path.extname(file).slice(1);
    const types = { html:'text/html', js:'text/javascript', css:'text/css' };
    res.writeHead(200, {'Content-Type': (types[ext]||'text/plain')+';charset=utf-8'});
    res.end(data);
  } catch(e) { res.writeHead(404); res.end('404'); }
}).listen(8888, () => console.log('OK: http://localhost:8888'));
