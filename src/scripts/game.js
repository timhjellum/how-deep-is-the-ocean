
// ── Audio ──────────────────────────────────────────────────────────────────
const AC = new (window.AudioContext || window.webkitAudioContext)();
function resumeAC(){ if(AC.state==='suspended') AC.resume(); }

function playTone(type){
  resumeAC();
  const t=AC.currentTime;
  if(type==='flag'){
    [523,659,784,1047].forEach((f,i)=>{
      const o=AC.createOscillator(),g=AC.createGain();
      o.type='sine'; o.frequency.setValueAtTime(f,t+i*0.07);
      g.gain.setValueAtTime(0.18,t+i*0.07); g.gain.exponentialRampToValueAtTime(0.001,t+i*0.07+0.25);
      o.connect(g); g.connect(AC.destination); o.start(t+i*0.07); o.stop(t+i*0.07+0.3);
    });
  } else if(type==='ramp'){
    const o=AC.createOscillator(),g=AC.createGain();
    o.type='sawtooth'; o.frequency.setValueAtTime(200,t); o.frequency.exponentialRampToValueAtTime(600,t+0.15);
    g.gain.setValueAtTime(0.12,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.25);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+0.3);
  } else if(type==='crash'){
    const buf=AC.createBuffer(1,AC.sampleRate*0.4,AC.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,1.5);
    const src=AC.createBufferSource(),g=AC.createGain();
    src.buffer=buf; g.gain.setValueAtTime(0.5,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
    src.connect(g); g.connect(AC.destination); src.start(t);
  } else if(type==='yeti'){
    [80,90,70,100,60].forEach((f,i)=>{
      const o=AC.createOscillator(),g=AC.createGain();
      o.type='sawtooth'; o.frequency.setValueAtTime(f,t+i*0.1);
      g.gain.setValueAtTime(0.22,t+i*0.1); g.gain.exponentialRampToValueAtTime(0.001,t+i*0.1+0.35);
      const dist=AC.createWaveShaper();
      const curve=new Float32Array(256);
      for(let k=0;k<256;k++) curve[k]=Math.tanh((k/128-1)*6);
      dist.curve=curve;
      o.connect(dist); dist.connect(g); g.connect(AC.destination);
      o.start(t+i*0.1); o.stop(t+i*0.1+0.4);
    });
  }
}

// ── Pixel art helpers ──────────────────────────────────────────────────────
const P=4;
function buildPixelCanvas(pixels,scale){
  scale=scale||P;
  let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  for(const p of pixels){minX=Math.min(minX,p.dx);minY=Math.min(minY,p.dy);maxX=Math.max(maxX,p.dx);maxY=Math.max(maxY,p.dy);}
  const oc=document.createElement('canvas');
  oc.width=(maxX-minX+1)*scale; oc.height=(maxY-minY+1)*scale;
  const octx=oc.getContext('2d'); octx.imageSmoothingEnabled=false;
  for(const p of pixels){octx.fillStyle=p.c;octx.fillRect((p.dx-minX)*scale,(p.dy-minY)*scale,scale,scale);}
  return {canvas:oc,originX:-minX*scale,originY:-minY*scale};
}

