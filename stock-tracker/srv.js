const http=require('http'),fs=require('fs'),path=require('path'),https=require('https'),DIR=__dirname;
http.createServer((req,res)=>{
  // Xueqiu proxy (reads cookie from X-Cookie header)
  if(req.url.startsWith('/xueqiu/')&&req.method==='POST'){
    let body='';req.on('data',c=>body+=c);req.on('end',()=>{
      try{
        const p=JSON.parse(body),uid=p.userId,page=p.page||1;
        const cookie=req.headers['x-cookie']||'';
        const opts={headers:{'User-Agent':'Mozilla/5.0','Cookie':cookie,'Accept':'application/json'}};
        const apiUrl=`https://xueqiu.com/v4/statuses/user_timeline.json?user_id=${uid}&page=${page}&type=0`;
        https.get(apiUrl,opts,pr=>{
          let data='';pr.on('data',c=>data+=c);pr.on('end',()=>{
            res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*'});
            res.end(data);
          });
        }).on('error',e=>{res.writeHead(500,{'Access-Control-Allow-Origin':'*'});res.end(JSON.stringify({error:e.message}))});
      }catch(e){res.writeHead(400,{'Access-Control-Allow-Origin':'*'});res.end(JSON.stringify({error:e.message}))}
    });
    return;
  }
  // General proxy
  if(req.url.startsWith('/proxy/')){
    const target=decodeURIComponent(req.url.slice(7));
    const mod=target.startsWith('https')?https:http;
    mod.get(target,{headers:{Referer:'https://finance.sina.com.cn'}},pr=>{
      let body='';pr.on('data',c=>body+=c);pr.on('end',()=>{
        res.writeHead(200,{'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*'});
        res.end(body);
      });
    }).on('error',e=>{res.writeHead(500,{'Access-Control-Allow-Origin':'*'});res.end(e.message)});
    return;
  }
  let fp=req.url==='/'?'/index.html':req.url.split('?')[0];
  fp=path.join(DIR,fp);
  try{
    const d=fs.readFileSync(fp);
    const m={'html':'text/html','js':'text/javascript','css':'text/css'};
    res.writeHead(200,{'Content-Type':(m[path.extname(fp).slice(1)]||'text/plain')+';charset=utf-8','Cache-Control':'no-store'});
    res.end(d);
  }catch(e){res.writeHead(404);res.end('404')}
}).listen(9000,()=>console.log('http://localhost:9000'));
