var A={tab:null,scr:null,hist:[],data:{},
tabs:['listar','massivo','restritas','custos','logistica','pedidos','catalogo','ads','promocoes'],
names:{listar:'\u{1F4E6} Listar',massivo:'\u{1F4E6}\u{1F4E6} Massivo',restritas:'\u{1F6AB} Restritas',custos:'\u{1F4B0} Custos',logistica:'\u{1F69A} Logistica',pedidos:'\u{1F4CB} Pedidos',catalogo:'\u2B50 Catalogo',ads:'\u{1F4E2} Ads',promocoes:'\u{1F3F7} Promos'}};

async function init(){
renderTabs();
for(var t of A.tabs){try{var r=await fetch('data/aba_'+t+'.json');if(r.ok)A.data[t]=await r.json()}catch(e){}}
go(A.tabs[0]);}

function renderTabs(){
var h='';for(var t of A.tabs)h+='<button class="tab" data-t="'+t+'" onclick="go(\''+t+'\')">'+A.names[t]+'</button>';
document.getElementById('tabs').innerHTML=h;}

function go(t){A.tab=t;A.hist=[];
document.querySelectorAll('.tab').forEach(function(b){b.classList.remove('on')});
var b=document.querySelector('[data-t="'+t+'"]');if(b){b.classList.add('on');b.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'})}
show('inicio');}

function show(id){
A.scr=id;var d=A.data[A.tab];
if(!d||!d[id]){document.getElementById('content').innerHTML='<div class="scr"><p class="q">Tela nao encontrada</p></div>';return}
render(d[id]);foot();window.scrollTo({top:0,behavior:'smooth'});}

function render(s){
var h='<div class="scr">';
if(s.question)h+='<h1 class="q">'+s.question+'</h1>';
if(s.info)h+='<div class="info">'+fmt(s.info)+'</div>';
if(s.highlight)h+='<div class="hi">'+fmt(s.highlight)+'</div>';
if(s.warning)h+='<div class="warn">\u26A0\uFE0F '+fmt(s.warning)+'</div>';
if(s.success)h+='<div class="ok">\u2705 '+fmt(s.success)+'</div>';
if(s.steps){h+='<ol class="steps">';for(var i=0;i<s.steps.length;i++)h+='<li>'+fmt(s.steps[i])+'</li>';h+='</ol>';}
if(s.checklist){h+='<ul class="cl">';for(var i=0;i<s.checklist.length;i++)h+='<li>'+fmt(s.checklist[i])+'</li>';h+='</ul>';}
if(s.table){h+='<table class="tbl">';if(s.table.headers){h+='<tr>';for(var i=0;i<s.table.headers.length;i++)h+='<th>'+s.table.headers[i]+'</th>';h+='</tr>';}if(s.table.rows){for(var r=0;r<s.table.rows.length;r++){h+='<tr>';for(var c=0;c<s.table.rows[r].length;c++)h+='<td>'+s.table.rows[r][c]+'</td>';h+='</tr>';}}h+='</table>';}
if(s.options){h+='<div class="opts">';for(var i=0;i<s.options.length;i++){var o=s.options[i];if(o.link)h+='<a href="'+o.link+'" target="_blank" class="ob lk"><span class="em">'+(o.emoji||'\u{1F517}')+'</span><span class="lb">'+o.text+'</span></a>';else if(o.next)h+='<button class="ob" onclick="nav(\''+o.next+'\')"><span class="em">'+(o.emoji||'\u{1F449}')+'</span><span class="lb">'+o.text+'</span></button>';}h+='</div>';}
h+='</div>';document.getElementById('content').innerHTML=h;}

function nav(t){A.hist.push(A.scr);if(A.tabs.indexOf(t)>=0){go(t);return;}show(t);}
function back(){if(A.hist.length>0){var p=A.hist.pop();show(p);}}
function home(){A.hist=[];show('inicio');}
function lista(){window.open('https://amazonexteu.qualtrics.com/jfe/form/SV_eEhccc2rqm5WURw','_blank');}
function foot(){var f=document.getElementById('footer');if(A.hist.length<2){f.style.display='none';return;}f.style.display='flex';f.innerHTML='<button class="fb" onclick="back()">\u21A9\uFE0F Voltar</button><button class="fb" onclick="home()">\u{1F3E0} Inicio</button><button class="fb" onclick="lista()">\u{1F4CB} Lista pra mim</button>';}
function fmt(t){if(!t)return'';return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\\n/g,'<br>');}
document.addEventListener('DOMContentLoaded',init);