// ── Character definitions ──────────────────────────────────────────────────
function makeSkierFrames(jc,pc,hc,sc){
  const skin='#f5c07a',goggle='#88ccff',boot='#221100',pole='#888';
  return {
    straight:[
      {dx:-3,dy:5,c:sc},{dx:-2,dy:5,c:sc},{dx:-1,dy:5,c:sc},{dx:0,dy:5,c:sc},{dx:1,dy:5,c:sc},{dx:2,dy:5,c:sc},{dx:3,dy:5,c:sc},
      {dx:-1,dy:4,c:boot},{dx:1,dy:4,c:boot},
      {dx:-1,dy:3,c:pc},{dx:0,dy:3,c:pc},{dx:1,dy:3,c:pc},{dx:-1,dy:2,c:pc},{dx:1,dy:2,c:pc},
      {dx:-2,dy:1,c:jc},{dx:-1,dy:1,c:jc},{dx:0,dy:1,c:jc},{dx:1,dy:1,c:jc},{dx:2,dy:1,c:jc},
      {dx:-1,dy:0,c:jc},{dx:0,dy:0,c:jc},{dx:1,dy:0,c:jc},
      {dx:0,dy:-1,c:skin},{dx:-1,dy:-1,c:skin},{dx:1,dy:-1,c:skin},
      {dx:0,dy:-2,c:skin},{dx:-1,dy:-2,c:goggle},{dx:1,dy:-2,c:goggle},
      {dx:-1,dy:-3,c:hc},{dx:0,dy:-3,c:hc},{dx:1,dy:-3,c:hc},
      {dx:-3,dy:1,c:pole},{dx:-3,dy:2,c:pole},{dx:-3,dy:3,c:pole},
      {dx:3,dy:1,c:pole},{dx:3,dy:2,c:pole},{dx:3,dy:3,c:pole},
    ],
    left:[
      {dx:-4,dy:5,c:sc},{dx:-3,dy:5,c:sc},{dx:-2,dy:5,c:sc},{dx:-1,dy:5,c:sc},{dx:0,dy:5,c:sc},{dx:1,dy:5,c:sc},{dx:2,dy:5,c:sc},
      {dx:-2,dy:4,c:boot},{dx:0,dy:4,c:boot},
      {dx:-2,dy:3,c:pc},{dx:-1,dy:3,c:pc},{dx:0,dy:3,c:pc},{dx:-2,dy:2,c:pc},{dx:0,dy:2,c:pc},
      {dx:-2,dy:1,c:jc},{dx:-1,dy:1,c:jc},{dx:0,dy:1,c:jc},{dx:1,dy:1,c:jc},{dx:2,dy:1,c:jc},
      {dx:-1,dy:0,c:jc},{dx:0,dy:0,c:jc},{dx:1,dy:0,c:jc},
      {dx:-1,dy:-1,c:skin},{dx:0,dy:-1,c:skin},{dx:1,dy:-1,c:skin},
      {dx:-1,dy:-2,c:goggle},{dx:0,dy:-2,c:skin},{dx:1,dy:-2,c:goggle},
      {dx:-1,dy:-3,c:hc},{dx:0,dy:-3,c:hc},{dx:1,dy:-3,c:hc},
      {dx:-3,dy:1,c:pole},{dx:-4,dy:2,c:pole},{dx:-4,dy:3,c:pole},
      {dx:3,dy:1,c:pole},{dx:3,dy:2,c:pole},{dx:4,dy:3,c:pole},
    ],
    right:[
      {dx:-2,dy:5,c:sc},{dx:-1,dy:5,c:sc},{dx:0,dy:5,c:sc},{dx:1,dy:5,c:sc},{dx:2,dy:5,c:sc},{dx:3,dy:5,c:sc},{dx:4,dy:5,c:sc},
      {dx:0,dy:4,c:boot},{dx:2,dy:4,c:boot},
      {dx:0,dy:3,c:pc},{dx:1,dy:3,c:pc},{dx:2,dy:3,c:pc},{dx:0,dy:2,c:pc},{dx:2,dy:2,c:pc},
      {dx:-2,dy:1,c:jc},{dx:-1,dy:1,c:jc},{dx:0,dy:1,c:jc},{dx:1,dy:1,c:jc},{dx:2,dy:1,c:jc},
      {dx:-1,dy:0,c:jc},{dx:0,dy:0,c:jc},{dx:1,dy:0,c:jc},
      {dx:-1,dy:-1,c:skin},{dx:0,dy:-1,c:skin},{dx:1,dy:-1,c:skin},
      {dx:-1,dy:-2,c:goggle},{dx:0,dy:-2,c:skin},{dx:1,dy:-2,c:goggle},
      {dx:-1,dy:-3,c:hc},{dx:0,dy:-3,c:hc},{dx:1,dy:-3,c:hc},
      {dx:-3,dy:1,c:pole},{dx:-4,dy:2,c:pole},{dx:-4,dy:3,c:pole},
      {dx:3,dy:1,c:pole},{dx:4,dy:2,c:pole},{dx:4,dy:3,c:pole},
    ],
    crashed:[
      {dx:-4,dy:2,c:sc},{dx:-3,dy:2,c:sc},{dx:-2,dy:2,c:sc},{dx:-1,dy:2,c:sc},{dx:0,dy:2,c:sc},{dx:1,dy:2,c:sc},{dx:2,dy:2,c:sc},{dx:3,dy:2,c:sc},
      {dx:-3,dy:1,c:boot},{dx:-1,dy:1,c:boot},
      {dx:-3,dy:0,c:pc},{dx:-2,dy:0,c:pc},{dx:-1,dy:0,c:pc},
      {dx:-4,dy:-1,c:jc},{dx:-3,dy:-1,c:jc},{dx:-2,dy:-1,c:jc},{dx:-1,dy:-1,c:jc},{dx:0,dy:-1,c:jc},{dx:1,dy:-1,c:jc},
      {dx:2,dy:-1,c:skin},{dx:3,dy:-1,c:skin},
      {dx:2,dy:-2,c:goggle},{dx:3,dy:-2,c:hc},{dx:4,dy:-2,c:hc},
      {dx:2,dy:0,c:pole},{dx:3,dy:1,c:pole},{dx:-4,dy:0,c:pole},{dx:-5,dy:-1,c:pole},
    ]
  };
}

