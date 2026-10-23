import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { basePath } from './base-path.mjs';
const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.json':'application/json','.svg':'image/svg+xml'};
const server = http.createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (basePath !== '/' && pathname === basePath.slice(0, -1)) {
      res.writeHead(301, {Location: basePath}); res.end(); return;
    }
    if (!pathname.startsWith(basePath)) throw new Error('Outside the site base path');
    let file = path.resolve(root, pathname.slice(basePath.length));
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) { res.writeHead(403); res.end(); return; }
    const info = await stat(file);
    if (info.isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(301,{Location:`${pathname}/${new URL(req.url,'http://localhost').search}`}); res.end(); return; }
      file = path.join(file,'index.html');
    }
    const data = await readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'}); res.end(data);
  } catch { res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'}); res.end(await readFile(path.join(root,'404.html'))); }
});
server.listen(Number(process.env.PORT || 4321), '127.0.0.1', () => console.log(`Local: http://localhost:${server.address().port}${basePath}`));
