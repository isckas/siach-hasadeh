/* Siach HaSadeh, version 2: "the day over the field".
   "Siach" is prayer: Yitzchak went out lasuach basadeh, to pray in the field toward evening (Bereshit 24:63).
   The top of the page is today's sky over the Ma'ale Adumim hills: morning to night across the band,
   every tefillah pinned at its time, and the sun where it is right now. Below it, the week laid out
   in Jerusalem-stone blocks. Same data, engine and board manager as version 1 (../app.js). */
(function(){
'use strict';
var A=null;
var D={dr:'',focusDr:false,ni:0,zDate:'',first:true,lastMin:-1,lastDay:'',slide:0,slideT:null,scT:null,sc:{pos:0,dir:1,hold:90},anim:0};
var reduce=function(){return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);};

var STR={
  v2_next:['התפילה הבאה','Next tefillah'],
  v2_today:['תפילות היום','Today\'s tefillot'], v2_tomorrow_t:['תפילות מחר','Tomorrow\'s tefillot'],
  v2_shiurim:['שיעורים','Shiurim'],
  v2_week:['לוח הזמנים המלא','Full schedule'],
  v2_all_notices:['כל ההודעות','All notices'],
  v2_prev:['ההודעה הקודמת','Previous notice'], v2_nextn:['ההודעה הבאה','Next notice'], v2_of:['{a} מתוך {b}','{a} of {b}'],
  v2_close:['סגירה','Close'],
  v2_more_give:['העברה בנקאית ודרכים נוספות','Bank transfer and other ways'],
  v2_v1:['העיצוב הקודם','Previous design'],
  v2_sunrise:['הנץ','Sunrise'], v2_sunset:['שקיעה','Sunset'],
  v2_verse:['ויצא יצחק לשוח בשדה לפנות ערב','Yitzchak went out to pray in the field toward evening'],
  v2_verse_src:['בראשית כד, סג','Bereshit 24:63'],
  v2_band:['היום מהבוקר עד הלילה: כל תפילה במקומה, והשמש במקומה עכשיו.','The day from morning to night: each tefillah at its time, and the sun where it is now.'],
  v2_no_today:['אין תפילות רשומות להיום.','No tefillot listed for today.'],
  v2_kiddush_cta:['להקדשת הקידוש','Sponsor the Kiddush'],
  v2_comm:['השבוע בקהילה','In the community'],
  v2_comm_empty:['אין השבוע שמחות או יארצייטים רשומים.','Nothing listed in the community this week.'],
  v2_simchas_all:['לוח שמחות','Simchas calendar'],
  v2_erev:['ערב שבת','Friday'], v2_shabbat_day:['שבת','Shabbat'],
  v2_kind:['בית כנסת במעלה אדומים','A synagogue in Ma\'ale Adumim'],
  v2_screen:['מסך בית הכנסת','Shul screen'], v2_board:['כניסת חברי ועד','Board sign-in'], v2_manage:['ניהול','Board'],
  v2_give_scan:['סרקו לתרומה','Scan to donate'],
  v2_notice:['הודעה','Notice'],
  v2_zm_today:['זמני היום','Zmanim']
};

/* ---------- small helpers ---------- */
function T(k,v,lg){return A.t(k,v,lg);}
function E(s){return A.esc(s);}
function M(d){return d?A.minsOf(A.hm(d)):null;}
function rtl(lg){return (lg||A.lang)==='he';}
function pad(n){return String(n).padStart(2,'0');}
function nowM(P){return P.hh*60+P.mm;}
function inLong(mins,lg){if(mins<60)return T('in_min',{n:mins},lg);return T('in_hm',{h:Math.floor(mins/60),m:pad(mins%60)},lg);}
function cp(txt){return '<span class="cp"><code dir="ltr">'+E(txt)+'</code><button type="button" data-act="copy" data-text="'+E(txt)+'">'+E(T('copy'))+'</button></span>';}
function noticeHas(n){return !!(n.image||String(n.titleHe||n.titleEn||'').trim()||String(n.bodyHe||n.bodyEn||'').trim());}

var MARK='<svg class="mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M8 36V17a12 12 0 0 1 24 0v19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M8 29h24" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".55"/><path d="M14.5 29a5.5 5.5 0 0 1 11 0z" fill="var(--sun,#F2B94B)"/><path d="M20 17.5v-3M14.2 19.6l-1.8-1.8M25.8 19.6l1.8-1.8" stroke="var(--sun,#F2B94B)" stroke-width="1.8" stroke-linecap="round"/></svg>';
var IC={
  zmanim:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17h18M6.5 17a5.5 5.5 0 0 1 11 0M12 6.5V4M5.6 10.1 3.9 8.4M18.4 10.1l1.7-1.7M8 20.5h8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  week:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 9.5h17M8 3v4M16 3v4M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  simchas:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h5l-.6 5.2a2 2 0 0 1-3.8 0zM9.5 10.8v8M7 19h5M14.5 6.5h5l-.6 5.2a2 2 0 0 1-3.8 0zM17 13.8v5.2M14.5 19.2h5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  docs:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7.5L19 8v12.5H7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14.5 3.5V8H19M10 12h6M10 15.5h6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  contact:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  prev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  up:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16M7.5 18a4.5 4.5 0 0 1 9 0M12 4v6M9 7l3-3 3 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  down:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16M7.5 18a4.5 4.5 0 0 1 9 0M12 10V4M9 7l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* ---------- the day: zmanim, tefillot and the sky colour across it ---------- */
function zmOf(di){var x=di.zm;return {alot:M(x.alot),netz:M(x.netz),chatzot:M(x.chatzot),plag:M(x.plag),shkia:M(x.shkia),tzeit:M(x.tzeit)};}
function itemsFor(S,iso,di,lg){
  var out=A.dayTimes(S,iso,true).filter(function(x){return x.time;}).map(function(x){return {e:x.e,name:A.pick(x.e,'name',lg),m:A.minsOf(x.time),time:x.time,shiur:x.e.group==='shiur'};});
  if(di&&di.candles)out.push({name:T('candles',null,lg),m:M(di.candles),time:A.hm(di.candles),candle:true});
  if(di&&di.havdalah)out.push({name:T('havdalah',null,lg),m:M(di.havdalah),time:A.hm(di.havdalah),candle:true});
  return out.sort(function(a,b){return a.m-b.m;});
}
/* Today's band; once the last tefillah and nightfall have passed it moves on to tomorrow. */
function dayModel(S,P,lg){
  var iso=P.iso,di=A.dayInfo(iso,S.shul);if(!di)return null;
  var items=itemsFor(S,iso,di,lg),z=zmOf(di),tomorrow=false,n=nowM(P);
  var lastM=items.length?items[items.length-1].m:0;
  if(n>Math.max(lastM,z.tzeit||0)+20){var iso2=A.isoAdd(iso,1),di2=A.dayInfo(iso2,S.shul);if(di2){iso=iso2;di=di2;items=itemsFor(S,iso,di,lg);z=zmOf(di);tomorrow=true;}}
  var first=items.length?Math.min(items[0].m,z.alot):z.alot,last=items.length?Math.max(items[items.length-1].m,z.tzeit):z.tzeit;
  var t0=Math.max(0,Math.floor((first-40)/30)*30),t1=Math.min(1440,Math.ceil((last+40)/30)*30);
  return {iso:iso,di:di,z:z,items:items,t0:t0,t1:t1,now:tomorrow?null:n,tomorrow:tomorrow};
}
function frac(md,m){return Math.max(0,Math.min(1,(m-md.t0)/(md.t1-md.t0)));}
function arcY(md,m){
  var z=md.z,yb=72,yp=10,d=z.shkia-z.netz;
  if(m>=z.netz&&m<=z.shkia)return yb-(yb-yp)*Math.sin(Math.PI*(m-z.netz)/d);
  var k=m<z.netz?z.netz-m:m-z.shkia;return yb+18*Math.sin(Math.PI*Math.min(1,k/(1440-d)));
}
function hex(c){var n=parseInt(c.slice(1),16);return [n>>16,(n>>8)&255,n&255];}
function mix(a,b,f){var x=hex(a),y=hex(b);return 'rgb('+[0,1,2].map(function(i){return Math.round(x[i]+(y[i]-x[i])*f);}).join(',')+')';}
function skyKeys(z){
  return [[0,'#0A1130'],[z.alot-40,'#0C1436'],[z.alot,'#1B2257'],[z.netz-25,'#463C7C'],[z.netz,'#D48C78'],[z.netz+50,'#5A8BD3'],[z.chatzot,'#3C70CB'],[z.plag,'#557FCC'],[z.shkia-30,'#DDA352'],[z.shkia,'#C4625A'],[z.tzeit,'#382A66'],[z.tzeit+50,'#111943'],[1440,'#0A1130']]
    .filter(function(k,i,a){return i===0||k[0]>a[i-1][0];});
}
function zenKeys(z){
  return [[0,'#070C26'],[z.alot-40,'#080E2A'],[z.alot,'#111943'],[z.netz-20,'#222C66'],[z.netz+35,'#2A55AE'],[z.chatzot,'#2556BC'],[z.shkia-45,'#2B4B9E'],[z.shkia,'#29306E'],[z.tzeit,'#151B4A'],[z.tzeit+50,'#0A1031'],[1440,'#070C26']]
    .filter(function(k,i,a){return i===0||k[0]>a[i-1][0];});
}
function colAt(K,m){for(var i=1;i<K.length;i++){if(m<=K[i][0]){var a=K[i-1],b=K[i];return mix(a[1],b[1],(m-a[0])/Math.max(1,b[0]-a[0]));}}return mix(K[K.length-1][1],K[K.length-1][1],0);}
function nightAt(z,m){if(m<=z.alot-10||m>=z.tzeit+25)return 1;if(m>=z.netz-5&&m<=z.shkia+10)return 0;if(m<z.netz)return (z.netz-5-m)/(z.netz-5-(z.alot-10));return (m-(z.shkia+10))/((z.tzeit+25)-(z.shkia+10));}
function skyStyle(md,lg){
  var K=skyKeys(md.z),Z=zenKeys(md.z),dir=rtl(lg)?'to left':'to right',stops=[],zen=[],mask=[],step=(md.t1-md.t0)/48;
  for(var i=0;i<=48;i++){var m=md.t0+i*step,p=(i/48*100).toFixed(1)+'%';stops.push(colAt(K,m)+' '+p);zen.push(colAt(Z,m)+' '+p);mask.push('rgba(0,0,0,'+nightAt(md.z,m).toFixed(2)+') '+p);}
  return '--sky:linear-gradient('+dir+','+stops.join(',')+');--zen:linear-gradient('+dir+','+zen.join(',')+');--starmask:linear-gradient('+dir+','+mask.join(',')+')';
}
function xPct(md,m,lg){var f=frac(md,m);return ((rtl(lg)?1-f:f)*100).toFixed(2);}
var HILLS='<svg class="hills" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">'+
  '<path class="h1" d="M0 79C60 73 120 77 185 75S300 69 372 75 512 81 584 75 732 70 812 76 942 73 1000 77V100H0Z"/>'+
  '<path class="h2" d="M0 87C70 83 150 86 232 84S382 80 462 85 632 89 712 85 882 81 1000 86V100H0Z"/>'+
  '<path class="h3" d="M0 93C120 92.5 230 95.5 350 94.8S590 93 700 95.2 900 93.2 1000 92.6V100H0Z"/></svg>';
/* The band: sky, stars, hills, the sun's arc, the tefillot as pins along the horizon. */
function band(S,md,o){
  o=o||{};var lg=o.lg,live=!o.still&&md.now!=null,z=md.z,pts=[];
  for(var m=md.t0;m<=md.t1;m+=8){var x=frac(md,m);pts.push(((rtl(lg)?1-x:x)*1000).toFixed(1)+' '+arcY(md,m).toFixed(1));}
  var path='M'+pts.join(' L');
  var nx=o.next,html='';
  md.items.forEach(function(it,i){
    var cls='pin'+(it.shiur?' shiur':'')+(it.candle?' candle':'')+(live&&it.m<md.now?' past':'')+(nx&&it.e&&nx.e===it.e&&nx.time===it.time?' next':'');
    var nm=o.both&&it.e?A.pick(it.e,'name','he'):it.name;
    html+='<div class="'+cls+'" data-i="'+i+'" data-m="'+it.m+'" style="left:'+xPct(md,it.m,lg)+'%"><i></i><span class="pl"><em>'+E(nm)+'</em><b>'+E(it.time)+'</b></span></div>';
  });
  var sun='';
  if(live){
    var nm2=md.now,x=xPct(md,nm2,lg);
    if(nm2>=z.netz-12&&nm2<=z.shkia+12)sun='<div class="sun" id="'+(o.id||'b')+'-sun" style="left:'+x+'%;top:'+arcY(md,nm2).toFixed(2)+'%"></div>';
    else sun='<div class="moon" id="'+(o.id||'b')+'-sun" style="left:'+x+'%"></div>';
    sun+='<div class="nowline" style="left:'+x+'%"></div>';
  }
  var veil='';
  var ticks=[['netz','up'],['shkia','down']].map(function(k){return '<span class="zt" style="left:'+xPct(md,z[k[0]],lg)+'%" title="'+E(T(k[0]==='netz'?'v2_sunrise':'v2_sunset',null,lg))+' '+A.hm(md.di.zm[k[0]])+'">'+IC[k[1]]+'</span>';}).join('');
  return '<div class="band'+(live?' live':'')+'" id="'+(o.id||'b')+'-band" role="img" aria-label="'+E(T('v2_band',null,lg))+'">'+
    '<svg class="arc" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true"><path d="'+path+'"/></svg>'+veil+HILLS+ticks+sun+'<div class="pins">'+html+'</div></div>';
}
/* Labels go in up to three rows above the horizon; a label that still can't fit keeps only its dot. */
function layoutPins(id){
  var b=document.getElementById(id+'-band');if(!b)return;
  var W=b.clientWidth,H=b.clientHeight;if(!W||!H)return;
  var pins=[].slice.call(b.querySelectorAll('.pin'));if(!pins.length)return;
  var lh=0;pins.forEach(function(p){lh=Math.max(lh,p.querySelector('.pl').offsetHeight);});
  var base=Math.max(10,Math.round(H*.06)),gap=Math.round(lh+H*.03),rows=Math.max(1,Math.min(3,Math.floor((H*.72-base-4)/gap)));
  var lift=[0,1,2].map(function(k){return base+k*gap;});
  var placed=[[],[],[]],br=b.getBoundingClientRect(),obst=[].slice.call(b.parentNode.querySelectorAll('[data-obst]')).map(function(o){var r=o.getBoundingClientRect();return [r.left-br.left-6,r.right-br.left+6,r.top-br.top-2,r.bottom-br.top+2];}).filter(function(o){return o[3]>0&&o[2]<H;});
  var blocked=function(lo,hi,k,h){var bot=H*.72-lift[k],top=bot-h;return obst.some(function(o){return hi>o[0]&&lo<o[1]&&bot>o[2]&&top<o[3];});};
  pins.sort(function(a,c){var pa=a.classList.contains('next')?0:(a.classList.contains('candle')?1:2),pc=c.classList.contains('next')?0:(c.classList.contains('candle')?1:2);return pa-pc||(+a.dataset.m)-(+c.dataset.m);});
  pins.forEach(function(p){
    var pl=p.querySelector('.pl');p.classList.remove('nol');pl.style.removeProperty('--sh');
    var w=pl.offsetWidth+22,x=p.offsetLeft,lo=x-w/2,hi=x+w/2,sh=0;
    if(lo<4){sh=4-lo;}else if(hi>W-4){sh=W-4-hi;}lo+=sh;hi+=sh;
    var r=-1;for(var k=0;k<rows;k++){if(!blocked(lo,hi,k,pl.offsetHeight)&&placed[k].every(function(s){return hi<s[0]||lo>s[1];})){r=k;break;}}
    if(r<0){p.classList.add('nol');return;}
    placed[r].push([lo,hi]);p.style.setProperty('--lift',lift[r]+'px');pl.style.setProperty('--sh',sh+'px');
  });
}
/* One moment on load: the sun climbs its arc to now and each tefillah lights up as it passes. */
function rise(S,md,id,lg){
  var b=document.getElementById(id+'-band');if(!b||md.now==null)return;
  var sun=document.getElementById(id+'-sun'),veil=b.querySelector('.veil'),pins=[].slice.call(b.querySelectorAll('.pin'));
  if(reduce()||!sun){return;}
  var from=md.t0,to=md.now,isSun=sun.classList.contains('sun'),t0=null,dur=1700;
  pins.forEach(function(p){p.classList.add('pre');});
  if(veil)veil.style.width='0%';
  var step=function(ts){
    if(!t0)t0=ts;var k=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-k,3),m=from+(to-from)*e;
    sun.style.left=xPct(md,m,lg)+'%';if(isSun)sun.style.top=arcY(md,Math.max(md.z.netz,Math.min(md.z.shkia,m))).toFixed(2)+'%';
    if(veil)veil.style.width=(frac(md,m)*100).toFixed(2)+'%';
    pins.forEach(function(p){if(+p.dataset.m<=m+15||k===1)p.classList.remove('pre');});
    if(k<1)D.anim=requestAnimationFrame(step);
  };
  D.anim=requestAnimationFrame(step);
}

/* ---------- website ---------- */
function urgent(S,iso,lg){var u=A.urgentText(S,iso,lg);return u?'<div class="urg" role="alert"><b aria-hidden="true">!</b><span>'+E(u)+'</span></div>':'';}
function home(){
  var S=A.state,P=A.jp(),iso=P.iso,wk=A.weekInfo(iso,S.shul),md=dayModel(S,P),nx=A.nextTefillah(S,new Date());
  if(D.ni>=noticeList(S,iso,P.dow).length)D.ni=0;
  return '<div class="v2'+(D.dr?' has-dr':'')+'">'+urgent(S,iso)+
    '<header class="sky" id="sky">'+skyInner(S,P,md,wk,nx)+'</header>'+
    '<main class="wall" id="wall">'+blkToday(S,P,md,nx)+blkShabbat(S,wk)+blkNotices(S,iso,P.dow)+blkGive(S)+blkComm(S,iso)+'</main>'+
    dock(S)+'</div>'+(D.dr?drawer(S,D.dr):'');
}
function skyInner(S,P,md,wk,nx){
  var di=A.dayInfo(P.iso,S.shul),pt=A.parshaText(wk),lang=A.lang;
  var tools='<div class="tools" data-obst><div class="lang" role="group" aria-label="language"><button data-act="lang" data-lang="he" aria-pressed="'+(lang==='he')+'">עברית</button><button data-act="lang" data-lang="en" aria-pressed="'+(lang==='en')+'">English</button></div>'+
    (A.role?'<a class="tb" href="'+E(A.base)+'#manage">'+E(T('v2_manage'))+'</a>':'')+'</div>';
  var nxH=nx?'<p class="nx-k">'+E(T('v2_next'))+'</p><div class="nx-r"><b class="nx-t">'+E(nx.time)+'</b><span class="nx-n">'+E(A.pick(nx.e,'name'))+'<small>'+E(nx.tomorrow?T('tomorrow'):inLong(nx.mins))+'</small></span></div>':'<p class="nx-k">'+E(T('none_today'))+'</p>';
  var chips=A.seasonal(di,P.dow),hol=di?di.hol.map(function(e){return e.render(A.locale());}):[];if(di&&di.omer)hol.push(di.omer.render(A.locale()));
  var tags=(chips.length||hol.length)?'<span class="stags">'+hol.map(function(h){return '<span class="hol">'+E(h)+'</span>';}).join('')+chips.map(function(c){return '<span>'+E(T(c))+'</span>';}).join('')+'</span>':'';
  var sunl=di?'<span class="sl">'+IC.up+'<b>'+A.hm(di.zm.netz)+'</b><span class="sr">'+E(T('v2_sunrise'))+'</span></span><span class="sl">'+IC.down+'<b>'+A.hm(di.zm.shkia)+'</b><span class="sr">'+E(T('v2_sunset'))+'</span></span>':'';
  return '<div class="sky-bg" style="'+(md?skyStyle(md):'')+'" aria-hidden="true"><i class="stars"></i></div>'+
    '<div class="sky-top"><a class="brand" data-obst href="./" aria-label="'+E(A.pick(S.shul,'name'))+'">'+MARK+'<span><b>'+E(A.pick(S.shul,'name'))+'</b><small>'+E(T('v2_kind'))+'</small></span></a>'+tools+'</div>'+
    '<div class="sky-head"><div class="nx" id="v2-next" data-obst aria-live="polite">'+nxH+'</div>'+
    '<div class="when" data-obst><b class="hd">'+E(A.hebDate(di))+'</b><span>'+E(A.gregLong(P.iso))+'</span>'+(pt?'<span class="pt">'+E(pt)+'</span>':'')+'<span class="sunl">'+sunl+'</span>'+tags+'</div></div>'+
    (md?band(S,md,{id:'w',next:nx}):'')+'<p class="verse">'+(lang==='he'?'<span lang="he" dir="rtl">'+E(T('v2_verse',null,'he'))+'</span>':'<span class="vt">'+E(T('v2_verse',null,'en'))+'</span>')+'<small>'+E(T('v2_verse_src'))+'</small></p>';
}
function rowsHtml(list,live,now,nx){
  return '<ol class="rows">'+list.map(function(x){
    var past=live&&x.m<now,isNext=nx&&x.e&&nx.e===x.e&&nx.time===x.time,note=x.e?A.pick(x.e,'note'):'',tch=x.e&&x.shiur?A.pick(x.e,'teacher'):'';
    return '<li class="'+(past?'past ':'')+(isNext?'next ':'')+(x.candle?'candle':'')+'"><span class="nm">'+E(x.name)+((tch||note)?'<small>'+E([tch,note].filter(Boolean).join(', '))+'</small>':'')+'</span><b class="tm">'+E(x.time)+'</b></li>';}).join('')+'</ol>';
}
function blkToday(S,P,md,nx){
  if(!md)return '<section class="blk b-today" id="b-today"><h2>'+E(T('v2_today'))+'</h2><p class="empty">'+E(T('zm_unavail'))+'</p></section>';
  var live=md.now!=null,tef=md.items.filter(function(x){return !x.shiur;}),shi=md.items.filter(function(x){return x.shiur;});
  var dow=A.isoDow(md.iso);
  return '<section class="blk b-today" id="b-today" aria-labelledby="h-today"><div class="bh"><h2 id="h-today">'+E(T(md.tomorrow?'v2_tomorrow_t':'v2_today'))+'</h2><span class="bh-s">'+E(A.DOW[A.lang==='he'?'he':'en'][dow])+' '+E(A.fmtShort(md.iso))+'</span></div>'+
    '<div class="bb">'+(tef.length?rowsHtml(tef,live,md.now,nx):'<p class="empty">'+E(T('v2_no_today'))+'</p>')+
    (shi.length?'<h3>'+E(T('v2_shiurim'))+'</h3>'+rowsHtml(shi,live,md.now,nx):'')+
    '</div></section>';
}
function blkShabbat(S,wk){
  var sh=A.shabbatList(S,wk),pt=A.parshaText(wk),fri=[],sat=[];
  if(wk.candles)fri.push({name:T('candles'),time:A.hm(wk.candles),candle:true});
  sh.forEach(function(x){(x.dw===5?fri:sat).push({e:x.e,name:A.pick(x.e,'name'),time:x.time});});
  if(wk.havdalah)sat.push({name:T('havdalah'),time:A.hm(wk.havdalah),candle:true});
  var sp=A.sponsorsFor(S,A.jp().iso),hasK=sp.some(function(s){return s.type==='kiddush';});
  var spH=sp.map(function(s){var by=A.pick(s,'by'),fr=A.pick(s,'for');return '<li><small>'+E(T('sp_'+(s.type||'general')))+'</small><span>'+(by?E(T('sp_by'))+' '+E(by):'')+(fr?(by?', ':'')+E(fr):'')+'</span></li>';}).join('');
  return '<section class="blk b-shab" aria-labelledby="h-shab"><div class="bh"><h2 id="h-shab">'+E(T('shabbat'))+(pt?' <span class="pt">'+E(pt)+'</span>':'')+'</h2><span class="bh-s">'+E(A.fmtShort(wk.fri))+'–'+E(A.fmtShort(wk.sat))+'</span></div><div class="bb">'+
    (fri.length?'<h3>'+E(T('v2_erev'))+'</h3>'+rowsHtml(fri,false):'')+(sat.length?'<h3>'+E(T('v2_shabbat_day'))+'</h3>'+rowsHtml(sat,false):'')+
    (spH?'<ul class="spons">'+spH+'</ul>':'')+(!hasK?'<p class="kcta"><span>'+E(T('no_sponsor_kiddush'))+'</span><button type="button" class="lnk" data-v2="open" data-d="give">'+E(T('v2_kiddush_cta'))+'</button></p>':'')+'</div></section>';
}
function noticeList(S,iso,dow){
  return S.notices.filter(function(n){return A.noticeOn(n,iso,dow,'web')&&noticeHas(n);}).sort(function(a,b){var o={timed:0,ongoing:1,standard:2};return (o[a.kind]-o[b.kind])||((a.start||'')<(b.start||'')?-1:1);});
}
function whenOf(n){return n.kind==='ongoing'&&n.days&&n.days.length?T('every',{d:A.daysLabel(n.days)}):(n.end?T('until',{d:A.fmtShort(n.end)}):'');}
function noticeHtml(n,big){
  var ia=A.imgAttr(n.image),title=A.pick(n,'title'),body=A.pick(n,'body'),when=whenOf(n);
  return '<article class="ntc'+(ia?' has-img':'')+(ia&&!title&&!body?' img-only':'')+'">'+(ia?'<figure><img '+ia+' alt="'+E(title||T('f_image'))+'"'+(big?' loading="lazy"':'')+'></figure>':'')+
    ((title||body||when)?'<div class="ntc-b">'+(when?'<span class="when-tag">'+E(when)+'</span>':'')+(title?'<h3>'+E(title)+'</h3>':'')+(body?'<p>'+E(body)+'</p>':'')+'</div>':'')+'</article>';
}
function blkNotices(S,iso,dow){
  var list=noticeList(S,iso,dow),n=list.length,i=Math.min(D.ni,Math.max(0,n-1));
  var pager=n>1?'<div class="pager"><button type="button" class="pg" data-v2="np" data-n="-1" aria-label="'+E(T('v2_prev'))+'">'+IC.prev+'</button><span class="pg-c">'+E(T('v2_of',{a:i+1,b:n}))+'</span><button type="button" class="pg" data-v2="np" data-n="1" aria-label="'+E(T('v2_nextn'))+'">'+IC.next+'</button></div>':'';
  return '<section class="blk b-notices" id="b-notices" aria-labelledby="h-not"><div class="bh"><h2 id="h-not">'+E(T('nav_notices'))+'</h2>'+pager+'</div>'+
    '<div class="bb ntc-view" id="ntc-view">'+(n?noticeHtml(list[i]):'<p class="empty">'+E(T('no_notices'))+'</p>')+'</div>'+
    (n?'<button class="more" type="button" data-v2="open" data-d="notices">'+E(T('v2_all_notices'))+'</button>':'')+'</section>';
}
function blkGive(S){
  var d=S.donate,pb=A.safeUrl(d.payboxLink),bit=A.safeUrl(d.bitLink),go=pb||bit,num=d.payboxPhone||d.bitPhone||'',tz=A.safeUrl(d.tzLink),bank=A.pick(d,'bank');
  if(!go&&!num&&!bank&&!tz)return '<section class="blk b-give"><div class="bh"><h2>'+E(T('hg_title'))+'</h2></div><p class="empty">'+E(T('no_donate'))+'</p></section>';
  var q=go?A.qrSvg(go):'';
  return '<section class="blk b-give" aria-labelledby="h-give"><div class="bh"><h2 id="h-give">'+E(T('hg_title'))+'</h2></div><div class="bb">'+
    '<div class="gv">'+(q?'<div class="qr" aria-hidden="true">'+q+'</div>':'')+'<div class="gv-t"><p class="lead">'+E(A.pick(d,'lead')||T('donate_lead'))+'</p>'+
    (go?'<a class="btn-sun" href="'+E(go)+'" target="_blank" rel="noopener">'+E(T(pb?'pay_paybox':'pay_bit'))+'</a>':'')+(num?'<div class="gv-n"><span>'+E(T(d.payboxPhone?'paybox':'bit'))+'</span>'+cp(num)+'</div>':'')+'</div></div>'+
    (tz?'<a class="tz" href="'+E(tz)+'" target="_blank" rel="noopener"><b>'+E(A.pick(d,'tzTitle')||T('donate'))+'</b>'+(A.pick(d,'tzText')?'<span>'+E(A.pick(d,'tzText'))+'</span>':'')+'<span class="tz-u" dir="ltr">'+E(tz.replace(/^https?:\/\//,''))+'</span></a>':'')+'</div>'+
    '<button class="more" type="button" data-v2="open" data-d="give">'+E(T('v2_more_give'))+'</button></section>';
}
function commItems(S,iso,lg){
  var out=[],tp=function(o,b){return A.pick(o,b,lg);};
  A.mazalFor(S,iso).forEach(function(m){out.push({k:T('mazal',null,lg),h:E(tp(m,'text'))});});
  A.simchasFor(S,iso,14).forEach(function(x){var det=tp(x,'details');out.push({k:T('simcha',null,lg)+' '+A.fmtShort(x.date),h:E(tp(x,'title'))+(det?'<span class="sub">'+E(det)+'</span>':'')});});
  A.yahrzeitsFor(S,iso).forEach(function(x){var rel=tp(x.y,'rel');out.push({k:T('yz_short',null,lg)+' '+(rtl(lg)?x.hd.renderGematriya(true):x.hd.render('en')),h:E(tp(x.y,'name'))+(rel?'<span class="sub">'+E(rel)+'</span>':''),yz:true});});
  var rf=A.refuahFor(S,iso);if(rf.length)out.push({k:T('refuah',null,lg),h:rf.map(function(r){return '<span class="nm-r">'+E(r.name)+'</span>';}).join(' ')});
  return out;
}
function blkComm(S,iso){
  var it=commItems(S,iso);
  return '<section class="blk b-comm" aria-labelledby="h-comm"><div class="bh"><h2 id="h-comm">'+E(T('v2_comm'))+'</h2></div><div class="bb">'+
    (it.length?'<ul class="comm">'+it.map(function(x){return '<li'+(x.yz?' class="yz"':'')+'><small>'+E(x.k)+'</small><p>'+x.h+'</p></li>';}).join('')+'</ul>':'<p class="empty">'+E(T('v2_comm_empty'))+'</p>')+'</div>'+
    '</section>';
}
function dock(S){
  var has=A.docsFor(S).length>0;
  var items=[['zmanim','zm_title'],['week','v2_week'],['simchas','v2_simchas_all']].concat(has?[['docs','nav_docs']]:[]).concat([['contact','nav_contact']]);
  return '<nav class="dock" aria-label="'+E(T('v2_week'))+'"><div class="dock-in">'+items.map(function(x){return '<button type="button" data-v2="open" data-d="'+x[0]+'"'+(D.dr===x[0]?' aria-current="true"':'')+'>'+IC[x[0]]+'<span>'+E(T(x[1]))+'</span></button>';}).join('')+'</div>'+
    '<div class="dock-x"><button type="button" class="lnk" data-act="nav" data-to="display">'+E(T('v2_screen'))+'</button><a class="lnk" href="'+E(A.base)+'#manage">'+E(A.role?T('v2_manage'):T('v2_board'))+'</a><a class="lnk" href="'+E(A.base)+'">'+E(T('v2_v1'))+'</a></div></nav>';
}

/* ---------- drawers: one level, opened from the blocks and the dock ---------- */
var DR={
  zmanim:['zm_title',dZmanim],week:['v2_week',dWeek],simchas:['simchas',dSimchas],docs:['docs',dDocs],contact:['contact',dContact],notices:['notices',dNotices],give:['donate',dGive]
};
function drawer(S,k){
  var d=DR[k];if(!d)return '';
  return '<div class="dr-scrim" data-v2="close"></div><aside class="dr" id="dr" role="dialog" aria-modal="true" aria-labelledby="dr-t" tabindex="-1"><header class="dr-h"><h2 id="dr-t">'+E(T(d[0]))+'</h2><button type="button" class="dr-x" data-v2="close" aria-label="'+E(T('v2_close'))+'">'+IC.x+'</button></header><div class="dr-b" id="dr-b">'+d[1](S)+'</div></aside>';
}
function dZmanim(S){
  var P=A.jp(),iso=D.zDate||P.iso,di=A.dayInfo(iso,S.shul),today=iso===P.iso,now=Date.now();
  var nav='<div class="zbar"><button type="button" class="chip-b" data-v2="zd" data-n="-1" aria-label="'+E(T('prev_day'))+'">'+IC.prev+'</button><div class="zd"><b>'+E(A.hebDate(di))+'</b><span>'+E(A.gregLong(iso))+'</span></div><button type="button" class="chip-b" data-v2="zd" data-n="1" aria-label="'+E(T('next_day'))+'">'+IC.next+'</button></div>'+(today?'':'<p class="zback"><button type="button" class="lnk" data-v2="zd" data-n="0">'+E(T('back_today'))+'</button></p>');
  if(!di)return nav+'<p class="empty">'+E(T('zm_unavail'))+'</p>';
  return nav+'<ol class="rows zrows">'+A.ZKEYS.map(function(k){var d=di.zm[k],c='';if(today&&d){var df=d.getTime()-now;c=df<0?'past':(df<3600000?'next':'');}return '<li class="'+c+'"><span class="nm">'+E(T('zm_'+k))+'</span><b class="tm">'+A.zText(d,k)+'</b></li>';}).join('')+'</ol><p class="fine">'+E(T('zm_note'))+'</p>';
}
function schedTable(list,dayFn){return '<ol class="rows sched2">'+list.map(function(x){var rule=A.ruleText(x.e),note=A.pick(x.e,'note'),tch=A.pick(x.e,'teacher');return '<li><span class="nm">'+E(A.pick(x.e,'name'))+'<small>'+E([dayFn(x),rule,tch,note].filter(Boolean).join(', '))+'</small></span><b class="tm">'+E(x.time||'—')+'</b></li>';}).join('')+'</ol>';}
function dWeek(S){
  var P=A.jp(),wk=A.weekInfo(P.iso,S.shul),wd=A.weekdayList(S,P),sh=A.shabbatList(S,wk),si=A.shiurList(S);
  return '<h3>'+E(T('weekday'))+'</h3>'+(wd.length?schedTable(wd,function(x){return A.daysLabel(x.e.days);}):'<p class="empty">—</p>')+
    '<h3>'+E(T('shabbat'))+' '+E(A.parshaText(wk))+'</h3>'+(wk.candles?'<ol class="rows"><li class="candle"><span class="nm">'+E(T('candles'))+'<small>'+E(T('erev_shabbat'))+' '+E(A.fmtShort(wk.fri))+'</small></span><b class="tm">'+A.hm(wk.candles)+'</b></li></ol>':'')+
    (sh.length?schedTable(sh,function(x){return T(x.dw===5?'erev_shabbat':'shabbat_day');}):'')+(wk.havdalah?'<ol class="rows"><li class="candle"><span class="nm">'+E(T('havdalah'))+'</span><b class="tm">'+A.hm(wk.havdalah)+'</b></li></ol>':'')+
    '<h3>'+E(T('shiurim'))+'</h3>'+(si.length?schedTable(si,function(x){return A.daysLabel(x.e.days);}):'<p class="empty">'+E(T('no_shiurim'))+'</p>')+
    '<p class="fine">'+E(T('times_note'))+'</p>';
}
function dSimchas(S){
  var iso=A.jp().iso,list=A.simchasFor(S,iso),loc=A.lang==='he'?'he-IL':'en-GB',mf=new Intl.DateTimeFormat(loc,{month:'short',timeZone:'UTC'}),wf=new Intl.DateTimeFormat(loc,{weekday:'long',timeZone:'UTC'});
  var utc=function(i){var a=i.split('-').map(Number);return new Date(Date.UTC(a[0],a[1]-1,a[2],12));};
  var mz=A.mazalFor(S,iso);
  return (list.length?'<ol class="cal2">'+list.map(function(x){var di=A.dayInfo(x.date,S.shul),det=A.pick(x,'details');return '<li><time datetime="'+E(x.date)+'"><b>'+(+x.date.slice(8,10))+'</b><span>'+E(mf.format(utc(x.date)))+'</span></time><div><b>'+E(A.pick(x,'title'))+'</b><small>'+E(wf.format(utc(x.date)))+(di?', '+E(A.hebDate(di)):'')+'</small>'+(det?'<span>'+E(det)+'</span>':'')+'</div></li>';}).join('')+'</ol>':'<p class="empty">'+E(T('no_simchas'))+'</p>')+
    (mz.length?'<h3>'+E(T('mazal'))+'</h3><ul class="comm">'+mz.map(function(m){return '<li><p>'+E(A.pick(m,'text'))+'</p></li>';}).join('')+'</ul>':'');
}
function dDocs(S){
  var list=A.docsFor(S);if(!list.length)return '<p class="empty">—</p>';
  return '<p class="fine top">'+E(T('docs_lead'))+'</p>'+list.map(function(d){
    var has={he:!!String(d.bodyHe||'').trim(),en:!!String(d.bodyEn||'').trim()},cur=A.ui.docLang[d.id]||(has[A.lang]?A.lang:(has.he?'he':'en')),link=A.docLink(d.link);
    var tabs=(has.he&&has.en)?'<div class="lang sm" role="group" aria-label="'+E(T('doc_lang'))+'"><button data-act="doclang" data-id="'+E(d.id)+'" data-lang="he" aria-pressed="'+(cur==='he')+'">עברית</button><button data-act="doclang" data-id="'+E(d.id)+'" data-lang="en" aria-pressed="'+(cur==='en')+'">English</button></div>':'';
    return '<details class="doc" id="doc-'+E(d.id)+'"'+(A.ui.docOpen[d.id]?' open':'')+'><summary><b>'+E(A.pick(d,'title'))+'</b>'+(d.date?'<span>'+E(A.fmtDate(d.date))+'</span>':'')+'</summary><div class="doc-b"><div class="doc-tools">'+tabs+(link?'<a class="lnk" href="'+E(link)+'" target="_blank" rel="noopener">'+E(T('doc_original'))+'</a>':'')+'</div>'+
      (has.he?'<article class="doc-text" lang="he" dir="rtl" data-doclang="he"'+(cur!=='he'?' hidden':'')+'>'+A.docHtml(d.bodyHe)+'</article>':'')+(has.en?'<article class="doc-text" lang="en" dir="ltr" data-doclang="en"'+(cur!=='en'?' hidden':'')+'>'+A.docHtml(d.bodyEn)+'</article>':'')+'</div></details>';
  }).join('');
}
function dContact(S){
  var s=S.shul,addr=A.pick(s,'address'),q=encodeURIComponent(s.addressHe||addr||''),wa=A.safeUrl(s.whatsapp);
  var people=[['rabbi',A.pick(s,'rabbi')],['gabbai',A.pick(s,'gabbai')],['nusach',A.pick(s,'nusach')]].filter(function(p){return p[1];});
  return '<p class="addr">'+E(addr)+'</p>'+(A.pick(s,'directions')?'<p class="fine top">'+E(A.pick(s,'directions'))+'</p>':'')+
    '<div class="btns"><a class="btn-ink" target="_blank" rel="noopener" href="https://waze.com/ul?ll='+(+s.lat)+','+(+s.lng)+'&navigate=yes">'+E(T('waze'))+'</a><a class="btn-line" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+q+'">'+E(T('gmaps'))+'</a></div>'+
    (A.pick(s,'about')?'<h3>'+E(T('about'))+'</h3><p class="pre">'+E(A.pick(s,'about'))+'</p>':'')+
    ((people.length||s.phone||s.email||wa)?'<ul class="kv">'+people.map(function(p){return '<li><small>'+E(T(p[0]))+'</small><span>'+E(p[1])+'</span></li>';}).join('')+(s.phone?'<li><small>'+E(T('phone'))+'</small>'+cp(s.phone)+'</li>':'')+(s.email?'<li><small>'+E(T('email'))+'</small>'+cp(s.email)+'</li>':'')+(wa?'<li><a class="btn-line" href="'+E(wa)+'" target="_blank" rel="noopener">'+E(T('whatsapp'))+'</a></li>':'')+'</ul>':'')+
    '<div class="dr-links"><button type="button" class="lnk" data-act="nav" data-to="display">'+E(T('v2_screen'))+'</button><a class="lnk" href="'+E(A.base)+'#manage">'+E(A.role?T('v2_manage'):T('v2_board'))+'</a><a class="lnk" href="'+E(A.base)+'">'+E(T('v2_v1'))+'</a></div>';
}
function dNotices(S){var P=A.jp(),list=noticeList(S,P.iso,P.dow);return list.length?'<div class="ntc-list">'+list.map(function(n){return noticeHtml(n,true);}).join('')+'</div>':'<p class="empty">'+E(T('no_notices'))+'</p>';}
function dGive(S){
  var d=S.donate,blocks='',add=function(label,link,num,btn){var q=link?A.qrSvg(link):'';blocks+='<div class="gblk">'+(q?'<div class="qr" aria-hidden="true">'+q+'</div>':'')+'<div><h3>'+E(label)+'</h3>'+(num?cp(num):'')+(link?'<a class="btn-sun" href="'+E(link)+'" target="_blank" rel="noopener">'+E(btn)+'</a>':'')+'</div></div>';};
  var pb=A.safeUrl(d.payboxLink),bit=A.safeUrl(d.bitLink),ot=A.safeUrl(d.otherLink),bank=A.pick(d,'bank'),tz=A.safeUrl(d.tzLink);
  if(pb||d.payboxPhone)add(T('paybox'),pb,d.payboxPhone,T('pay_paybox'));
  if(bit||d.bitPhone)add(T('bit'),bit,d.bitPhone,T('pay_bit'));
  if(ot)add(A.pick(d,'otherLabel')||T('donate'),ot,'',A.pick(d,'otherLabel')||T('donate'));
  if(bank)blocks+='<div class="gblk bank"><div><h3>'+E(T('bank'))+'</h3><p class="pre">'+E(bank)+'</p></div></div>';
  if(tz)blocks+='<div class="gblk small"><div class="qr" aria-hidden="true">'+A.qrSvg(tz)+'</div><div><h3>'+E(A.pick(d,'tzTitle')||T('donate'))+'</h3>'+(A.pick(d,'tzText')?'<p>'+E(A.pick(d,'tzText'))+'</p>':'')+'<a class="lnk" href="'+E(tz)+'" target="_blank" rel="noopener" dir="ltr">'+E(tz.replace(/^https?:\/\//,''))+'</a></div></div>';
  return '<p class="fine top pre">'+E(A.pick(d,'lead')||T('donate_lead'))+'</p>'+(blocks||'<p class="empty">'+E(T('no_donate'))+'</p>')+(A.pick(d,'note')?'<p class="fine">'+E(A.pick(d,'note'))+'</p>':'');
}
function openDr(k){if(!DR[k])return false;D.dr=k;D.focusDr=true;if(k==='zmanim'&&!D.zDate)D.zDate=A.jp().iso;A.render();return true;}
function closeDr(){if(!D.dr)return;var k=D.dr;D.dr='';A.render();var b=document.querySelector('[data-v2="open"][data-d="'+k+'"]');if(b)try{b.focus({preventScroll:true});}catch(e){}}

/* ---------- TV board ---------- */
function TLs(S,k){var m=S.display.lang;if(m==='both')return E(T(k,null,'he'))+'<span class="en">'+E(T(k,null,'en'))+'</span>';return E(T(k,null,m==='en'?'en':'he'));}
function TPs(S,o,b){var m=S.display.lang;if(m==='both'){var h=A.pick(o,b,'he'),e=o[b+'En'];return E(h)+(e&&e!==h?'<span class="en">'+E(e)+'</span>':'');}return E(A.pick(o,b,m==='en'?'en':'he'));}
function tvLg(S){return S.display.lang==='en'?'en':'he';}
function display(){
  clearTimeout(D.slideT);clearInterval(D.scT);cancelAnimationFrame(D.anim);
  var S=A.screenState(),lg=tvLg(S);
  if(!A.clockOk())return '<div class="tv-clockbad t2-bad"><div>'+MARK+'<h1>'+TLs(S,'clock_bad')+'</h1><p>'+TLs(S,'clock_bad2')+'</p></div></div>';
  var P=A.jp(),still=!!A.ui.stillFlag,ts=A.TSCALE[S.display.textSize]||1;
  return '<div class="tv2'+(still?' still':'')+'" id="tv2" style="--ts:'+ts+'">'+urgentTv(S,P.iso)+
    '<header class="t-sky" id="t-sky">'+tSky(S,P,still)+'</header>'+
    '<section class="t-a" id="t-a">'+tColA(S,P,still)+'</section>'+
    '<main class="t-stage" id="t-stage" aria-live="polite"></main>'+
    '<aside class="t-c" id="t-c">'+tColC(S,P)+'</aside>'+
    '<footer class="t-foot" id="t-foot">'+tFoot(S)+'</footer></div>'+
    '<button class="tv-fs" data-act="fs">'+E(T('fullscreen',null,lg))+'</button>';
}
function urgentTv(S,iso){var m=S.display.lang,u=A.urgentText(S,iso,m==='en'?'en':'he');if(!u)return '';if(m==='both'&&S.urgent.textEn&&S.urgent.textEn!==u)u+='  /  '+S.urgent.textEn;return '<div class="t-urg" role="alert">'+E(u)+'</div>';}
function tSky(S,P,still){
  var lg=tvLg(S),md=dayModel(S,P,lg),di=A.dayInfo(P.iso,S.shul),wk=A.weekInfo(P.iso,S.shul),pt=A.parshaText(wk,lg),hol=di?di.hol.map(function(e){return e.render(A.locale(lg));}):[];
  var nx=still?null:A.nextTefillah(S,new Date());
  return '<div class="sky-bg" style="'+(md?skyStyle(md,lg):'')+'" aria-hidden="true"><i class="stars"></i></div>'+
    '<div class="t-top"><span class="brand" data-obst>'+MARK+'<b>'+TPs(S,S.shul,'name')+'</b></span><span class="t-dates" data-obst><b>'+E(A.hebDate(di,lg))+'</b><span class="t-dl"><span>'+E(A.gregLong(P.iso,lg))+'</span>'+(pt?'<span>'+E(pt)+'</span>':'')+(hol.length?'<span>'+E(hol.join(', '))+'</span>':'')+'</span></span></div>'+
    (md?band(S,md,{id:'t',lg:lg,next:nx,still:still,both:S.display.lang==='both'}):'');
}
function tColA(S,P,still){
  var lg=tvLg(S),now=nowM(P),nx=still?null:A.nextTefillah(S,new Date()),list=A.dayTimes(S,P.iso,false),shi=A.dayTimes(S,P.iso,true).filter(function(x){return x.e.group==='shiur';});
  var row=function(x){var past=!still&&A.minsOf(x.time)<now,isN=nx&&nx.e===x.e&&nx.time===x.time,tch=x.e.group==='shiur'?TPs(S,x.e,'teacher'):'';return '<li class="'+(past?'past ':'')+(isN?'next':'')+'"><span>'+TPs(S,x.e,'name')+(tch?'<small>'+tch+'</small>':'')+'</span><b>'+E(x.time||'—')+'</b></li>';};
  return '<div class="t-a-in" id="t-a-in">'+(still?'':'<div class="t-clock" id="t2-clock">'+pad(P.hh)+':'+pad(P.mm)+'</div>')+
    (nx?'<div class="t-next"><small>'+TLs(S,'v2_next')+'</small><div class="t-next-r"><span class="t-nn">'+TPs(S,nx.e,'name')+'</span><b>'+E(nx.time)+'</b></div><span class="t-in">'+E(nx.tomorrow?T('tomorrow',null,lg):inLong(nx.mins,lg))+'</span></div>':'')+
    (list.length?'<h3>'+TLs(S,'today')+'</h3><ol class="t-rows">'+list.map(row).join('')+'</ol>':'')+
    (shi.length?'<h3>'+TLs(S,'shiurim')+'</h3><ol class="t-rows">'+shi.map(row).join('')+'</ol>':'')+
    tChips(S,P)+'</div>';
}
function tChips(S,P){var lg=tvLg(S),di=A.dayInfo(P.iso,S.shul),c=A.seasonal(di,P.dow);return c.length?'<div class="t-chips">'+c.map(function(k){return '<span>'+E(T(k,null,lg))+'</span>';}).join('')+'</div>':'';}
function tColC(S,P){
  var lg=tvLg(S),d=S.donate,go=A.safeUrl(d.payboxLink)||A.safeUrl(d.bitLink),num=d.payboxPhone||d.bitPhone||'',tz=A.safeUrl(d.tzLink),give='';
  if(S.display.showDonate&&(go||num||tz)){
    give='<div class="t-give"><div class="t-gq">'+(go?'<div class="qr">'+A.qrSvg(go)+'</div>':'')+'<div><h3>'+TLs(S,'hg_title')+'</h3>'+(go?'<small>'+TLs(S,'v2_give_scan')+'</small>':'')+(num?'<p class="t-num"><span>'+TLs(S,d.payboxPhone?'paybox':'bit')+'</span><bdi dir="ltr">'+E(num)+'</bdi></p>':'')+'</div></div>'+
      (tz?'<div class="t-tz"><div class="qr">'+A.qrSvg(tz)+'</div><div><b>'+TPs(S,d,'tzTitle')+'</b><span>'+TLs(S,'v2_give_scan')+'</span></div></div>':'')+'</div>';
  }
  var it=commItems(S,P.iso,lg),m=S.display.lang;
  if(m==='both'){it=commItems(S,P.iso,'he');}
  var comm=it.length?'<div class="t-comm"><h3>'+TLs(S,'v2_comm')+'</h3><div class="t-scv" id="t-scv"><ul>'+it.map(function(x){return '<li><small>'+E(x.k)+'</small><p>'+x.h+'</p></li>';}).join('')+'</ul></div></div>':'';
  return comm+give;
}
function tFoot(S){
  var lg=tvLg(S),wk=A.weekInfo(A.jp().iso,S.shul),url=A.siteUrl(S),q='';
  if(S.display.showQr&&url){q=A.qrSvg(url.replace(/\/?$/,'/')+(/\/v2\/$/.test(url)?'':'v2/'));}
  return '<div class="tf-a">'+(q?'<div class="qr">'+q+'</div><span>'+TLs(S,'scan_site')+'</span>':'<span>'+E(A.pick(S.shul,'address',lg))+'</span>')+'<span class="t-net" id="tv-net"'+(navigator.onLine===false?'':' hidden')+'>'+TLs(S,'offline_tv')+'</span></div>'+
    '<div class="tf-b">'+(wk.candles?'<span>'+TLs(S,'candles')+' '+E(A.fmtShort(wk.fri))+' <b>'+A.hm(wk.candles)+'</b></span>':'')+(wk.havdalah?'<span>'+TLs(S,'havdalah')+' <b>'+A.hm(wk.havdalah)+'</b></span>':'')+'</div>';
}
function tSlides(S){
  var P=A.jp(),iso=P.iso,lg=tvLg(S),out=[],secs=Math.max(5,+S.display.slideSecs||12);
  S.notices.filter(function(n){return A.noticeOn(n,iso,P.dow,'screen')&&noticeHas(n);}).forEach(function(n){
    var ia=A.imgAttr(n.image),title=TPs(S,n,'title'),body=TPs(S,n,'body'),s=Math.max(5,+n.secs||secs);
    if(ia&&!title&&!body)out.push({cls:'img',html:'<img '+ia+' alt="">',secs:s,img:n.image});
    else if(ia)out.push({cls:'split',html:'<img '+ia+' alt=""><div class="fc">'+(title?'<h2>'+title+'</h2>':'')+(body?'<div class="body">'+body+'</div>':'')+'</div>',secs:s,img:n.image});
    else out.push({cls:'txt',html:'<div class="fc">'+(title?'<h2>'+title+'</h2>':'')+(body?'<div class="body">'+body+'</div>':'')+'</div>',secs:s});
  });
  if(P.dow===4||P.dow===5||P.dow===6)out.push({cls:'shab',html:shabBoard(S,false),secs:secs});
  var sp=A.sponsorsFor(S,iso);
  if(sp.length)out.push({cls:'txt',html:'<div class="fc"><p class="kick">'+TLs(S,'sponsors')+'</p><ul class="t-sp">'+sp.map(function(s){var by=TPs(S,s,'by'),fr=TPs(S,s,'for');return '<li><small>'+TLs(S,'sp_'+(s.type||'general'))+'</small>'+(by?TLs(S,'sp_by')+' '+by:'')+(fr?(by?', ':'')+fr:'')+'</li>';}).join('')+'</ul></div>',secs:secs});
  var rf=A.refuahFor(S,iso);
  if(rf.length)out.push({cls:'txt',html:'<div class="fc"><h2>'+TLs(S,'refuah')+'</h2><div class="t-names">'+rf.map(function(r){return '<span>'+E(r.name)+'</span>';}).join('')+'</div></div>',secs:secs});
  if(!out.length)out.push({cls:'welcome',html:'<div class="fc">'+MARK+'<h2>'+TLs(S,'welcome')+'</h2><p class="t-verse">'+E(T('v2_verse',null,'he'))+'</p></div>',secs:secs});
  return out;
}
function shabBoard(S,still){
  var P=A.jp(),wk=A.weekInfo(P.iso,S.shul),lg=tvLg(S),fri='',sat='',cards='';
  if(wk.candles)fri+='<li class="candle"><span>'+TLs(S,'candles')+'</span><b>'+A.hm(wk.candles)+'</b></li>';
  A.shabbatList(S,wk).forEach(function(x){var li='<li><span>'+TPs(S,x.e,'name')+'</span><b>'+E(x.time)+'</b></li>';if(x.dw===5)fri+=li;else sat+=li;});
  if(wk.havdalah)sat+='<li class="candle"><span>'+TLs(S,'havdalah')+'</span><b>'+A.hm(wk.havdalah)+'</b></li>';
  var rows=(fri?'<div><h3>'+TLs(S,'v2_erev')+'</h3><ol class="t-big">'+fri+'</ol></div>':'')+(sat?'<div><h3>'+TLs(S,'v2_shabbat_day')+'</h3><ol class="t-big">'+sat+'</ol></div>':'');
  if(still){
    S.notices.filter(function(n){return n.shabbat&&A.noticeOn(n,P.iso,P.dow,'screen');}).forEach(function(n){cards+='<div><h3>'+TPs(S,n,'title')+'</h3><p>'+TPs(S,n,'body')+'</p></div>';});
    var sp=A.sponsorsFor(S,P.iso);if(sp.length)cards+='<div><h3>'+TLs(S,'sponsors')+'</h3><p>'+sp.map(function(s){return TLs(S,'sp_'+(s.type||'general'))+': '+(TPs(S,s,'by')||'')+(TPs(S,s,'for')?', '+TPs(S,s,'for'):'');}).join('\n')+'</p></div>';
  }
  return '<div class="fc"><p class="kick">'+TLs(S,'shabbat')+'</p><h2>'+E(A.parshaText(wk,lg))+'</h2><div class="t-two">'+rows+'</div>'+(cards?'<div class="t-cards">'+cards+'</div>':'')+'</div>';
}
function fitBox(el,prop,min){
  if(!el)return;var boxes=[el].concat([].slice.call(el.querySelectorAll('.fc,.t-cards>div')));
  var over=function(){for(var i=0;i<boxes.length;i++){if(boxes[i].scrollHeight>boxes[i].clientHeight+2||boxes[i].scrollWidth>boxes[i].clientWidth+2)return true;}return false;};
  var f=1;el.style.setProperty(prop,'1');while(f>min&&over()){f-=.03;el.style.setProperty(prop,f.toFixed(2));}
}
function fitA(){var box=document.getElementById('t-a');if(!box)return;var f=1;box.style.setProperty('--fa','1');while(f>.5&&(box.scrollHeight>box.clientHeight+1||box.scrollWidth>box.clientWidth+1)){f-=.03;box.style.setProperty('--fa',f.toFixed(2));}}
function startScroll(){
  clearInterval(D.scT);var v=document.getElementById('t-scv');if(!v)return;var st=D.sc;v.scrollTop=st.pos;
  if(v.scrollHeight-v.clientHeight<3){st.pos=0;v.scrollTop=0;return;}if(reduce())return;
  D.scT=setInterval(function(){if(!v.isConnected){clearInterval(D.scT);return;}if(st.hold>0){st.hold--;return;}var max=v.scrollHeight-v.clientHeight;st.pos=Math.max(0,Math.min(max,st.pos+st.dir*(st.dir>0?1:3)));v.scrollTop=st.pos;if(st.dir>0&&st.pos>=max){st.dir=-1;st.hold=90;}else if(st.dir<0&&st.pos<=0){st.dir=1;st.hold=90;}},40);
}
function fitFlyer(S,im){
  var tv=document.getElementById('tv2'),stage=document.getElementById('t-stage');if(!tv||!stage)return;
  tv.classList.remove('wide');var w=im.naturalWidth,h=im.naturalHeight;if(!w||!h||S.display.flyerFull===false)return;
  var a=Math.min(stage.clientWidth/w,stage.clientHeight/h);tv.classList.add('wide');var b=Math.min(stage.clientWidth/w,stage.clientHeight/h);if(b<a*1.15)tv.classList.remove('wide');
}
function startSlides(S){
  clearTimeout(D.slideT);var tv=document.getElementById('tv2'),stage=document.getElementById('t-stage');if(!stage)return;
  if(tv)tv.classList.remove('wide');
  if(A.ui.stillFlag){stage.innerHTML='<div class="t-slide shab">'+shabBoard(S,true)+'</div>';fitBox(stage.querySelector('.t-slide'),'--fit',.35);return;}
  var list=tSlides(S);if(D.slide>=list.length)D.slide=0;var s=list[D.slide];
  stage.innerHTML='<div class="t-slide '+s.cls+'">'+s.html+'</div>'+(list.length>1?'<div class="t-dots">'+list.map(function(_,i){return '<i class="'+(i===D.slide?'on':'')+'"></i>';}).join('')+'</div>':'');
  var el=stage.querySelector('.t-slide');
  if(s.cls==='img')A.imgUrl(s.img).then(function(url){if(!url||!stage.contains(el))return;var im=A.preload(url);if(im.complete&&im.naturalWidth)fitFlyer(S,im);else im.addEventListener('load',function(){if(stage.contains(el))fitFlyer(S,im);},{once:true});});
  else fitBox(el,'--fit',.35);
  list.forEach(function(x){if(x.img)A.imgUrl(x.img).then(function(u){if(u)A.preload(u);});});
  D.slideT=setTimeout(function(){D.slide=(D.slide+1)%Math.max(1,list.length);if(location.hash==='#display')startSlides(A.screenState());},s.secs*1000);
}

/* ---------- hooks the engine calls ---------- */
var SKIN={
  loading:function(api){A=api;A.addStrings(STR);return '<div class="v2-loading">'+MARK+'</div>';},
  home:function(api){A=api;A.addStrings(STR);cancelAnimationFrame(D.anim);return home();},
  display:function(api){A=api;A.addStrings(STR);return display();},
  after:function(r){
    document.documentElement.classList.toggle('dr-open',r==='home'&&!!D.dr);
    if(r==='home'){
      layoutPins('w');
      if(D.first){D.first=false;var P=A.jp(),md=dayModel(A.state,P);if(md)rise(A.state,md,'w');}
      if(D.dr&&D.focusDr){D.focusDr=false;var dr=document.getElementById('dr');if(dr){requestAnimationFrame(function(){dr.classList.add('in');});try{dr.focus({preventScroll:true});}catch(e){}}}
      else if(D.dr){var d2=document.getElementById('dr');if(d2)d2.classList.add('in','still');}
      swipe();
    }else if(r==='display'){
      var S=A.screenState();layoutPins('t');fitA();startScroll();startSlides(S);
    }
  },
  tick:function(r,P,S,still){
    if(P.mm===D.lastMin)return;D.lastMin=P.mm;
    if(r==='home'){
      var md=dayModel(S,P),wk=A.weekInfo(P.iso,S.shul),nx=A.nextTefillah(S,new Date());
      var sky=document.getElementById('sky');if(sky){sky.innerHTML=skyInner(S,P,md,wk,nx);layoutPins('w');}
      var bt=document.getElementById('b-today');if(bt)bt.outerHTML=blkToday(S,P,md,nx);
    }else if(r==='display'){
      if(still)return;
      var sk=document.getElementById('t-sky');if(sk){sk.innerHTML=tSky(S,P,false);layoutPins('t');}
      var a=document.getElementById('t-a');if(a){a.innerHTML=tColA(S,P,false);fitA();}
      var c=document.getElementById('t-c');if(c){c.innerHTML=tColC(S,P);startScroll();}
      var f=document.getElementById('t-foot');if(f)f.innerHTML=tFoot(S);
    }
  },
  resize:function(r){if(r==='display')A.render();else if(r==='home')layoutPins('w');},
  fit:function(r){if(r==='display'){layoutPins('t');fitA();var el=document.querySelector('#t-stage .t-slide');if(el&&!el.classList.contains('img'))fitBox(el,'--fit',.35);startScroll();}else if(r==='home')layoutPins('w');},
  jump:function(h){var map={docs:'docs',minutes:'docs',zmanim:'zmanim',simchas:'simchas',contact:'contact',donate:'give',notices:'notices',times:'week',schedule:'week'};if(map[h]){history.replaceState(null,'',location.pathname+location.search);return openDr(map[h]);}return false;}
};

/* notices: swipe left/right on phones */
function swipe(){
  var v=document.getElementById('ntc-view');if(!v||v._sw)return;v._sw=1;var x0=null,y0=null;
  v.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse')return;x0=e.clientX;y0=e.clientY;},{passive:true});
  v.addEventListener('pointerup',function(e){if(x0==null)return;var dx=e.clientX-x0,dy=e.clientY-y0;x0=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)page((dx<0)===rtl()?-1:1);},{passive:true});
}
function page(n){var S=A.state,P=A.jp(),list=noticeList(S,P.iso,P.dow);if(list.length<2)return;D.ni=(D.ni+n+list.length)%list.length;var b=document.getElementById('b-notices');if(b){b.outerHTML=blkNotices(S,P.iso,P.dow);swipe();}}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-v2]');if(!b||!A)return;var act=b.getAttribute('data-v2');
  if(act==='open'){e.preventDefault();openDr(b.getAttribute('data-d'));return;}
  if(act==='close'){e.preventDefault();closeDr();return;}
  if(act==='np'){page(+b.getAttribute('data-n'));return;}
  if(act==='zd'){var n=+b.getAttribute('data-n'),today=A.jp().iso;D.zDate=n===0?today:A.isoAdd(D.zDate||today,n);var body=document.getElementById('dr-b');if(body&&D.dr==='zmanim')body.innerHTML=dZmanim(A.state);return;}
});
document.addEventListener('keydown',function(e){
  if(!A||!D.dr)return;
  if(e.key==='Escape'){closeDr();return;}
  if(e.key==='Tab'){var dr=document.getElementById('dr');if(!dr)return;var f=[].slice.call(dr.querySelectorAll('button,a[href],summary,[tabindex]:not([tabindex="-1"])')).filter(function(x){return x.offsetParent!==null;});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&(document.activeElement===a||document.activeElement===dr)){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}
});
window.SHUL_SKIN=SKIN;
})();