function makeSnowboarderFrames(jc,pc,hc,bc){
  const skin='#f5c07a',goggle='#44aaff',boot='#333',glove='#555';
  return {
    straight:[
      {dx:-4,dy:5,c:bc},{dx:-3,dy:5,c:bc},{dx:-2,dy:5,c:bc},{dx:-1,dy:5,c:bc},{dx:0,dy:5,c:bc},{dx:1,dy:5,c:bc},{dx:2,dy:5,c:bc},{dx:3,dy:5,c:bc},{dx:4,dy:5,c:bc},
      {dx:-1,dy:4,c:boot},{dx:1,dy:4,c:boot},
      {dx:-2,dy:3,c:pc},{dx:-1,dy:3,c:pc},{dx:0,dy:3,c:pc},{dx:1,dy:3,c:pc},{dx:2,dy:3,c:pc},
      {dx:-1,dy:2,c:pc},{dx:0,dy:2,c:pc},{dx:1,dy:2,c:pc},
      {dx:-2,dy:1,c:jc},{dx:-1,dy:1,c:jc},{dx:0,dy:1,c:jc},{dx:1,dy:1,c:jc},{dx:2,dy:1,c:jc},
      {dx:-1,dy:0,c:jc},{dx:0,dy:0,c:jc},{dx:1,dy:0,c:jc},
      {dx:-4,dy:1,c:glove},{dx:-3,dy:1,c:jc},{dx:3,dy:1,c:jc},{dx:4,dy:1,c:glove},
      {dx:-1,dy:-1,c:skin},{dx:0,dy:-1,c:skin},{dx:1,dy:-1,c:skin},
      {dx:-1,dy:-2,c:goggle},{dx:0,dy:-2,c:skin},{dx:1,dy:-2,c:goggle},
      {dx:-1,dy:-3,c:hc},{dx:0,dy:-3,c:hc},{dx:1,dy:-3,c:hc},{dx:0,dy:-4,c:hc},
    ],
    left:[
      {dx:-5,dy:5,c:bc},{dx:-4,dy:5,c:bc},{dx:-3,dy:5,c:bc},{dx:-2,dy:5,c:bc},{dx:-1,dy:5,c:bc},{dx:0,dy:5,c:bc},{dx:1,dy:5,c:bc},{dx:2,dy:5,c:bc},{dx:3,dy:5,c:bc},
      {dx:-2,dy:4,c:boot},{dx:0,dy:4,c:boot},
      {dx:-3,dy:3,c:pc},{dx:-2,dy:3,c:pc},{dx:-1,dy:3,c:pc},{dx:0,dy:3,c:pc},{dx:1,dy:3,c:pc},
      {dx:-2,dy:2,c:pc},{dx:-1,dy:2,c:pc},{dx:0,dy:2,c:pc},
      {dx:-2,dy:1,c:jc},{dx:-1,dy:1,c:jc},{dx:0,dy:1,c:jc},{dx:1,dy:1,c:jc},{dx:2,dy:1,c:jc},
      {dx:-1,dy:0,c:jc},{dx:0,dy:0,c:jc},{dx:1,dy:0,c:jc},
      {dx:-4,dy:0,c:glove},{dx:-3,dy:1,c:jc},{dx:3,dy:1,c:jc},{dx:4,dy:0,c:glove},
      {dx:-1,dy:-1,c:skin},{dx:0,dy:-1,c:skin},{dx:1,dy:-1,c:skin},
      {dx:-1,dy:-2,c:goggle},{dx:0,dy:-2,c:skin},{dx:1,dy:-2,c:goggle},
      {dx:-1,dy:-3,c:hc},{dx:0,dy:-3,c:hc},{dx:1,dy:-3,c:hc},{dx:0,dy:-4,c:hc},
    ],
    right:[
      {dx:-3,dy:5,c:bc},{dx:-2,dy:5,c:bc},{dx:-1,dy:5,c:bc},{dx:0,dy:5,c:bc},{dx:1,dy:5,c:bc},{dx:2,dy:5,c:bc},{dx:3,dy:5,c:bc},{dx:4,dy:5,c:bc},{dx:5,dy:5,c:bc},
      {dx:0,dy:4,c:boot},{dx:2,dy:4,c:boot},
      {dx:-1,dy:3,c:pc},{dx:0,dy:3,c:pc},{dx:1,dy:3,c:pc},{dx:2,dy:3,c:pc},{dx:3,dy:3,c:pc},
      {dx:0,dy:2,c:pc},{dx:1,dy:2,c:pc},{dx:2,dy:2,c:pc},
      {dx:-2,dy:1,c:jc},{dx:-1,dy:1,c:jc},{dx:0,dy:1,c:jc},{dx:1,dy:1,c:jc},{dx:2,dy:1,c:jc},
      {dx:-1,dy:0,c:jc},{dx:0,dy:0,c:jc},{dx:1,dy:0,c:jc},
      {dx:-4,dy:0,c:glove},{dx:-3,dy:1,c:jc},{dx:3,dy:1,c:jc},{dx:4,dy:0,c:glove},
      {dx:-1,dy:-1,c:skin},{dx:0,dy:-1,c:skin},{dx:1,dy:-1,c:skin},
      {dx:-1,dy:-2,c:goggle},{dx:0,dy:-2,c:skin},{dx:1,dy:-2,c:goggle},
      {dx:-1,dy:-3,c:hc},{dx:0,dy:-3,c:hc},{dx:1,dy:-3,c:hc},{dx:0,dy:-4,c:hc},
    ],
    crashed:[
      {dx:-5,dy:3,c:bc},{dx:-4,dy:3,c:bc},{dx:-3,dy:3,c:bc},{dx:-2,dy:3,c:bc},{dx:-1,dy:3,c:bc},{dx:0,dy:3,c:bc},{dx:1,dy:3,c:bc},{dx:2,dy:3,c:bc},{dx:3,dy:3,c:bc},
      {dx:-3,dy:2,c:boot},{dx:-1,dy:2,c:boot},
      {dx:-3,dy:1,c:pc},{dx:-2,dy:1,c:pc},{dx:-1,dy:1,c:pc},
      {dx:-4,dy:0,c:jc},{dx:-3,dy:0,c:jc},{dx:-2,dy:0,c:jc},{dx:-1,dy:0,c:jc},{dx:0,dy:0,c:jc},{dx:1,dy:0,c:jc},
      {dx:2,dy:0,c:skin},{dx:3,dy:0,c:skin},
      {dx:2,dy:-1,c:goggle},{dx:3,dy:-1,c:hc},{dx:4,dy:-1,c:hc},
      {dx:-5,dy:1,c:glove},{dx:4,dy:-2,c:glove},
    ]
  };
}

