/* Siach HaSadeh v3: artwork for every occasion in the year.
   Each emblem is a small drawing (200 x 200) used in the website header, the TV header and the TV holiday screen.
   The theme for each date is chosen automatically in skin.js; nothing here needs changing from year to year. */
(function(){
'use strict';
var G='#E6B65A',G2='#B88430';
function svg(body,label){return '<svg class="emb" viewBox="0 0 200 200" role="img" aria-label="'+(label||'')+'">'+body+'</svg>';}

var ART={
  /* Rosh Hashana: shofar and pomegranate, white and gold */
  rh:svg(
    '<path d="M22 154C52 136 90 108 124 66L156 38c7-5 18 3 13 11l-22 32c-30 40-74 72-116 90z" fill="'+G+'"/>'+
    '<path d="M152 40l20 26" stroke="'+G2+'" stroke-width="6" stroke-linecap="round"/>'+
    '<path d="M58 138l11 14M86 117l11 13M110 96l11 12" stroke="'+G2+'" stroke-width="3.5" stroke-linecap="round"/>'+
    '<circle cx="132" cy="150" r="30" fill="#C2402F"/><path d="M121 121l4-11 7 8 7-8 4 11z" fill="#9C2C20"/>'+
    '<ellipse cx="121" cy="142" rx="7" ry="11" fill="#fff" opacity=".2"/>','shofar'),

  /* Sukkot: the sukkah with schach, lulav and etrog */
  sukkot:svg(
    '<rect x="30" y="84" width="104" height="88" rx="3" fill="rgba(232,194,90,.16)" stroke="#E8C25A" stroke-width="5"/>'+
    '<path d="M70 172v-44a12 12 0 0 1 24 0v44" fill="none" stroke="#E8C25A" stroke-width="5"/>'+
    '<path d="M22 82h120" stroke="#3E7D4A" stroke-width="11" stroke-linecap="round"/>'+
    '<path d="M30 74l10-12M48 74l8-14M66 74l10-12M84 74l8-14M102 74l10-12M120 74l8-14" stroke="#62A862" stroke-width="5" stroke-linecap="round"/>'+
    '<path d="M166 34v142" stroke="#62A862" stroke-width="7" stroke-linecap="round"/>'+
    '<path d="M166 52l-13-16M166 52l13-16M166 72l-11-12M166 72l11-12" stroke="#62A862" stroke-width="4" stroke-linecap="round"/>'+
    '<ellipse cx="150" cy="164" rx="17" ry="12" fill="#F1D04B"/><path d="M134 162l-6-3" stroke="#8A7A2A" stroke-width="3" stroke-linecap="round"/>','sukkah'),

  /* Shemini Atzeret / Simchat Torah: a Sefer Torah and a flag */
  simchat:svg(
    '<rect x="40" y="46" width="16" height="122" rx="8" fill="#8A5A2B"/><rect x="104" y="46" width="16" height="122" rx="8" fill="#8A5A2B"/>'+
    '<rect x="54" y="58" width="52" height="98" fill="#FBF3DF" stroke="#D8C9A3" stroke-width="2"/>'+
    '<path d="M62 74h36M62 86h36M62 98h36M62 110h36M62 122h36M62 134h28" stroke="#9A8A6A" stroke-width="3" stroke-linecap="round"/>'+
    '<circle cx="48" cy="40" r="7" fill="'+G+'"/><circle cx="112" cy="40" r="7" fill="'+G+'"/><circle cx="48" cy="174" r="7" fill="'+G+'"/><circle cx="112" cy="174" r="7" fill="'+G+'"/>'+
    '<path d="M146 186V44" stroke="#C9B48A" stroke-width="5" stroke-linecap="round"/>'+
    '<path d="M148 46h40v30h-40z" fill="#fff" stroke="#2B5BC4" stroke-width="2"/><path d="M148 52h40M148 70h40" stroke="#2B5BC4" stroke-width="4"/>','sefer torah'),

  /* Tu BiShvat: an almond branch in blossom */
  tubishvat:svg(
    '<path d="M24 176C70 150 108 120 176 30M96 128c-8-16-6-30 4-42M132 86c14-4 26-2 36 6" fill="none" stroke="#7A5233" stroke-width="7" stroke-linecap="round"/>'+
    [[64,150],[104,84],[146,60],[172,92],[120,116]].map(function(p){var x=p[0],y=p[1],o='';for(var i=0;i<5;i++){var a=i*72*Math.PI/180;o+='<circle cx="'+(x+Math.cos(a)*9).toFixed(1)+'" cy="'+(y+Math.sin(a)*9).toFixed(1)+'" r="8" fill="#F6C9D3"/>';}return o+'<circle cx="'+x+'" cy="'+y+'" r="4.5" fill="#D9607A"/>';}).join(''),'almond blossom'),

  /* Purim: a mask and a megillah */
  purim:svg(
    '<path d="M22 88c10-18 42-20 58-6 10 9 30 9 40 0 16-14 48-12 58 6 6 12 0 34-18 40-18 6-34-4-44-14-6-6-26-6-32 0-10 10-26 20-44 14-18-6-24-28-18-40z" fill="#8E3FB0"/>'+
    '<ellipse cx="60" cy="100" rx="15" ry="10" fill="#2A1238"/><ellipse cx="140" cy="100" rx="15" ry="10" fill="#2A1238"/>'+
    '<path d="M24 88l-12-20M176 88l12-20" stroke="#F7C548" stroke-width="5" stroke-linecap="round"/><circle cx="12" cy="66" r="6" fill="#F7C548"/><circle cx="188" cy="66" r="6" fill="#F7C548"/>'+
    '<rect x="62" y="144" width="96" height="34" rx="4" fill="#FBF3DF" stroke="#D8C9A3" stroke-width="2"/><rect x="50" y="138" width="16" height="46" rx="8" fill="'+G+'"/>'+
    '<path d="M74 154h70M74 166h56" stroke="#9A8A6A" stroke-width="3" stroke-linecap="round"/>','mask and megillah'),

  /* Pesach: matzah and a cup of wine, spring light blue */
  pesach:svg(
    '<path d="M22 70l8-4 8 4 8-4 8 4 8-4 8 4 8-4 8 4 8-4 8 4 4 8-4 8 4 8-4 8 4 8-4 8 4 8-4 8 4 8-4 8-8 4-8-4-8 4-8-4-8 4-8-4-8 4-8-4-8 4-8-4-4-8 4-8-4-8 4-8-4-8 4-8-4-8 4-8-4-8z" fill="#EBCB8B" stroke="#C49A55" stroke-width="2"/>'+
    '<path d="M38 88h70M38 104h70M38 120h70M38 136h70M38 152h70" stroke="#B07D3A" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>'+
    '<path d="M136 66h44c0 30-8 48-22 50-14-2-22-20-22-50z" fill="#9C2142"/><path d="M136 66h44" stroke="#C9B48A" stroke-width="4"/>'+
    '<path d="M158 116v44M140 166h36" stroke="#C9B48A" stroke-width="6" stroke-linecap="round"/>','matzah and cup'),

  /* Lag BaOmer: a bonfire */
  lag:svg(
    '<path d="M30 168l140-26M30 142l140 26" stroke="#6B3E1E" stroke-width="13" stroke-linecap="round"/>'+
    '<path d="M100 26c22 30 46 50 46 86 0 28-20 46-46 46s-46-18-46-46c0-20 12-34 22-46 2 16 8 24 16 28-4-24 0-46 8-68z" fill="#F08A24"/>'+
    '<path d="M100 74c12 18 24 30 24 52 0 16-10 26-24 26s-24-10-24-26c0-10 6-18 12-24 2 10 6 14 10 16-2-14 0-28 2-44z" fill="#FFD25A"/>','bonfire'),

  /* Shavuot: the luchot and sheaves of wheat */
  shavuot:svg(
    '<path d="M44 168V74a24 24 0 0 1 48 0v94zM100 168V74a24 24 0 0 1 48 0v94z" fill="#EFE6D0" stroke="#B3A27A" stroke-width="3"/>'+
    '<path d="M56 92h24M56 106h24M56 120h24M56 134h24M112 92h24M112 106h24M112 120h24M112 134h24" stroke="#8A7A5A" stroke-width="3" stroke-linecap="round"/>'+
    '<path d="M168 184V70M180 184V84M156 184V90" stroke="#C9A440" stroke-width="3" stroke-linecap="round"/>'+
    [[168,62],[180,76],[156,82]].map(function(p){var o='';for(var i=0;i<4;i++)o+='<ellipse cx="'+(p[0]-5)+'" cy="'+(p[1]+i*9)+'" rx="4" ry="6" fill="#E3BE4E"/><ellipse cx="'+(p[0]+5)+'" cy="'+(p[1]+i*9+4)+'" rx="4" ry="6" fill="#E3BE4E"/>';return o;}).join(''),'luchot and wheat'),

  /* Yom HaShoah: a single memorial candle */
  shoah:svg(
    '<ellipse cx="100" cy="64" rx="34" ry="44" fill="#F7D98A" opacity=".18"/>'+
    '<path d="M100 30c12 16 18 26 18 36a18 18 0 0 1-36 0c0-10 6-20 18-36z" fill="#F7C65A"/><path d="M100 50c6 8 8 13 8 18a8 8 0 0 1-16 0c0-5 2-10 8-18z" fill="#FFF1C2"/>'+
    '<path d="M100 84v10" stroke="#3A3226" stroke-width="3"/><rect x="72" y="94" width="56" height="84" rx="6" fill="#E9E4DA" stroke="#BDB5A6" stroke-width="2"/>'+
    '<rect x="72" y="94" width="56" height="12" fill="#CFC7B8"/>','memorial candle'),

  /* Yom HaZikaron and the October 7 memorial day: candle and the flag at half mast */
  zikaron:svg(
    '<path d="M40 186V20" stroke="#C9CDD6" stroke-width="5" stroke-linecap="round"/><path d="M42 80h66v44H42z" fill="#fff"/><path d="M42 86h66M42 118h66" stroke="#2B5BC4" stroke-width="6"/>'+
    '<path d="M75 92l7 12H68zM75 112l-7-12h14z" fill="none" stroke="#2B5BC4" stroke-width="2.4"/>'+
    '<path d="M150 70c10 13 15 21 15 29a15 15 0 0 1-30 0c0-8 5-16 15-29z" fill="#F7C65A"/><path d="M150 86c5 6 6 10 6 14a6 6 0 0 1-12 0c0-4 1-8 6-14z" fill="#FFF1C2"/>'+
    '<rect x="128" y="120" width="44" height="64" rx="5" fill="#E9E4DA" stroke="#BDB5A6" stroke-width="2"/>','memorial candle and flag'),

  /* Yom HaAtzmaut: the flag of Israel */
  atzmaut:svg(
    '<path d="M28 186V18" stroke="#C9CDD6" stroke-width="6" stroke-linecap="round"/>'+
    '<path d="M31 30c30-10 56 10 84 2s50-10 66 0v104c-16-10-38-8-66 0s-54-12-84-2z" fill="#fff" stroke="#D5DCEA" stroke-width="1.5"/>'+
    '<path d="M31 46c30-10 56 10 84 2s50-10 66 0M31 120c30-10 56 10 84 2s50-10 66 0" fill="none" stroke="#0038B8" stroke-width="9"/>'+
    '<path d="M106 60l17 30H89zM106 100L89 70h34z" fill="none" stroke="#0038B8" stroke-width="5" stroke-linejoin="round"/>','flag of Israel'),

  /* Yom Yerushalayim: the Old City wall and the Tower of David, in Jerusalem gold */
  yerushalayim:svg(
    '<path d="M14 182V110h12v-10h12v10h12v-10h12v10h12v-10h12v10h12v-10h12v10h12v-10h12v10h12v-10h12v10h12v-10h12v10h12v72z" fill="#E2C27A"/>'+
    '<path d="M86 182v-30a14 14 0 0 1 28 0v30z" fill="#8A6A32"/>'+
    '<path d="M136 110V58h8v-8h8v8h8v-8h8v8h8v52z" fill="#D9B464"/><path d="M146 50c0-14 8-26 14-26s14 12 14 26z" fill="#E8CC86"/><path d="M160 24v-10" stroke="#B8923E" stroke-width="3"/>'+
    '<path d="M150 74h8v14h-8zM164 74h8v14h-8z" fill="#8A6A32"/><path d="M14 182h172" stroke="#B8923E" stroke-width="3"/>','Jerusalem walls'),

  /* Rosh Chodesh: the new moon */
  rc:svg(
    '<path d="M126 34a72 72 0 1 0 40 128 58 58 0 1 1-40-128z" fill="#F2DE9C"/>'+
    '<path d="M54 50l3 8 8 3-8 3-3 8-3-8-8-3 8-3zM160 56l2 5 5 2-5 2-2 5-2-5-5-2 5-2zM42 140l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFF4D6"/>','new moon'),

  /* Fast days and Yom Kippur: quiet, no decoration */
  fast:'',yk:''
};

/* The chanukiah, with tonight's candles lit (added right to left, the shamash always lit). */
function chanukiah(n,label){
  n=Math.max(0,Math.min(8,n|0));
  var xs=[70,140,210,280,400,470,540,610],lit=[610,540,470,400,280,210,140,70].slice(0,n);
  var cups=xs.concat([340]).map(function(x){var y=x===340?136:214;return '<rect x="'+(x-18)+'" y="'+y+'" width="36" height="16" rx="4" fill="url(#cg-metal)"/>';}).join('');
  var flame=function(x,y){return '<g transform="translate('+x+' '+y+')"><circle r="40" fill="url(#cg-glow)"/><path d="M0 -38C10 -22 12 -12 12 -5A12 12 0 0 1 -12 -5C-12 -12 -10 -22 0 -38Z" fill="url(#cg-flame)"/></g>';};
  var candles=lit.map(function(x){return '<rect x="'+(x-8)+'" y="150" width="16" height="64" rx="3" fill="#F7F0E1"/>'+flame(x,146);}).join('');
  var sham=n?'<rect x="332" y="72" width="16" height="64" rx="3" fill="#F7F0E1"/>'+flame(340,68):'';
  return '<svg class="chanukiah" viewBox="0 0 680 340" role="img" aria-label="'+(label||'')+'"><defs>'+
    '<radialGradient id="cg-glow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFD877" stop-opacity=".6"/><stop offset="1" stop-color="#FFD877" stop-opacity="0"/></radialGradient>'+
    '<linearGradient id="cg-flame" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#F29A2E"/><stop offset=".6" stop-color="#FFD36B"/><stop offset="1" stop-color="#FFF4C9"/></linearGradient>'+
    '<linearGradient id="cg-metal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B9862C"/><stop offset=".5" stop-color="#F2CF7A"/><stop offset="1" stop-color="#B9862C"/></linearGradient></defs>'+
    '<rect x="330" y="242" width="20" height="62" fill="url(#cg-metal)"/><rect x="266" y="300" width="148" height="16" rx="8" fill="url(#cg-metal)"/>'+
    '<rect x="50" y="230" width="580" height="12" rx="6" fill="url(#cg-metal)"/><rect x="332" y="150" width="16" height="80" fill="url(#cg-metal)"/>'+
    cups+candles+sham+'</svg>';
}
/* A small chanukiah for headers */
ART.chanukah=svg('<g transform="translate(0 40) scale(.294)">'+chanukiah(8).replace(/^<svg[^>]*>|<\/svg>$/g,'').replace(/cg-/g,'cgs-')+'</g>','chanukiah');

window.SHUL_ART={emblem:function(k){return ART[k]||'';},chanukiah:chanukiah,has:function(k){return !!ART[k];}};
})();
