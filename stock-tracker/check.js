const fs=require('fs');
const html=fs.readFileSync('C:/Users/csm/stock-tracker/index.html','utf8');
const s=html.indexOf('<script>');
const e=html.indexOf('</script>');
const code=html.slice(s+8,e);
const lines=code.split('\n');

// Find unbalanced quotes
for(let i=0;i<lines.length;i++){
  const l=lines[i];
  let sq=0,dq=0,bt=0;
  for(let j=0;j<l.length;j++){
    if(l[j]==="'" && (j===0||l[j-1]!=='\\')) sq++;
    if(l[j]==='"' && (j===0||l[j-1]!=='\\')) dq++;
    if(l[j]==='`') bt++;
  }
  if(sq%2||dq%2||bt%2) console.log('Line '+(i+1)+' unbalanced - sq:'+sq+' dq:'+dq+' bt:'+bt,'|',l.slice(0,100));
}

// Try to parse
try{new Function(code);console.log('PARSE OK')}catch(err){
  console.log('PARSE ERROR:',err.message);
  // Find line
  const m=err.stack.match(/at new Function.*:(\d+):/);
  if(m)console.log('Near line:',m[1]);
}