const CHARACTERS=[
  {name:'Red Racer',  type:'Skier',       emoji:'⛷️', frames:makeSkierFrames('#cc2211','#2244cc','#cc2211','#111133')},
  {name:'Snow Fox',   type:'Skier',       emoji:'⛷️', frames:makeSkierFrames('#ee7700','#225500','#ee7700','#442200')},
  {name:'Ice Queen',  type:'Skier',       emoji:'⛷️', frames:makeSkierFrames('#6633cc','#cc88ff','#cc88ff','#220055')},
  {name:'Powder Pro', type:'Snowboarder', emoji:'🏂', frames:makeSnowboarderFrames('#1166cc','#ff6600','#1166cc','#cc4400')},
  {name:'Half-Pipe',  type:'Snowboarder', emoji:'🏂', frames:makeSnowboarderFrames('#22aa44','#222222','#ffcc00','#005522')},
  {name:'Shred Queen',type:'Snowboarder', emoji:'🏂', frames:makeSnowboarderFrames('#cc1166','#ffffff','#cc1166','#880033')},
];

const builtChars=CHARACTERS.map(ch=>{
  const fc={};
  for(const[fname,pixels]of Object.entries(ch.frames)) fc[fname]=buildPixelCanvas(pixels,P);
  return {...ch,fc};
});

