const colors={air:'#16171a',black_terracotta:'#302b2c',gray_stained_glass:'#69767e',black_stained_glass:'#333d45',cut_sandstone:'#d9c79d',chiseled_quartz_block:'#f1eee6',quartz_bricks:'#e9e5dd',dark_oak_slab:'#514032',black_concrete:'#17181a',smooth_stone_slab:'#a9a9a7',white_concrete:'#e9e9e9',glowstone:'#f3c96d',granite:'#9e7664',nether_brick_fence:'#35252c',nether_brick_wall:'#38272d',iron_bars:'#a7b0b3',stone:'#888',polished_diorite:'#bcbab4',wooden_door:'#835b3b'};
// Minecraft-inspired material colours derived from schematic palette names, not the competing viewers.
const dyeColors={white:'#e9ecec',orange:'#f07613',magenta:'#bd44c7',light_blue:'#3aafd9',yellow:'#f2ca26',lime:'#80c829',pink:'#e68fb3',gray:'#464b50',light_gray:'#a6a6a2',cyan:'#168b98',purple:'#8734bc',blue:'#335abb',brown:'#89572e',green:'#5b832b',red:'#bd3830',black:'#202226'};
const naturalColors={grass_block:'#609b36',grass:'#69a53a',dirt:'#806345',coarse_dirt:'#776145',podzol:'#6b513a',moss_block:'#4e7437',mud:'#443b40',stone:'#858786',cobblestone:'#797b79',stone_bricks:'#a0a09c',deepslate:'#565b60',cobbled_deepslate:'#50565b',andesite:'#94918d',diorite:'#d7d5d0',granite:'#a37b70',calcite:'#e6e3db',tuff:'#7e887e',sandstone:'#d8c390',sand:'#ddd099',red_sand:'#bc6c3e',quartz_block:'#ece8df',quartz_bricks:'#e7e4dd',smooth_quartz:'#efebe4',iron_block:'#d1d6d5',glass:'#aecbd0',glass_pane:'#a9c9d1',sea_lantern:'#a8dbd4',glowstone:'#c9a85f',lantern:'#d1ae58',torch:'#e5a354',oak_planks:'#b58b50',spruce_planks:'#79512f',birch_planks:'#d9c68b',dark_oak_planks:'#4c3626',jungle_planks:'#ac7652',acacia_planks:'#b77649',mangrove_planks:'#833e43',cherry_planks:'#d8a4a5',crimson_planks:'#7e3a58',warped_planks:'#397b77',bricks:'#9e564b',brick_block:'#99564c',terracotta:'#a87560',water:'#337dab',lava:'#eb6d12',snow:'#f4f8f9',ice:'#a0d6ed',packed_ice:'#80bcdf',netherrack:'#714047',obsidian:'#231d31',bedrock:'#505050'};
function color(palette,id){
 const p=palette[id]||{},n=String(p.name||'air').replace(/^minecraft:/,'');
 if(colors[n])return colors[n];
 if(naturalColors[n])return naturalColors[n];
 let dye=n.match(/^(light_blue|light_gray|white|orange|magenta|yellow|lime|pink|gray|cyan|purple|blue|brown|green|red|black)_(wool|carpet|concrete|concrete_powder|terracotta|glazed_terracotta|stained_glass|stained_glass_pane|shulker_box|banner|bed|candle)$/);
 if(dye)return dyeColors[dye[1]];
 const stateColor=p.states?.color||p.states?.['minecraft:color'];
 if(stateColor&&dyeColors[stateColor])return dyeColors[stateColor];
 if(n.includes('grass')||n.includes('moss'))return '#68a342';
 if(n.includes('leaves')||n.includes('vine')||n.includes('azalea'))return '#4f853b';
 if(n.includes('flower')||n.includes('poppy'))return '#d96d3d';
 if(n.includes('water'))return '#3979af';
 if(n.includes('glass'))return '#8abfc8';
 if(n.includes('prismarine'))return '#6ca79e';
 if(n.includes('quartz'))return '#e9e7e0';
 if(n.includes('slab')||n.includes('stairs')||n.includes('wall')||n.includes('brick')) {
  for(const [key,value] of Object.entries(naturalColors))if(n.includes(key))return value;
 }
 if(n.includes('blackstone'))return '#35353e';
 if(n.includes('deepslate'))return '#5b6065';
 if(n.includes('stone'))return '#9c9c9a';
 if(n.includes('wood')||n.includes('log')||n.includes('planks')||n.includes('trapdoor')||n.includes('fence'))return '#9d754e';
 if(n.includes('concrete'))return '#a8aba9';
 if(n.includes('torch')||n.includes('light'))return '#e9b863';
 return '#8d918f';
}

export function renderPreview(container,model){
 const {data}=model;
 if(!data.layers.length){container.textContent='Preview unavailable';return}
 const [width,height,length]=data.size||[data.width,data.height,data.length];
 const canvas=document.createElement('canvas');
 canvas.width=480;canvas.height=324;
 canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Completed build preview');
 const context=canvas.getContext('2d');
 if(!context)return;
 const blockKey=(x,y,z)=>(y*length+z)*width+x;
 const project=(x,y,z)=>[x-z,(x+z)*.44-y];
 const scale=Math.min(414/(width+length),278/(height+(width+length)*.44));
 const left=240-(width-length)*scale/2,top=162+(height-(width+length)*.44)*scale/2;
 const occupied=new Set();
 const exposed=[];
 data.layers.forEach((blocks,y)=>{
  for(let i=0;i<blocks.length;i+=3)occupied.add(blockKey(blocks[i],y,blocks[i+1]));
 });
 data.layers.forEach((blocks,y)=>{
  for(let i=0;i<blocks.length;i+=3){
   const x=blocks[i],z=blocks[i+1];
   const up=!occupied.has(blockKey(x,y+1,z));
   const east=x+1===width||!occupied.has(blockKey(x+1,y,z));
   const south=z+1===length||!occupied.has(blockKey(x,y,z+1));
   if(up||east||south)exposed.push({x,y,z,id:blocks[i+2],up,east,south});
  }
 });
 exposed.sort((a,b)=>(a.x+a.z+a.y)-(b.x+b.z+b.y));
 function face(vertices,fill,shade){
  context.beginPath();
  for(const [i,vertex] of vertices.entries()){
   const [x,y]=project(...vertex);
   if(i)context.lineTo(left+x*scale,top+y*scale);else context.moveTo(left+x*scale,top+y*scale);
  }
  context.closePath();context.fillStyle=fill;context.fill();
  if(shade){context.fillStyle=shade;context.fill()}
 }
 const palette=data.palette.map((_,id)=>color(data.palette,id));
 for(const {x,y,z,id,up,east,south} of exposed){
  const fill=palette[id];
  if(east)face([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],fill,'#0005');
  if(south)face([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],fill,'#0002');
  if(up)face([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],fill,'');
 }
 container.replaceChildren(canvas);
}