const yetiPixels=[
  {dx:-2,dy:3,c:'#dde'},{dx:-1,dy:3,c:'#dde'},{dx:0,dy:3,c:'#dde'},{dx:1,dy:3,c:'#dde'},{dx:2,dy:3,c:'#dde'},
  {dx:-3,dy:2,c:'#dde'},{dx:-2,dy:2,c:'#eef'},{dx:-1,dy:2,c:'#eef'},{dx:0,dy:2,c:'#eef'},{dx:1,dy:2,c:'#eef'},{dx:2,dy:2,c:'#eef'},{dx:3,dy:2,c:'#dde'},
  {dx:-3,dy:1,c:'#dde'},{dx:-2,dy:1,c:'#eef'},{dx:-1,dy:1,c:'#eef'},{dx:0,dy:1,c:'#eef'},{dx:1,dy:1,c:'#eef'},{dx:2,dy:1,c:'#eef'},{dx:3,dy:1,c:'#dde'},
  {dx:-2,dy:0,c:'#dde'},{dx:-1,dy:0,c:'#eef'},{dx:0,dy:0,c:'#eef'},{dx:1,dy:0,c:'#eef'},{dx:2,dy:0,c:'#dde'},
  {dx:-4,dy:1,c:'#ccd'},{dx:-4,dy:2,c:'#ccd'},{dx:4,dy:1,c:'#ccd'},{dx:4,dy:2,c:'#ccd'},
  {dx:-2,dy:-1,c:'#dde'},{dx:-1,dy:-1,c:'#eef'},{dx:0,dy:-1,c:'#eef'},{dx:1,dy:-1,c:'#eef'},{dx:2,dy:-1,c:'#dde'},
  {dx:-2,dy:-2,c:'#eef'},{dx:-1,dy:-2,c:'#eef'},{dx:0,dy:-2,c:'#eef'},{dx:1,dy:-2,c:'#eef'},{dx:2,dy:-2,c:'#eef'},
  {dx:-2,dy:-3,c:'#dde'},{dx:-1,dy:-3,c:'#eef'},{dx:0,dy:-3,c:'#eef'},{dx:1,dy:-3,c:'#eef'},{dx:2,dy:-3,c:'#dde'},
  {dx:-1,dy:-2,c:'#ff2200'},{dx:1,dy:-2,c:'#ff2200'},
  {dx:-1,dy:-1,c:'#ffffff'},{dx:0,dy:-1,c:'#aa4400'},{dx:1,dy:-1,c:'#ffffff'},
  {dx:-2,dy:4,c:'#aab'},{dx:-1,dy:4,c:'#aab'},{dx:1,dy:4,c:'#aab'},{dx:2,dy:4,c:'#aab'},
];
const yetiArt=buildPixelCanvas(yetiPixels,5);

// ── Character select ───────────────────────────────────────────────────────
let selectedChar=0;
function buildCharGrid(){
  const grid=document.getElementById('charGrid');
  grid.innerHTML='';
  builtChars.forEach((ch,i)=>{
    const card=document.createElement('div');
    card.className='char-card'+(i===0?' selected':'');
    card.onclick=()=>{document.querySelectorAll('.char-card').forEach(c=>c.classList.remove('selected'));card.classList.add('selected');selectedChar=i;};
    const previewScale=5;
    const pixels=Object.values(ch.frames)[0];
    let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
    for(const p of pixels){minX=Math.min(minX,p.dx);minY=Math.min(minY,p.dy);maxX=Math.max(maxX,p.dx);maxY=Math.max(maxY,p.dy);}
    const pc2=document.createElement('canvas');
    pc2.width=(maxX-minX+1)*previewScale; pc2.height=(maxY-minY+1)*previewScale;
    pc2.style.width=pc2.width+'px'; pc2.style.height=pc2.height+'px';
    const pctx=pc2.getContext('2d'); pctx.imageSmoothingEnabled=false;
    for(const p of pixels){pctx.fillStyle=p.c;pctx.fillRect((p.dx-minX)*previewScale,(p.dy-minY)*previewScale,previewScale,previewScale);}
    card.appendChild(pc2);
    const nm=document.createElement('div'); nm.className='char-name'; nm.textContent=ch.emoji+' '+ch.name; card.appendChild(nm);
    const tp=document.createElement('div'); tp.className='char-type'; tp.textContent=ch.type; card.appendChild(tp);
    grid.appendChild(card);
  });
}
buildCharGrid();

// ── Game canvas ────────────────────────────────────────────────────────────
const canvas=document.getElementById('ski');
const ctx=canvas.getContext('2d');
let W,H,skierY=0,mouseX;
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;skierY=H/2-40;if(mouseX===undefined)mouseX=W/2;}
resize(); window.addEventListener('resize',resize);

// ── Game state ─────────────────────────────────────────────────────────────
let state='title',score=0,distance=0,speed=3,fastMode=false;
let skierX=0,skierVX=0,worldY=0;
let objects=[],particles=[],tracks=[];
let yeti=null,yetiActive=false,yetiGrowled=false,gameOver=false;
let crashed=false,crashTimer=0,frameCount=0;
let lives=3,invincible=false,invincibleTimer=0;
let animId=null;
const YETI_SPAWN_DIST=2000,INVINCIBLE_FRAMES=180;

function rng(a,b){return a+Math.random()*(b-a);}
function irng(a,b){return Math.floor(rng(a,b+1));}
function updateLivesDisplay(){document.getElementById('lives').textContent=builtChars[selectedChar].emoji.repeat(lives);}

function spawnObjects(baseY){
  const count=irng(3,6);
  for(let i=0;i<count;i++){
    const t=Math.random();
    const type=t<0.35?'tree':t<0.55?'rock':t<0.7?'tree-large':t<0.85?'flag':'ramp';
    objects.push({type,x:rng(30,W-30),y:baseY+rng(0,80),hit:false,bobPhase:Math.random()*Math.PI*2});
  }
}
function initObjects(){objects=[];for(let y=H+80;y<H+2000;y+=120)spawnObjects(y);}

function drawSnow(){
  ctx.fillStyle='#ddeef8';ctx.fillRect(0,0,W,H);
  ctx.fillStyle='rgba(255,255,255,0.4)';
  for(let i=0;i<40;i++){const sx=(i*97+worldY*0.3)%W,sy=(i*61+worldY*0.5)%H;ctx.beginPath();ctx.arc(sx,sy,2,0,Math.PI*2);ctx.fill();}
}
function drawTracks(){
  ctx.strokeStyle='rgba(150,180,210,0.5)';ctx.lineWidth=2;
  for(const t of tracks){const sy=t.y-worldY+skierY;if(sy<-10||sy>H+10)continue;ctx.beginPath();ctx.moveTo(t.x-5,sy);ctx.lineTo(t.x-5+t.vx*3,sy-8);ctx.moveTo(t.x+5,sy);ctx.lineTo(t.x+5+t.vx*3,sy-8);ctx.stroke();}
}
function drawTree(x,y,large){
  const sz=large?1.5:1;
  ctx.fillStyle='#2d5a1b';ctx.beginPath();ctx.moveTo(x,y-22*sz);ctx.lineTo(x-12*sz,y+4*sz);ctx.lineTo(x+12*sz,y+4*sz);ctx.closePath();ctx.fill();
  ctx.fillStyle='#3a7025';ctx.beginPath();ctx.moveTo(x,y-14*sz);ctx.lineTo(x-10*sz,y+10*sz);ctx.lineTo(x+10*sz,y+10*sz);ctx.closePath();ctx.fill();
  ctx.fillStyle='#7a4a25';ctx.fillRect(x-3*sz,y+8*sz,6*sz,8*sz);
  ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(x-2*sz,y-20*sz,4*sz,6*sz);
}
function drawRock(x,y){
  ctx.fillStyle='#667788';ctx.beginPath();ctx.ellipse(x,y+2,12,8,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#8899aa';ctx.beginPath();ctx.ellipse(x-2,y-2,9,6,-0.3,0,Math.PI*2);ctx.fill();
}
function drawFlag(x,y,phase){
  const bob=Math.sin(phase+frameCount*0.08)*2;
  ctx.strokeStyle='#cc3';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y+10);ctx.lineTo(x,y-14+bob);ctx.stroke();
  ctx.fillStyle='#ffcc00';ctx.beginPath();ctx.moveTo(x,y-14+bob);ctx.lineTo(x+14,y-8+bob);ctx.lineTo(x,y-2+bob);ctx.closePath();ctx.fill();
}
function drawRamp(x,y){
  ctx.fillStyle='#c8ddf0';ctx.beginPath();ctx.moveTo(x-18,y+8);ctx.lineTo(x+18,y+8);ctx.lineTo(x+18,y-10);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#aabdd0';ctx.lineWidth=1;ctx.stroke();
}
function drawParticles(){
  for(const p of particles){ctx.globalAlpha=p.life;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
}
function spawnCrashParticles(x,y){for(let i=0;i<20;i++)particles.push({x,y,vx:rng(-4,4),vy:rng(-6,2),r:rng(2,5),life:1,color:Math.random()>0.5?'#ffffff':'#aaccee'});}
function spawnFlagParticles(x,y){for(let i=0;i<10;i++)particles.push({x,y,vx:rng(-3,3),vy:rng(-5,-1),r:rng(2,4),life:1,color:'#ffcc00'});}

function drawCharacter(x,y,vx,isCrashed){
  const ch=builtChars[selectedChar];
  const frame=isCrashed?'crashed':vx<-1.5?'left':vx>1.5?'right':'straight';
  const f=ch.fc[frame];
  ctx.imageSmoothingEnabled=false;
  if(invincible&&Math.floor(frameCount/4)%2===0)ctx.globalAlpha=0.3;
  ctx.drawImage(f.canvas,Math.round(x-f.originX),Math.round(y-f.originY));
  ctx.globalAlpha=1;
}
function drawYeti(x,y){
  const hop=Math.abs(Math.sin(frameCount*0.15))*8;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(yetiArt.canvas,Math.round(x-yetiArt.originX),Math.round(y-yetiArt.originY-hop));
}
function checkCollision(obj){
  if(invincible)return false;
  const oy=obj.y-worldY+skierY;
  return Math.hypot(skierX-obj.x,skierY-oy)<({tree:10,rock:10,'tree-large':15,flag:12,ramp:14}[obj.type]||12)+10;
}
function loseLife(x,y){
  lives--;updateLivesDisplay();
  spawnCrashParticles(x,y);playTone('crash');
  crashed=true;crashTimer=80;skierVX=0;
  if(lives<=0){setTimeout(showGameOver,1200);gameOver=true;}
  else{setTimeout(()=>{crashed=false;invincible=true;invincibleTimer=INVINCIBLE_FRAMES;},1200);}
}

function startGame(){
  resumeAC();
  document.getElementById('overlay').style.display='none';
  state='playing';score=0;distance=0;speed=fastMode?5:3;
  skierX=W/2;skierVX=0;worldY=0;frameCount=0;
  objects=[];particles=[];tracks=[];
  yeti=null;yetiActive=false;yetiGrowled=false;crashed=false;crashTimer=0;gameOver=false;
  lives=3;invincible=false;invincibleTimer=0;
  mouseX=W/2;updateLivesDisplay();initObjects();
  if(animId)cancelAnimationFrame(animId);
  animId=requestAnimationFrame(loop);
}
function showGameOver(){
  const ov=document.getElementById('overlay');
  ov.style.display='flex';
  ov.innerHTML='<h2>💀 Wiped Out!</h2><p>Score: '+Math.floor(score)+'</p><p>Distance: '+Math.floor(distance)+'m</p><p style="margin-bottom:20px">'+(yetiActive?'The yeti got you...':'Better luck next time!')+'</p><button id="startBtn" onclick="location.reload()">Play Again</button>';
}

function loop(){
  frameCount++;
  if(invincible){invincibleTimer--;if(invincibleTimer<=0)invincible=false;}
  if(!crashed){
    const targetVX=(mouseX-skierX)*0.06;
    skierVX+=(targetVX-skierVX)*0.15;
    skierVX=Math.max(-8,Math.min(8,skierVX));
    skierX+=skierVX;skierX=Math.max(20,Math.min(W-20,skierX));
    const spd=fastMode?speed*1.7:speed;
    worldY+=spd;distance+=spd*0.1;score+=spd*0.05;
    if(distance>YETI_SPAWN_DIST&&!yetiActive){yetiActive=true;yeti={x:skierX,worldY:worldY+H*2};}
    if(yetiActive&&yeti){
      const ysy=yeti.worldY-worldY+skierY;
      if(!yetiGrowled&&ysy<H+50){yetiGrowled=true;playTone('yeti');}
      const dy=skierY-ysy,dx=skierX-yeti.x,d=Math.hypot(dx,dy);
      const ys=fastMode?2.5:1.8;
      if(d>0){yeti.x+=(dx/d)*ys;yeti.worldY+=((-dy)/d)*ys*0.5;yeti.worldY-=spd;}
      if(d<30&&!gameOver&&!invincible){loseLife(skierX,skierY);}
    }
    if(frameCount%3===0){tracks.push({x:skierX,y:worldY,vx:skierVX});if(tracks.length>300)tracks.shift();}
    const maxObjY=objects.length?Math.max(...objects.map(o=>o.y)):H+100;
    if(worldY+H*1.5>maxObjY)spawnObjects(maxObjY+irng(60,140));
    objects=objects.filter(o=>o.y-worldY+skierY>-100);
    for(const obj of objects){
      if(obj.hit)continue;
      if(checkCollision(obj)){
        if(obj.type==='flag'){score+=50;spawnFlagParticles(obj.x,obj.y-worldY+skierY);playTone('flag');obj.hit=true;}
        else if(obj.type==='ramp'){skierVX*=0.3;score+=10;playTone('ramp');obj.hit=true;}
        else if(!gameOver){obj.hit=true;loseLife(skierX,skierY);}
      }
    }
    speed=Math.min(fastMode?8:6,speed+0.0003);
  } else {crashTimer--;}
  for(const p of particles){p.x+=p.vx;p.y+=p.vy;p.vy+=0.2;p.life-=0.025;}
  particles=particles.filter(p=>p.life>0);
  drawSnow();drawTracks();
  for(const obj of objects){
    if(obj.hit&&obj.type!=='flag')continue;
    const sy=obj.y-worldY+skierY;
    if(sy<-30||sy>H+30)continue;
    if(obj.type==='tree')drawTree(obj.x,sy,false);
    else if(obj.type==='tree-large')drawTree(obj.x,sy,true);
    else if(obj.type==='rock')drawRock(obj.x,sy);
    else if(obj.type==='flag'&&!obj.hit)drawFlag(obj.x,sy,obj.bobPhase);
    else if(obj.type==='ramp'&&!obj.hit)drawRamp(obj.x,sy);
  }
  if(yetiActive&&yeti)drawYeti(yeti.x,yeti.worldY-worldY+skierY);
  drawParticles();
  drawCharacter(skierX,skierY,skierVX,crashed&&crashTimer>0);
  document.getElementById('scoreDisplay').textContent='Score: '+Math.floor(score);
  document.getElementById('distDisplay').textContent='Distance: '+Math.floor(distance)+'m';
  if(!gameOver)animId=requestAnimationFrame(loop);
}

canvas.addEventListener('mousemove',e=>{mouseX=e.clientX;});
canvas.addEventListener('touchmove',e=>{e.preventDefault();mouseX=e.touches[0].clientX;},{passive:false});
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft')mouseX=Math.max(0,mouseX-30);
  if(e.key==='ArrowRight')mouseX=Math.min(W,mouseX+30);
});
document.getElementById('speedBtn').addEventListener('click',function(){
  fastMode=!fastMode;this.textContent=fastMode?'🐌 Normal':'⚡ Fast';
  if(state==='playing')speed=fastMode?speed*1.4:speed/1.4;
});
window.startGame=startGame;