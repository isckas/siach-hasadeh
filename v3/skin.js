/* Siach HaSadeh, version 3: the shul under its own sky.
   Website: the shul's own wall and flag stand at the bottom of the night-blue header, with the next tefillah above them,
   then five Jerusalem-stone blocks. TV board: a slim header, fixed times and community columns, and a rotating centre
   (notices, yahrzeits, the memorial wall, sponsors, Halacha Yomit, holiday, fast and Omer screens).
   Holiday themes switch on by themselves from the calendar. Same data, engine and board manager as v1/v2 (../app.js). */
(function(){
'use strict';
var A=null,ART=window.SHUL_ART||{emblem:function(){return '';},chanukiah:function(){return '';},has:function(){return false;}};
var D={dr:'',drArg:'',focusDr:false,ni:0,lastMin:-1,slide:0,slideT:null,scT:null,sc:{pos:0,dir:1,hold:90},halIdx:0,theme:null,
  send:{type:'mazal',done:false,err:'',busy:false,greg:false,v:{}}};
function Hc(){return window.hebcal;}
function LY(){return window.HebcalLeyning;}
var reduce=function(){return !!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);};

var STR={
  v3_next:['התפילה הבאה','Next tefillah'], v3_today:['תפילות היום','Today\'s tefillot'], v3_tomorrow_t:['תפילות מחר','Tomorrow\'s tefillot'],
  v3_shiurim:['שיעורים','Shiurim'], v3_daf_today:['היום: {d}','Today: {d}'], v3_full:['לוח הזמנים המלא','Full schedule'],
  v3_haft:['הפטרה: {h}','Haftarah: {h}'], v3_erev:['ערב שבת','Friday'], v3_shabbat_day:['שבת','Shabbat'], v3_shabbat_of:['שבת {p}','Shabbat {p}'],
  v3_kiddush_cta:['להקדשת הקידוש','Sponsor the Kiddush'],
  v3_notices:['הודעות','Notices'], v3_all_notices:['כל ההודעות','All notices'], v3_prev:['ההודעה הקודמת','Previous notice'], v3_nextn:['ההודעה הבאה','Next notice'], v3_of:['{a} מתוך {b}','{a} of {b}'],
  v3_comm:['השבוע בקהילה','This week in the community'],
  v3_c_mazal:['מזל טוב','Mazal tov'], v3_c_simcha:['שמחות קרובות','Upcoming simchas'], v3_c_birthday:['ימי הולדת','Birthdays'], v3_c_yahrzeit:['יארצייט','Yahrzeits'], v3_c_refuah:['רפואה שלמה','Refuah shleimah'],
  v3_send_mazal:['+ שליחת מזל טוב','+ Send a mazal tov'], v3_send_simcha:['+ שליחת שמחה','+ Send a simcha'], v3_send_birthday:['+ שליחת יום הולדת','+ Send a birthday'], v3_send_yahrzeit:['+ שליחת יארצייט','+ Send a yahrzeit'], v3_send_refuah:['+ הוספת שם','+ Add a name'],
  v3_c_none:['אין עדיין השבוע','None yet this week'],
  v3_give:['תרומה לבית הכנסת','Donate to the shul'], v3_more_give:['העברה בנקאית ודרכים נוספות','Bank transfer and other ways'],
  v3_simchas_all:['לוח שמחות','Simchas calendar'], v3_docs:['פרוטוקולים ומסמכים','Minutes and documents'], v3_contact:['הגעה ויצירת קשר','Directions and contact'],
  v3_screen:['מסך בית הכנסת','Shul screen'], v3_board:['כניסת חברי ועד','Board sign-in'], v3_manage:['ניהול','Manage'], v3_close:['סגירה','Close'],
  v3_old:['העיצובים הקודמים','Previous designs'], v3_v1:['גרסה 1','Version 1'], v3_v2:['גרסה 2','Version 2'],
  v3_kiddush_how:['להקדשת קידוש, סעודה שלישית או שיעור, פנו לגבאי{g}.','To sponsor a Kiddush, Seudah Shlishit or a shiur, speak to the gabbai{g}.'],
  v3_wall_alt:['חזית בית הכנסת שיח השדה, עם שם בית הכנסת באותיות מתכת ודגל ישראל','The front wall of the Siach HaSadeh shul, its name in metal letters and the Israeli flag'],
  /* send-in form */
  v3_send_title:['שליחה לקהילה','Send to the community'], v3_what:['מה תרצו לשלוח?','What would you like to send?'],
  f3_text:['נוסח הברכה','Your message'], f3_text_ph:['למשל: מזל טוב למשפחת כהן להולדת הבת','e.g. Mazal tov to the Cohen family on the birth of their daughter'],
  f3_from:['להציג מתאריך','Show from'], f3_until:['עד תאריך','Until'],
  f3_date:['תאריך השמחה','Date'], f3_title:['מה השמחה','What is the simcha'], f3_title_ph:['למשל: בר המצווה של נועם כהן','e.g. Noam Cohen\'s bar mitzvah'], f3_details:['שעה ומקום (לא חובה)','Time and place (optional)'],
  f3_who_yahrzeit:['שם הנפטר או הנפטרת','Name of the departed'], f3_who_yahrzeit_ph:['למשל: משה בן אברהם','e.g. Moshe ben Avraham'],
  f3_hdate_yahrzeit:['תאריך הפטירה העברי','Hebrew date of passing'], f3_hdate_birthday:['יום ההולדת העברי','Hebrew birthday'],
  f3_hday:['יום','Day'], f3_hmonth:['חודש','Month'], f3_hyear:['שנה (לא חובה)','Year (optional)'], f3_hyear_ph:['למשל: תשמ״ח','e.g. 5748'],
  f3_greg_q:['יודעים רק את התאריך הלועזי?','Only know the regular date?'], f3_greg:['התאריך הלועזי','Regular date'], f3_after:['אחרי השקיעה','After sunset'], f3_greg_res:['התאריך העברי: {d}','Hebrew date: {d}'],
  f3_rel:['קרבה (לא חובה)','Relationship (optional)'], f3_rel_ph:['למשל: אבי','e.g. my father'],
  f3_who_refuah:['שם לרפואה','Name for a refuah'], f3_who_refuah_ph:['למשל: יעקב בן שרה','e.g. Yaakov ben Sarah'], f3_until_opt:['עד תאריך (לא חובה)','Until (optional)'],
  f3_who_birthday:['של מי יום ההולדת','Whose birthday'], f3_who_birthday_ph:['למשל: שירה כהן','e.g. Shira Cohen'],
  f3_name:['השם שלך','Your name'], f3_phone:['הטלפון שלך','Your phone'],
  f3_privacy:['זה יופיע באתר ובמסך בית הכנסת אחרי אישור הגבאים. השם והטלפון שלך לא מוצגים; הם רק לגבאים.','This appears on the website and the shul screen once the gabbaim approve it. Your name and phone are not shown; they are for the gabbaim only.'],
  f3_submit:['שליחה לאישור','Send for approval'], f3_sending:['שולח…','Sending…'],
  f3_done_t:['תודה, קיבלנו','Thank you, we have it'], f3_done:['זה יופיע באתר ובמסך אחרי שהגבאים יאשרו.','It will appear on the website and the screen once the gabbaim approve it.'], f3_another:['שליחה נוספת','Send another'],
  f3_req:['צריך למלא את השדות המסומנים.','Please fill in the marked fields.'], f3_phone_bad:['מספר הטלפון לא נראה תקין.','That phone number doesn\'t look right.'],
  f3_wait:['שלחתם הרגע. אפשר לשלוח שוב בעוד דקה.','You just sent one. You can send another in a minute.'],
  f3_fail:['השליחה לא הצליחה. נסו שוב בעוד כמה דקות.','Sending didn\'t work. Try again in a few minutes.'], f3_offline:['אין חיבור לאינטרנט. נסו שוב כשיהיה חיבור.','You\'re offline. Try again when you\'re connected.'],
  f3_required:['חובה','required'],
  /* dates and TV */
  v3_leil:['ליל {d}','{d} night'], v3_leil_shabbat:['ליל שבת','Friday night'], v3_motzash:['מוצאי שבת','Motzaei Shabbat'],
  v3_kind:['בית כנסת בצמח השדה, מעלה אדומים','Tzemach HaSadeh, Ma\'ale Adumim'],
  v3_chan_nr:['חנוכה, נר {o}','Chanukah, {o} candle'], v3_zot:['זאת חנוכה','Zot Chanukah'],
  v3_yz_title:['יארצייט השבוע','This week\'s yahrzeits'], v3_nishmat:['תהא נשמתם צרורה בצרור החיים','May their souls be bound up in the bond of life'],
  v3_d_today:['היום','Today'], v3_d_tom:['מחר','Tomorrow'], v3_d_tom_fri:['מחר, ערב שבת','Tomorrow, Friday'], v3_d_shabbat:['בשבת קודש','On Shabbat'], v3_d_on:['ביום {d}','On {d}'],
  v3_mem_title:['לוח הזיכרון','Memorial wall'], v3_mem_today:['יום הפטירה היום','Yahrzeit today'], v3_mem_month:['חודש הפטירה','Month of passing'], v3_mem_first:['השנה הראשונה','First year'], v3_mem_by:['הונצח על ידי {b}','Dedicated by {b}'],
  v3_sp_title:['השבוע בחסות','This week\'s sponsors'], v3_sp_thanks:['תודה למשפחות שהקדישו השבוע','Thank you to this week\'s sponsors'], v3_sp_cta:['רוצים להקדיש קידוש, סעודה שלישית או שיעור? פנו לגבאים.','Want to sponsor a Kiddush, Seudah Shlishit or a shiur? Speak to the gabbaim.'],
  v3_hal_title:['הלכה יומית','Halacha Yomit'], v3_hal_seif:['סעיף {s}','Se\'if {s}'], v3_hal_full:['ההלכה המלאה עם המפרשים','The full halacha with commentaries'], v3_hal_scan:['סרקו לקריאה בספריא','Scan to read it on Sefaria'], v3_hal_src:['הטקסט מספריא','Text from Sefaria'],
  v3_next_up:['בהמשך','Coming up'],
  v3_tonight_n:['הלילה מדליקים {n} נרות','Tonight we light {n} candles'], v3_tonight_1:['הלילה מדליקים נר אחד','Tonight we light one candle'],
  v3_sunset:['שקיעה','Sunset'], v3_tzeit:['צאת הכוכבים','Nightfall'], v3_read_tmr:['קריאת התורה מחר','Tomorrow\'s Torah reading'], v3_read_today:['קריאת התורה היום','Today\'s Torah reading'],
  v3_fast_start:['תחילת הצום','Fast begins'], v3_fast_end:['סיום הצום','Fast ends'], v3_fast_tmr:['מחר: {n}','Tomorrow: {n}'],
  v3_reading:['קריאת התורה','Torah reading'], v3_reading_both:['{r}, בשחרית ובמנחה','{r}, at Shacharit and Mincha'], v3_in_tefilla:['בתפילה','In davening'], v3_fast_adds:['עננו, סליחות ואבינו מלכנו','Aneinu, Selichot and Avinu Malkeinu'],
  v3_kaddish_klali:['יום הקדיש הכללי','Yom HaKaddish HaKlali'], v3_kaddish_klali_d:['לזכר הנספים בשואה שיום מותם אינו ידוע','For Holocaust victims whose day of death is unknown'],
  v3_omer_t:['ספירת העומר','Sefirat HaOmer'], v3_omer_tonight:['הלילה סופרים','Tonight we count'],
  v3_hallel_bracha:['הלל בברכה','Hallel with a bracha'], v3_in_shacharit:['בתפילת שחרית','At Shacharit'],
  v3_atz_n:['יום העצמאות ה־{n} למדינת ישראל','Israel\'s {n}th Independence Day'], v3_yy_n:['{n} שנים לאיחוד ירושלים','{n} years since Jerusalem was reunited'],
  v3_siren_eve:['צפירה בערב','Evening siren'], v3_siren_day:['צפירה בבוקר','Morning siren'], v3_yehi:['יהי זכרם ברוך','May their memory be a blessing'],
  v3_candles:['הדלקת נרות','Candle lighting'], v3_chag_end:['צאת החג','Yom Tov ends'], v3_shab_end:['צאת השבת','Shabbat ends'],
  v3_shabbat_shalom:['שבת שלום','Shabbat Shalom'], v3_chag_sameach:['חג שמח','Chag Sameach'],
  v3_aneinu:['עננו','Aneinu'], v3_selichot:['סליחות','Selichot'], v3_avinu:['אבינו מלכנו','Avinu Malkeinu'],
  g_rh:['שנה טובה ומתוקה','Shana Tova U\'Metuka'], g_yk:['גמר חתימה טובה','G\'mar Chatima Tova'], g_sukkot:['חג סוכות שמח','Chag Sukkot Sameach'], g_moadim:['מועדים לשמחה','Moadim LeSimcha'],
  g_simchat:['חג שמח','Chag Sameach'], g_chanukah:['חנוכה שמח','Happy Chanukah'], g_tubishvat:['ט״ו בשבט שמח','Happy Tu BiShvat'], g_purim:['פורים שמח','Purim Sameach'],
  g_pesach:['חג כשר ושמח','Chag Kasher V\'Sameach'], g_lag:['ל״ג בעומר שמח','Happy Lag BaOmer'], g_shavuot:['חג שבועות שמח','Chag Shavuot Sameach'],
  g_atzmaut:['חג עצמאות שמח','Chag Atzmaut Sameach'], g_yerushalayim:['יום ירושלים שמח','Happy Yom Yerushalayim'], g_rc:['חודש טוב','Chodesh Tov'],
  v3_give_scan:['סרקו לתרומה','Scan to donate'],
  v3_welcome:['ברוכים הבאים לבית הכנסת שיח השדה','Welcome to Siach HaSadeh']
};
var WD={he:['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'],en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']};
var ORD={he:['ראשון','שני','שלישי','רביעי','חמישי','שישי','שביעי','שמיני'],en:['1st','2nd','3rd','4th','5th','6th','7th','8th']};

/* ---------- small helpers ---------- */
function T(k,v,lg){return A.t(k,v,lg);}
function E(s){return A.esc(s);}
function pad(n){return String(n).padStart(2,'0');}
function rtl(lg){return (lg||A.lang)==='he';}
function inLong(mins,lg){
  var h=Math.floor(mins/60),m=mins%60;
  if(rtl(lg)){var dm=function(n){return n===1?'דקה':n+' דקות';};if(!h)return 'בעוד '+dm(m);return 'בעוד '+(h===1?'שעה':(h===2?'שעתיים':h+' שעות'))+(m?' ו־'+dm(m):'');}
  return 'in '+(h?h+' hr'+(m?' '+m+' min':''):m+' min');
}
function cp(txt){return '<span class="cp"><bdi dir="ltr">'+E(txt)+'</bdi><button type="button" data-act="copy" data-text="'+E(txt)+'">'+E(T('copy'))+'</button></span>';}
function gem(n){var H=Hc();try{return H?H.gematriya(n):String(n);}catch(e){return String(n);}}
function nik(s){return String(s||'').replace(/־/g,'-').replace(/[֑-ׇ]/g,'');}
function daysBetween(a,b){return Math.round((Date.parse(b+'T12:00:00Z')-Date.parse(a+'T12:00:00Z'))/864e5);}
function noticeHas(n){return !!(n.image||String(n.titleHe||n.titleEn||'').trim()||String(n.bodyHe||n.bodyEn||'').trim());}
var IC={
  week:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  simchas:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h5l-.6 5.2a2 2 0 0 1-3.8 0zM9.5 10.8v8M7 19h5M14.5 6.5h5l-.6 5.2a2 2 0 0 1-3.8 0zM17 13.8v5.2M14.5 19.2h5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  docs:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3.5h7.5L19 8v12.5H7z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M14.5 3.5V8H19M10 12h6M10 15.5h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  contact:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  give:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.3-7-9.6A4 4 0 0 1 12 8a4 4 0 0 1 7 2.4C19 15.7 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  x:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  fwd:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  candle:'<svg viewBox="0 0 28 44" aria-hidden="true"><path d="M14 2c4 6 6 9 6 12a6 6 0 0 1-12 0c0-3 2-6 6-12z" fill="var(--flame,#F2B94B)"/><rect x="9" y="21" width="10" height="20" rx="2" fill="#F3EBDD" stroke="#B8A27C"/></svg>'
};

/* ---------- calendar layer: sunset rollover, themes, readings ---------- */
/* After sunset the Hebrew date and day move on ("ליל שישי"). */
function ctx(S,now){
  now=now||new Date();var P=A.jp(now),di=A.dayInfo(P.iso,S.shul),sh=di&&di.zm&&di.zm.shkia;
  var eve=!!(sh&&now.getTime()>=sh.getTime()),eIso=eve?A.isoAdd(P.iso,1):P.iso,edi=eve?A.dayInfo(eIso,S.shul):di;
  return {now:now,P:P,di:di,eve:eve,eIso:eIso,edi:edi};
}
function hebLong(hd,lg){
  if(!hd)return '';
  try{if(!rtl(lg))return hd.render('en');var p=hd.renderGematriya(true).split(' ');if(p.length<3)return p.join(' ');return p[0]+' ב'+p.slice(1,-1).join(' ')+' '+p[p.length-1];}catch(e){return '';}
}
function ptLabel(pt,lg){if(!pt)return '';return /^(פרשת|Parashat|Parshat)/.test(pt)?pt:T('v3_shabbat_of',{p:pt},lg);}
function dayLine(c,lg){
  var d=c.P.dow,pre='';
  if(c.eve)pre=d===5?T('v3_leil_shabbat',null,lg):(d===6?T('v3_motzash',null,lg):T('v3_leil',{d:WD[rtl(lg)?'he':'en'][(d+1)%7]},lg));
  var h=hebLong(c.edi&&c.edi.hd,lg);return pre?pre+', '+h:h;
}
var KEEP_MODERN={"Yom HaShoah":1,"Yom HaZikaron":1,"Yom HaAtzma'ut":1,"Yom Yerushalayim":1,"Swords of Iron War Memorial Day":1};
var DROP={"Chag HaBanot":1,"Rosh Hashana LaBehemot":1};
function holsOf(di){
  var H=Hc();if(!di||!H)return [];
  return di.hol.filter(function(e){var d=e.getDesc();if(e.getFlags()&H.flags.MODERN_HOLIDAY)return !!KEEP_MODERN[d];return !DROP[d];});
}
function descs(di){return holsOf(di).map(function(e){return e.getDesc();});}
var THEME_RULES=[
  [/^Rosh Hashana( \d+| II)?$/,'rh'],[/^Yom Kippur$/,'yk'],[/^Sukkot/,'sukkot'],[/^(Shmini Atzeret|Simchat Torah)/,'simchat'],
  [/^Chanukah: ([2-8] Candles|8th Day)/,'chanukah'],[/^Tu BiShvat$/,'tubishvat'],[/^(Purim|Shushan Purim)$/,'purim'],[/^Pesach [IV]/,'pesach'],[/^Lag BaOmer$/,'lag'],[/^Shavuot/,'shavuot'],
  [/^Yom HaShoah$/,'shoah'],[/^(Yom HaZikaron|Swords of Iron)/,'zikaron'],[/^Yom HaAtzma/,'atzmaut'],[/^Yom Yerushalayim$/,'yerushalayim'],
  [/^(Tzom Gedaliah|Asara B'Tevet|Ta'anit Esther|Tzom Tammuz|Tish'a B'Av)$/,'fast'],[/^Rosh Chodesh/,'rc']
];
function themeOfDi(di){var ds=descs(di);for(var i=0;i<THEME_RULES.length;i++){for(var j=0;j<ds.length;j++)if(THEME_RULES[i][0].test(ds[j]))return THEME_RULES[i][1];}return '';}
function themeNow(S,c){if(S.display.themes===false)return '';var th=themeOfDi(c.edi);return th;}
function evOf(di,re){var out=null;holsOf(di).forEach(function(e){if(!out&&re.test(e.getDesc()))out=e;});return out;}
function candlesTonight(c){var e=evOf(c.di,/^Chanukah: \d Candles?$/);if(!e)return 0;var m=e.getDesc().match(/^Chanukah: (\d) Candles?$/);return m?+m[1]:0;}
/* Header line: holidays of the (rolled-over) day, with Chanukah as "נר שלישי" and the Omer. */
function holLine(c,lg){
  var out=[],loc=A.locale(lg),chan=false;
  holsOf(c.edi).forEach(function(e){var d=e.getDesc();if(/^Chanukah/.test(d)){if(/^Chanukah: ([2-8] Candles|8th Day)/.test(d))chan=true;return;}out.push(e.render(loc));});
  if(chan||candlesTonight(c)){var n=candlesTonight(c);out.unshift(n?T('v3_chan_nr',{o:ORD[rtl(lg)?'he':'en'][n-1]},lg):T('v3_zot',null,lg));}
  if(c.edi&&c.edi.omer)try{out.push(c.edi.omer.render(loc));}catch(e){}
  return out.filter(function(x,i){return x&&out.indexOf(x)===i;});
}
/* Tefillah notes, with the shul's customs on Yom HaAtzmaut and Yom Yerushalayim (Hallel with a bracha, no Tachanun). */
function chipsFor(c){
  var out=A.seasonal(c.di,c.P.dow).slice(),ds=descs(c.di),nat=ds.some(function(d){return /^Yom HaAtzma|^Yom Yerushalayim$/.test(d);});
  var tomD=A.dayInfo(A.isoAdd(c.P.iso,1),A.state.shul),eveNat=descs(tomD).some(function(d){return /^Yom HaAtzma|^Yom Yerushalayim$/.test(d);});
  if(nat){out=out.filter(function(k){return !/^s_tach|^s_notach|^s_hallel/.test(k);});out.push('s_notach','v3_hallel_bracha');}
  else if(eveNat&&out.indexOf('s_tach')>=0)out[out.indexOf('s_tach')]='s_tach_s';
  if(ds.some(function(d){return /^(Tzom Gedaliah|Asara B'Tevet|Ta'anit Esther|Tzom Tammuz)$/.test(d);}))out.push('v3_aneinu','v3_selichot','v3_avinu');
  if(ds.indexOf("Tish'a B'Av")>=0)out.push('v3_aneinu');
  return out;
}
/* Torah readings (Eretz Yisrael), from @hebcal/leyning */
var BOOKS={Genesis:['בראשית'],Exodus:['שמות'],Leviticus:['ויקרא'],Numbers:['במדבר'],Deuteronomy:['דברים'],Joshua:['יהושע'],Judges:['שופטים'],'I Samuel':['שמואל א׳'],'II Samuel':['שמואל ב׳'],'I Kings':['מלכים א׳'],'II Kings':['מלכים ב׳'],
  Isaiah:['ישעיהו'],Jeremiah:['ירמיהו'],Ezekiel:['יחזקאל'],Hosea:['הושע'],Joel:['יואל'],Amos:['עמוס'],Obadiah:['עובדיה'],Jonah:['יונה'],Micah:['מיכה'],Nahum:['נחום'],Habakkuk:['חבקוק'],Zephaniah:['צפניה'],Haggai:['חגי'],Zechariah:['זכריה'],Malachi:['מלאכי'],
  Esther:['אסתר'],Ruth:['רות'],Lamentations:['איכה'],'Song of Songs':['שיר השירים'],Ecclesiastes:['קהלת']};
function lyOn(iso){var L=LY();if(!L)return [];try{var r=L.getLeyningOnDate(new L.HDate(A.civil(iso)),true,true);return (Array.isArray(r)?r:[r]).filter(Boolean);}catch(e){return [];}}
function refHe(summary){
  return String(summary||'').split('; ').map(function(part){
    var m=part.match(/^([A-Za-z ]+?) (\d.*)$/);if(!m)return part;var bk=BOOKS[m[1]]?BOOKS[m[1]][0]:m[1];
    return bk+' '+m[2].split(', ').map(function(r){
      var q=r.match(/^(\d+):(\d+)(?:-(?:(\d+):)?(\d+))?$/);if(!q)return r;var c1=+q[1],v1=+q[2],c2=q[3]?+q[3]:c1,v2=q[4]?+q[4]:null;
      return gem(c1)+', '+gem(v1)+(v2==null?'':(c2!==c1?'–'+gem(c2)+', '+gem(v2):'–'+gem(v2)));
    }).join('; ');
  }).join('; ');
}
function readingInfo(iso,lg){
  var list=lyOn(iso);if(!list.length)return null;var r=list[0],he=rtl(lg);
  return {name:he?nik(r.name&&r.name.he):(r.name&&r.name.en),ref:he?refHe(r.summary):r.summary,all:list};
}
function haftShort(iso,lg){
  var list=lyOn(iso),h=null;list.forEach(function(r){if(!h&&r.haft)h=r.haft;});if(!h)return '';
  var hs=Array.isArray(h)?h:[h],k=hs[0].k;return rtl(lg)?(BOOKS[k]?BOOKS[k][0]:k):k;
}
function fastTimes(S,iso){
  var H=Hc(),di=A.dayInfo(iso,S.shul),out={};if(!H||!di)return out;
  [A.isoAdd(iso,-1),iso].forEach(function(d){try{H.HebrewCalendar.calendar({start:A.civil(d),end:A.civil(d),location:di.loc,il:true,candlelighting:true}).forEach(function(e){var x=e.getDesc();if(x==='Fast begins'&&e.eventTime)out.begin=e.eventTime;if(x==='Fast ends'&&e.eventTime)out.end=e.eventTime;});}catch(e){}});
  return out;
}
function omerText(n,lg){
  if(!n)return '';var w=Math.floor(n/7),d=n%7;
  if(rtl(lg)){var s=(n===1?'יום אחד':n+' יום');if(w)s+=', שהם '+(w===1?'שבוע אחד':w+' שבועות')+(d?(d===1?' ויום אחד':' ו־'+d+' ימים'):'');return s;}
  return 'Day '+n+(w?': '+w+' week'+(w>1?'s':'')+(d?' and '+d+' day'+(d>1?'s':''):''):'');
}
/* Halacha Yomit and today's daf, from Sefaria's daily learning calendar; kept for offline use. */
var HAL_KEY='shul-v3-halacha',HAL_BUSY=false;
function halRead(){try{return JSON.parse(localStorage.getItem(HAL_KEY)||'null');}catch(e){return null;}}
function halToday(){var h=halRead(),iso=A.jp().iso;return h&&h.date===iso?h:null;}
function strip(s){return String(s||'').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim();}
function flat(x){return Array.isArray(x)?x.reduce(function(a,y){return a.concat(flat(y));},[]):[x];}
function halFetch(cb){
  var iso=A.jp().iso,cur=halRead();if(HAL_BUSY||(cur&&cur.date===iso&&cur.text&&cur.text.length)||navigator.onLine===false)return;
  HAL_BUSY=true;var a=iso.split('-');
  fetch('https://www.sefaria.org/api/calendars?timezone=Asia/Jerusalem&diaspora=0&year='+a[0]+'&month='+(+a[1])+'&day='+(+a[2]),{cache:'no-cache'}).then(function(r){return r.json();}).then(function(j){
    var items=(j&&j.calendar_items)||[],pick=function(n){return items.filter(function(x){return x.title&&x.title.en===n;})[0];},hy=pick('Halakhah Yomit'),dy=pick('Daf Yomi');
    var rec={date:iso,daf:dy?{he:dy.displayValue.he,en:dy.displayValue.en}:null,ref:hy?hy.ref:'',url:hy?hy.url:'',he:hy?hy.displayValue.he:'',en:hy?hy.displayValue.en:'',text:[]};
    if(!hy||!/^[\w,.\-:' ]+$/.test(hy.url||''))return rec;
    return fetch('https://www.sefaria.org/api/v3/texts/'+encodeURIComponent(hy.url)+'?version=hebrew&return_format=text_only').then(function(r){return r.json();}).then(function(t){
      var v=(t&&t.versions||[])[0];rec.text=flat(v?v.text:[]).map(strip).filter(Boolean).slice(0,20);return rec;
    }).catch(function(){return rec;});
  }).then(function(rec){if(rec&&(rec.ref||rec.daf)){try{localStorage.setItem(HAL_KEY,JSON.stringify(rec));}catch(e){}if(cb)cb();}}).catch(function(){}).then(function(){HAL_BUSY=false;});
}
function dafToday(lg){var h=halToday();return h&&h.daf?(rtl(lg)?h.daf.he:h.daf.en):'';}
function isDaf(e){return /דף|daf/i.test((e.nameHe||'')+' '+(e.nameEn||''));}

/* ---------- people: yahrzeits, memorial wall, birthdays ---------- */
function relDay(from,iso,lg){
  var n=daysBetween(from,iso),dw=A.isoDow(iso);
  if(n<=0)return T('v3_d_today',null,lg);if(n===1)return T(dw===5?'v3_d_tom_fri':'v3_d_tom',null,lg);if(dw===6)return T('v3_d_shabbat',null,lg);
  return T('v3_d_on',{d:WD[rtl(lg)?'he':'en'][dw]},lg);
}
function hShort(hd,lg){if(!hd)return '';try{if(!rtl(lg))return hd.render('en').replace(/,? \d{4}$/,'');var p=hd.renderGematriya(true).split(' ');return p[0]+' ב'+p.slice(1,-1).join(' ');}catch(e){return '';}}
function origHd(x){var H=Hc();if(!H||!x.hday||!x.hmonth)return null;var mv=String(x.hmonth),m=mv==='12L'?12:+mv,leap=(mv==='12L'||mv==='13');try{return new H.HDate(+x.hday,m,+x.hyear||(leap?5784:5785));}catch(e){return null;}}
function memModel(S,c){
  var H=Hc(),items=A.memorialFor(S,c.P.iso);if(!H||!c.edi)return {featured:[],rest:[]};
  var today=c.edi.hd,hy=today.getFullYear(),tAbs=today.abs(),list=items.map(function(m){
    var o=origHd(m),y=null,isToday=false,month=false,first=false;
    if(o){try{y=H.HebrewCalendar.getYahrzeit(hy,o);}catch(e){}
      if(y){isToday=y.abs()===tAbs;month=y.getMonth()===today.getMonth();}
      if(+m.hyear){try{var a1=H.HebrewCalendar.getYahrzeit(o.getFullYear()+1,o);first=tAbs>=o.abs()&&a1&&tAbs<a1.abs();}catch(e){}}}
    return {m:m,o:o,today:isToday,month:month,first:first};
  });
  var name=function(x){return A.memName(x.m,'he');};
  list.sort(function(a,b){return (b.first-a.first)||(b.month-a.month)||name(a).localeCompare(name(b),'he');});
  return {featured:list.filter(function(x){return x.today;}),rest:list.filter(function(x){return !x.today;})};
}

/* ---------- website ---------- */
function urgent(S,iso,lg){var u=A.urgentText(S,iso,lg);return u?'<div class="urg" role="alert"><b aria-hidden="true">!</b><span>'+E(u)+'</span></div>':'';}
function home(){
  var S=A.state,c=ctx(S),th=themeNow(S,c);D.theme=th;
  if(D.ni>=noticeList(S,c.P.iso,c.P.dow).length)D.ni=0;
  return '<div class="v3" data-theme="'+E(th)+'">'+urgent(S,c.P.iso)+
    '<header class="hd" id="hd">'+hdInner(S,c,th)+'</header>'+
    '<main class="wall" id="wall">'+blkToday(S,c)+blkShabbat(S,c)+blkNotices(S,c)+blkComm(S,c)+blkGive(S)+'</main>'+
    '<p class="rc-note rc-m">'+A.rcNote()+'</p>'+dock(S)+'</div>'+(D.dr?drawer(S,D.dr):'');
}
function emblemFor(th,c,small){
  if(!th)return '';if(th==='chanukah'){var n=candlesTonight(c)||8;return ART.chanukiah(n,T('g_chanukah'));}return ART.emblem(th);
}
function hdInner(S,c,th){
  var lg=A.lang;
  var tools='<div class="hd-tools"><h1 class="hd-name">'+E(A.pick(S.shul,'name'))+'</h1><span class="hd-tr"><a class="hd-board" href="'+E(A.base)+'#manage">'+E(A.role?T('v3_manage'):T('v3_board'))+'</a>'+
    '<span class="seg" role="group" aria-label="Language / שפה"><button type="button" data-act="lang" data-lang="he" aria-pressed="'+(lg==='he')+'" lang="he">עברית</button><button type="button" data-act="lang" data-lang="en" aria-pressed="'+(lg==='en')+'" lang="en">English</button></span></span></div>';
  return '<i class="hd-stars" aria-hidden="true"></i><img class="hd-wall" src="img/wall.webp" width="1024" height="738" alt="'+E(T('v3_wall_alt'))+'">'+tools+'<div class="hd-text" id="hd-text">'+hdText(S,c,th)+'</div>';
}
function hdText(S,c,th){
  var lg=A.lang,nx=A.nextTefillah(S,c.now),wk=A.weekInfo(c.eIso,S.shul),pt=ptLabel(A.parshaText(wk)),hl=holLine(c,lg),chips=chipsFor(c),emb=emblemFor(th,c);
  var nxH=nx?'<p class="nx-k">'+E(T('v3_next'))+'</p><div class="nx-r"><b class="nx-t">'+E(nx.time)+'</b><span class="nx-n"><b>'+E(A.pick(nx.e,'name'))+'</b><small>'+E(nx.tomorrow?T('tomorrow'):inLong(nx.mins))+'</small></span></div>':'<p class="nx-k">'+E(T('none_today'))+'</p>';
  return '<p class="hd-when"><b>'+E(dayLine(c,lg))+'</b><span>'+E(A.gregLong(c.P.iso))+'</span>'+(pt?'<span>'+E(pt)+'</span>':'')+'</p>'+
    (hl.length?'<p class="hd-hol">'+(emb?'<span class="hd-emb" aria-hidden="true">'+emb+'</span>':'')+hl.map(function(h){return '<span>'+E(h)+'</span>';}).join('')+'</p>':'')+
    '<div class="nx" id="v3-next" aria-live="polite">'+nxH+'</div>'+
    (chips.length?'<p class="chips">'+chips.map(function(k){return '<span>'+E(T(k))+'</span>';}).join('')+'</p>':'');
}
function rowList(list,cls){return '<ol class="rows'+(cls?' '+cls:'')+'">'+list.map(function(x){return '<li class="'+(x.cls||'')+'"><span class="nm">'+E(x.name)+(x.sub?'<small>'+E(x.sub)+'</small>':'')+'</span><b class="tm">'+E(x.time||'—')+'</b></li>';}).join('')+'</ol>';}
function todayModel(S,c){
  var now=c.P.hh*60+c.P.mm,iso=c.P.iso,all=A.dayTimes(S,iso,true).filter(function(x){return x.time;}),tomorrow=false;
  var last=all.length?A.minsOf(all[all.length-1].time):0;
  if(c.eve&&now>last+20){iso=A.isoAdd(iso,1);all=A.dayTimes(S,iso,true).filter(function(x){return x.time;});tomorrow=true;}
  var nx=A.nextTefillah(S,c.now),daf=dafToday();
  var map=function(x){var past=!tomorrow&&A.minsOf(x.time)<now,isN=nx&&nx.e===x.e&&nx.time===x.time,tch=x.e.group==='shiur'?A.pick(x.e,'teacher'):'',note=A.pick(x.e,'note');
    var sub=[x.e.group==='shiur'&&isDaf(x.e)&&daf&&!tomorrow?T('v3_daf_today',{d:daf}):'',tch,note].filter(Boolean).join(', ');
    return {name:A.pick(x.e,'name'),time:x.time,sub:sub,cls:(past?'past':'')+(isN?' next':'')};};
  return {iso:iso,tomorrow:tomorrow,tef:all.filter(function(x){return x.e.group!=='shiur';}).map(map),shi:all.filter(function(x){return x.e.group==='shiur';}).map(map)};
}
function blkToday(S,c){
  var m=todayModel(S,c),dw=A.isoDow(m.iso);
  return '<section class="blk b-today" id="b-today" aria-labelledby="h-today"><div class="bh"><h2 id="h-today">'+E(T(m.tomorrow?'v3_tomorrow_t':'v3_today'))+'</h2><span class="bh-s">'+E(WD[rtl()?'he':'en'][dw])+' '+E(A.fmtShort(m.iso))+'</span></div>'+
    (m.tef.length?rowList(m.tef):'<p class="empty">'+E(T('none_today'))+'</p>')+(m.shi.length?'<h3>'+E(T('v3_shiurim'))+'</h3>'+rowList(m.shi):'')+
    '<button type="button" class="lnk end" data-v3="open" data-d="week">'+E(T('v3_full'))+'</button></section>';
}
function blkShabbat(S,c){
  var wk=A.weekInfo(c.eIso,S.shul),pt=A.parshaText(wk),fri=[],sat=[],hf=haftShort(wk.sat),spec=holsOf(A.dayInfo(wk.sat,S.shul)).filter(function(e){return e.getFlags()&Hc().flags.SPECIAL_SHABBAT;}).map(function(e){return e.render(A.locale());});
  if(wk.candles)fri.push({name:T('candles'),time:A.hm(wk.candles),cls:'cdl'});
  A.shabbatList(S,wk).forEach(function(x){(x.dw===5?fri:sat).push({name:A.pick(x.e,'name'),time:x.time,sub:A.pick(x.e,'note')});});
  if(wk.havdalah)sat.push({name:T('havdalah'),time:A.hm(wk.havdalah),cls:'cdl'});
  var sp=A.sponsorsFor(S,c.P.iso),hasK=sp.some(function(s){return s.type==='kiddush';});
  var spH=sp.map(function(s){var by=A.pick(s,'by'),fr=A.pick(s,'for');return '<li><small>'+E(T('sp_'+(s.type||'general')))+'</small><span>'+(by?E(T('sp_by'))+' '+E(by):'')+(fr?(by?', ':'')+E(fr):'')+'</span></li>';}).join('');
  return '<section class="blk b-shab" aria-labelledby="h-shab"><div class="bh"><h2 id="h-shab">'+E(pt?T('v3_shabbat_of',{p:pt}):T('shabbat'))+'</h2><span class="bh-s">'+E(A.fmtShort(wk.fri))+'–'+E(A.fmtShort(wk.sat))+'</span></div>'+
    ((hf||spec.length)?'<p class="sub">'+E([spec.join(', '),hf?T('v3_haft',{h:hf}):''].filter(Boolean).join('. '))+'</p>':'')+
    (fri.length?'<h3>'+E(T('v3_erev'))+'</h3>'+rowList(fri,'tight'):'')+(sat.length?'<h3>'+E(T('v3_shabbat_day'))+'</h3>'+rowList(sat,'tight'):'')+
    (spH?'<ul class="spons">'+spH+'</ul>':'')+(!hasK?'<p class="kcta end"><span>'+E(T('no_sponsor_kiddush'))+'</span> <button type="button" class="lnk" data-v3="open" data-d="give" data-arg="kiddush">'+E(T('v3_kiddush_cta'))+'</button></p>':'')+'</section>';
}
function noticeList(S,iso,dow){return S.notices.filter(function(n){return A.noticeOn(n,iso,dow,'web')&&noticeHas(n);}).sort(function(a,b){var o={timed:0,ongoing:1,standard:2};return ((o[a.kind]||0)-(o[b.kind]||0))||((a.start||'')<(b.start||'')?-1:1);});}
function whenOf(n){return n.kind==='ongoing'&&n.days&&n.days.length?T('every',{d:A.daysLabel(n.days)}):(n.end?T('until',{d:A.fmtShort(n.end)}):'');}
function noticeHtml(n,lazy){
  var ia=A.imgAttr(n.image),title=A.pick(n,'title'),body=A.pick(n,'body'),when=whenOf(n);
  return '<article class="ntc'+(ia?' has-img':'')+'">'+(ia?'<figure><img '+ia+' alt="'+E(title||T('f_image'))+'"'+(lazy?' loading="lazy"':'')+'></figure>':'')+
    ((title||body||when)?'<div class="ntc-b">'+(when?'<span class="tag">'+E(when)+'</span>':'')+(title?'<h3>'+E(title)+'</h3>':'')+(body?'<p>'+E(body)+'</p>':'')+'</div>':'')+'</article>';
}
function blkNotices(S,c){
  var list=noticeList(S,c.P.iso,c.P.dow),n=list.length,i=Math.min(D.ni,Math.max(0,n-1));
  var pager=n>1?'<div class="pager"><button type="button" class="pg" data-v3="np" data-n="-1" aria-label="'+E(T('v3_prev'))+'">'+IC.fwd+'</button><span>'+E(T('v3_of',{a:i+1,b:n}))+'</span><button type="button" class="pg" data-v3="np" data-n="1" aria-label="'+E(T('v3_nextn'))+'">'+IC.back+'</button></div>':'';
  return '<section class="blk b-notices" id="b-notices" aria-labelledby="h-not"><div class="bh"><h2 id="h-not">'+E(T('v3_notices'))+'</h2>'+pager+'</div>'+
    '<div class="ntc-view" id="ntc-view">'+(n?noticeHtml(list[i]):'<p class="empty">'+E(T('no_notices'))+'</p>')+'</div>'+
    (n?'<button type="button" class="lnk end" data-v3="open" data-d="notices">'+E(T('v3_all_notices'))+'</button>':'')+'</section>';
}
function commData(S,c,lg){
  var iso=c.P.iso,tp=function(o,b){return A.pick(o,b,lg);};
  return [
    ['mazal',A.mazalFor(S,iso).map(function(m){return E(tp(m,'text'));})],
    ['simcha',A.simchasFor(S,iso,14).map(function(x){var det=tp(x,'details');return E(tp(x,'title'))+' <small>'+E(A.fmtShort(x.date))+(det?', '+E(det):'')+'</small>';})],
    ['birthday',A.birthdaysFor(S,c.eIso,7).map(function(x){return E(x.b.name)+' <small>'+E(hShort(x.hd,lg))+'</small>';})],
    ['yahrzeit',A.yahrzeitsFor(S,c.eIso).map(function(x){var rel=tp(x.y,'rel');return E(tp(x.y,'name'))+' <small>'+E(hShort(x.hd,lg))+(rel?', '+E(rel):'')+'</small>';})],
    ['refuah',A.refuahFor(S,iso).map(function(r){return E(r.name);})]
  ];
}
function blkComm(S,c){
  return '<section class="blk b-comm" aria-labelledby="h-comm"><div class="bh"><h2 id="h-comm">'+E(T('v3_comm'))+'</h2></div><div class="comm">'+commData(S,c).map(function(g){
    var k=g[0],items=g[1];
    return '<div class="cg'+(items.length?'':' none')+'"><div class="cg-h"><h3>'+E(T('v3_c_'+k))+'</h3><button type="button" class="lnk sm" data-v3="send" data-type="'+k+'">'+E(T('v3_send_'+k))+'</button></div>'+
      (items.length?(k==='refuah'?'<p>'+items.join(', ')+'</p>':'<ul>'+items.map(function(h){return '<li>'+h+'</li>';}).join('')+'</ul>'):'')+'</div>';
  }).join('')+'</div></section>';
}
function blkGive(S){
  var d=S.donate,pb=A.safeUrl(d.payboxLink),bit=A.safeUrl(d.bitLink),go=pb||bit,num=d.payboxPhone||d.bitPhone||'',tz=A.safeUrl(d.tzLink),bank=A.pick(d,'bank');
  var body=(!go&&!num&&!bank&&!tz)?'<p class="empty">'+E(T('no_donate'))+'</p>':
    '<p class="lead">'+E(A.pick(d,'lead')||T('donate_lead'))+'</p>'+(go?'<a class="btn-sun" href="'+E(go)+'" target="_blank" rel="noopener">'+E(T(pb?'pay_paybox':'pay_bit'))+'</a>':'')+
    (num?'<p class="gv-n"><span>'+E(T(d.payboxPhone?'paybox':'bit'))+'</span>'+cp(num)+'</p>':'')+
    (tz?'<a class="tz" href="'+E(tz)+'" target="_blank" rel="noopener"><b>'+E(A.pick(d,'tzTitle')||T('donate'))+'</b>'+(A.pick(d,'tzText')?'<span>'+E(A.pick(d,'tzText'))+'</span>':'')+'<span class="tz-u" dir="ltr">'+E(tz.replace(/^https?:\/\//,''))+'</span></a>':'');
  return '<section class="blk b-give" id="b-give" aria-labelledby="h-give"><div class="bh"><h2 id="h-give">'+E(T('v3_give'))+'</h2></div>'+body+
    '<button type="button" class="lnk end" data-v3="open" data-d="give">'+E(T('v3_more_give'))+'</button></section>';
}
function dock(S){
  var has=A.docsFor(S).length>0,items=[['week','v3_full'],['simchas','v3_simchas_all']].concat(has?[['docs','v3_docs']]:[]).concat([['contact','v3_contact']]);
  return '<nav class="dock" aria-label="'+E(T('v3_full'))+'"><div class="dock-in">'+items.map(function(x){return '<button type="button" data-v3="open" data-d="'+x[0]+'"'+(D.dr===x[0]?' aria-current="true"':'')+'>'+IC[x[0]]+'<span>'+E(T(x[1]))+'</span></button>';}).join('')+
    '<button type="button" class="dock-give" data-v3="go" data-to="b-give">'+IC.give+'<span>'+E(T('v3_give'))+'</span></button></div>'+
    '<div class="dock-x"><button type="button" class="lnk" data-v3="open" data-d="contact">'+E(A.pick(S.shul,'address'))+'</button><span class="rc-note">'+A.rcNote()+'</span></div></nav>';
}

/* ---------- drawers: one level deep ---------- */
var DR={week:['v3_full',dWeek],simchas:['v3_simchas_all',dSimchas],docs:['v3_docs',dDocs],contact:['v3_contact',dContact],notices:['v3_notices',dNotices],give:['donate',dGive],send:['v3_send_title',dSend]};
function drawer(S,k){
  var d=DR[k];if(!d)return '';
  return '<div class="dr-scrim" data-v3="close"></div><aside class="dr" id="dr" role="dialog" aria-modal="true" aria-labelledby="dr-t" tabindex="-1"><header class="dr-h"><h2 id="dr-t">'+E(T(d[0]))+'</h2><button type="button" class="dr-x" data-v3="close" aria-label="'+E(T('v3_close'))+'">'+IC.x+'</button></header><div class="dr-b" id="dr-b">'+d[1](S)+'</div></aside>';
}
function sched(list,dayFn){return '<ol class="rows">'+list.map(function(x){var rule=A.ruleText(x.e),note=A.pick(x.e,'note'),tch=A.pick(x.e,'teacher');var sub=[dayFn(x),rule,tch,note].filter(Boolean).join(', ');return '<li><span class="nm">'+E(A.pick(x.e,'name'))+(sub?'<small>'+E(sub)+'</small>':'')+'</span><b class="tm">'+E(x.time||'—')+'</b></li>';}).join('')+'</ol>';}
function dWeek(S){
  var P=A.jp(),wk=A.weekInfo(P.iso,S.shul),wd=A.weekdayList(S,P),sh=A.shabbatList(S,wk),si=A.shiurList(S);
  return '<h3>'+E(T('weekday'))+'</h3>'+(wd.length?sched(wd,function(x){return A.daysLabel(x.e.days);}):'<p class="empty">—</p>')+
    '<h3>'+E(T('shabbat'))+' '+E(A.parshaText(wk))+'</h3>'+(wk.candles?'<ol class="rows"><li class="cdl"><span class="nm">'+E(T('candles'))+'<small>'+E(T('erev_shabbat'))+' '+E(A.fmtShort(wk.fri))+'</small></span><b class="tm">'+A.hm(wk.candles)+'</b></li></ol>':'')+
    (sh.length?sched(sh,function(x){return T(x.dw===5?'erev_shabbat':'shabbat_day');}):'')+(wk.havdalah?'<ol class="rows"><li class="cdl"><span class="nm">'+E(T('havdalah'))+'</span><b class="tm">'+A.hm(wk.havdalah)+'</b></li></ol>':'')+
    '<h3>'+E(T('shiurim'))+'</h3>'+(si.length?sched(si,function(x){return A.daysLabel(x.e.days);}):'<p class="empty">'+E(T('no_shiurim'))+'</p>')+'<p class="fine">'+E(T('times_note'))+'</p>';
}
function dSimchas(S){
  var iso=A.jp().iso,list=A.simchasFor(S,iso),loc=A.lang==='he'?'he-IL':'en-GB',mf=new Intl.DateTimeFormat(loc,{month:'short',timeZone:'UTC'}),wf=new Intl.DateTimeFormat(loc,{weekday:'long',timeZone:'UTC'});
  var utc=function(i){var a=i.split('-').map(Number);return new Date(Date.UTC(a[0],a[1]-1,a[2],12));},mz=A.mazalFor(S,iso);
  return (list.length?'<ol class="cal">'+list.map(function(x){var di=A.dayInfo(x.date,S.shul),det=A.pick(x,'details');return '<li><time datetime="'+E(x.date)+'"><b>'+(+x.date.slice(8,10))+'</b><span>'+E(mf.format(utc(x.date)))+'</span></time><div><b>'+E(A.pick(x,'title'))+'</b><small>'+E(wf.format(utc(x.date)))+(di?', '+E(hebLong(di.hd)):'')+'</small>'+(det?'<span>'+E(det)+'</span>':'')+'</div></li>';}).join('')+'</ol>':'<p class="empty">'+E(T('no_simchas'))+'</p>')+
    '<p><button type="button" class="lnk" data-v3="send" data-type="simcha">'+E(T('v3_send_simcha'))+'</button></p>'+
    (mz.length?'<h3>'+E(T('v3_c_mazal'))+'</h3><ul class="plain">'+mz.map(function(m){return '<li>'+E(A.pick(m,'text'))+'</li>';}).join('')+'</ul>':'');
}
function dDocs(S){
  var list=A.docsFor(S);if(!list.length)return '<p class="empty">—</p>';
  return '<p class="fine top">'+E(T('docs_lead'))+'</p>'+list.map(function(d){
    var has={he:!!String(d.bodyHe||'').trim(),en:!!String(d.bodyEn||'').trim()},cur=A.ui.docLang[d.id]||(has[A.lang]?A.lang:(has.he?'he':'en')),link=A.docLink(d.link);
    var tabs=(has.he&&has.en)?'<span class="seg sm" role="group" aria-label="'+E(T('doc_lang'))+'"><button type="button" data-act="doclang" data-id="'+E(d.id)+'" data-lang="he" aria-pressed="'+(cur==='he')+'">עברית</button><button type="button" data-act="doclang" data-id="'+E(d.id)+'" data-lang="en" aria-pressed="'+(cur==='en')+'">English</button></span>':'';
    return '<details class="doc" id="doc-'+E(d.id)+'"'+(A.ui.docOpen[d.id]?' open':'')+'><summary><b>'+E(A.pick(d,'title'))+'</b>'+(d.date?'<span>'+E(A.fmtDate(d.date))+'</span>':'')+'</summary><div class="doc-b"><div class="doc-tools">'+tabs+(link?'<a class="lnk" href="'+E(link)+'" target="_blank" rel="noopener">'+E(T('doc_original'))+'</a>':'')+'</div>'+
      (has.he?'<article class="doc-text" lang="he" dir="rtl" data-doclang="he"'+(cur!=='he'?' hidden':'')+'>'+A.docHtml(d.bodyHe)+'</article>':'')+(has.en?'<article class="doc-text" lang="en" dir="ltr" data-doclang="en"'+(cur!=='en'?' hidden':'')+'>'+A.docHtml(d.bodyEn)+'</article>':'')+'</div></details>';
  }).join('');
}
function dContact(S){
  var s=S.shul,addr=A.pick(s,'address'),q=encodeURIComponent(s.addressHe||addr||''),wa=A.safeUrl(s.whatsapp);
  var people=[['rabbi',A.pick(s,'rabbi')],['gabbai',A.pick(s,'gabbai')],['nusach',A.pick(s,'nusach')]].filter(function(p){return p[1];});
  return '<p class="addr">'+E(addr)+'</p>'+(A.pick(s,'directions')?'<p class="fine top">'+E(A.pick(s,'directions'))+'</p>':'')+
    '<div class="btns"><a class="btn-ink" target="_blank" rel="noopener" href="https://waze.com/ul?ll='+(+s.lat)+','+(+s.lng)+'&amp;navigate=yes">'+E(T('waze'))+'</a><a class="btn-line" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&amp;query='+q+'">'+E(T('gmaps'))+'</a></div>'+
    (A.pick(s,'about')?'<h3>'+E(T('about'))+'</h3><p class="pre">'+E(A.pick(s,'about'))+'</p>':'')+
    ((people.length||s.phone||s.email||wa)?'<ul class="kv">'+people.map(function(p){return '<li><small>'+E(T(p[0]))+'</small><span>'+E(p[1])+'</span></li>';}).join('')+(s.phone?'<li><small>'+E(T('phone'))+'</small>'+cp(s.phone)+'</li>':'')+(s.email?'<li><small>'+E(T('email'))+'</small>'+cp(s.email)+'</li>':'')+(wa?'<li><a class="btn-line" href="'+E(wa)+'" target="_blank" rel="noopener">'+E(T('whatsapp'))+'</a></li>':'')+'</ul>':'')+
    '<div class="dr-links"><a class="lnk" href="'+E(A.base)+'#manage">'+E(A.role?T('v3_manage'):T('v3_board'))+'</a><span class="fine">'+E(T('v3_old'))+': <a class="lnk" href="'+E(A.base)+'">'+E(T('v3_v1'))+'</a>, <a class="lnk" href="'+E(A.base)+'v2/">'+E(T('v3_v2'))+'</a></span></div>';
}
function dNotices(S){var P=A.jp(),list=noticeList(S,P.iso,P.dow);return list.length?'<div class="ntc-list">'+list.map(function(n){return noticeHtml(n,true);}).join('')+'</div>':'<p class="empty">'+E(T('no_notices'))+'</p>';}
function dGive(S){
  var d=S.donate,blocks='',add=function(label,link,num,btn){var q=link?A.qrSvg(link):'';blocks+='<div class="gblk">'+(q?'<div class="qr" aria-hidden="true">'+q+'</div>':'')+'<div><h3>'+E(label)+'</h3>'+(num?cp(num):'')+(link?'<a class="btn-sun" href="'+E(link)+'" target="_blank" rel="noopener">'+E(btn)+'</a>':'')+'</div></div>';};
  var pb=A.safeUrl(d.payboxLink),bit=A.safeUrl(d.bitLink),ot=A.safeUrl(d.otherLink),bank=A.pick(d,'bank'),tz=A.safeUrl(d.tzLink),gab=A.pick(S.shul,'gabbai');
  if(pb||d.payboxPhone)add(T('paybox'),pb,d.payboxPhone,T('pay_paybox'));
  if(bit||d.bitPhone)add(T('bit'),bit,d.bitPhone,T('pay_bit'));
  if(ot)add(A.pick(d,'otherLabel')||T('donate'),ot,'',A.pick(d,'otherLabel')||T('donate'));
  if(bank)blocks+='<div class="gblk bank"><div><h3>'+E(T('bank'))+'</h3><p class="pre">'+E(bank)+'</p></div></div>';
  if(tz)blocks+='<div class="gblk small"><div class="qr" aria-hidden="true">'+A.qrSvg(tz)+'</div><div><h3>'+E(A.pick(d,'tzTitle')||T('donate'))+'</h3>'+(A.pick(d,'tzText')?'<p>'+E(A.pick(d,'tzText'))+'</p>':'')+'<a class="lnk" href="'+E(tz)+'" target="_blank" rel="noopener" dir="ltr">'+E(tz.replace(/^https?:\/\//,''))+'</a></div></div>';
  var how='<p class="note">'+E(T('v3_kiddush_how',{g:gab?(rtl()?' ':' ')+'('+gab+')':''}))+(S.shul.phone?' '+cp(S.shul.phone):'')+'</p>';
  return (D.drArg==='kiddush'?how:'')+'<p class="fine top pre">'+E(A.pick(d,'lead')||T('donate_lead'))+'</p>'+(blocks||'<p class="empty">'+E(T('no_donate'))+'</p>')+(A.pick(d,'note')?'<p class="fine">'+E(A.pick(d,'note'))+'</p>':'')+(D.drArg==='kiddush'?'':how);
}
/* the "send one in" form */
var SEND_TYPES=['mazal','simcha','birthday','yahrzeit','refuah'];
function hmonthOpts(sel){return '<option value="">—</option>'+A.HMONTHS.map(function(m){return '<option value="'+m[0]+'"'+(String(sel)===m[0]?' selected':'')+'>'+E(rtl()?m[1]:m[2])+'</option>';}).join('');}
function dayOpts(sel){var o='<option value="">—</option>';for(var i=1;i<=30;i++)o+='<option value="'+i+'"'+(String(sel)===String(i)?' selected':'')+'>'+(rtl()?gem(i):i)+'</option>';return o;}
function fld(id,label,input,req){return '<label class="f" for="'+id+'"><span>'+E(label)+(req?' <em aria-hidden="true">*</em>':'')+'</span>'+input+'</label>';}
function inp(id,type,val,ph,extra){return '<input id="'+id+'" name="'+id+'" type="'+type+'" value="'+E(val||'')+'"'+(ph?' placeholder="'+E(ph)+'"':'')+(extra||'')+'>';}
function hdateFields(kind,v){
  return '<fieldset class="hdate"><legend>'+E(T('f3_hdate_'+kind))+' <em aria-hidden="true">*</em></legend><div class="row3">'+
    '<label class="f" for="s-hday"><span>'+E(T('f3_hday'))+'</span><select id="s-hday" name="s-hday" required>'+dayOpts(v.hday)+'</select></label>'+
    '<label class="f" for="s-hmonth"><span>'+E(T('f3_hmonth'))+'</span><select id="s-hmonth" name="s-hmonth" required>'+hmonthOpts(v.hmonth)+'</select></label>'+
    (kind==='yahrzeit'?'<label class="f" for="s-hyear"><span>'+E(T('f3_hyear'))+'</span>'+inp('s-hyear','text',v.hyear,T('f3_hyear_ph'),' maxlength="6" inputmode="text"')+'</label>':'')+'</div>'+
    '<details class="greg"'+(D.send.greg?' open':'')+'><summary>'+E(T('f3_greg_q'))+'</summary><div class="row2"><label class="f" for="s-greg"><span>'+E(T('f3_greg'))+'</span>'+inp('s-greg','date',v.greg,'',' max="'+A.jp().iso+'"')+'</label><label class="chk"><input type="checkbox" id="s-after"'+(v.after?' checked':'')+'> '+E(T('f3_after'))+'</label></div><p class="fine" id="s-greg-res" aria-live="polite"></p></details></fieldset>';
}
function dSend(){
  var s=D.send,ty=s.type,v=s.v,today=A.jp().iso;
  if(s.done)return '<div class="sent"><div class="ok" aria-hidden="true">✓</div><h3>'+E(T('f3_done_t'))+'</h3><p>'+E(T('f3_done'))+'</p><button type="button" class="btn-line" data-v3="send-again">'+E(T('f3_another'))+'</button></div>';
  var f='';
  if(ty==='mazal')f=fld('s-text',T('f3_text'),'<textarea id="s-text" name="s-text" rows="4" maxlength="600" required placeholder="'+E(T('f3_text_ph'))+'">'+E(v.text||'')+'</textarea>',1)+
    '<div class="row2">'+fld('s-start',T('f3_from'),inp('s-start','date',v.start||today,'',' min="'+today+'"'))+fld('s-end',T('f3_until'),inp('s-end','date',v.end||A.isoAdd(today,14),'',' min="'+today+'"'))+'</div>';
  else if(ty==='simcha')f=fld('s-title',T('f3_title'),inp('s-title','text',v.title,T('f3_title_ph'),' maxlength="160" required'),1)+fld('s-date',T('f3_date'),inp('s-date','date',v.date,'',' min="'+today+'" required'),1)+fld('s-details',T('f3_details'),inp('s-details','text',v.details,'',' maxlength="200"'));
  else if(ty==='yahrzeit')f=fld('s-who',T('f3_who_yahrzeit'),inp('s-who','text',v.who,T('f3_who_yahrzeit_ph'),' maxlength="120" required'),1)+hdateFields('yahrzeit',v)+fld('s-rel',T('f3_rel'),inp('s-rel','text',v.rel,T('f3_rel_ph'),' maxlength="80"'));
  else if(ty==='refuah')f=fld('s-who',T('f3_who_refuah'),inp('s-who','text',v.who,T('f3_who_refuah_ph'),' maxlength="120" required'),1)+fld('s-until',T('f3_until_opt'),inp('s-until','date',v.until,'',' min="'+today+'"'));
  else if(ty==='birthday')f=fld('s-who',T('f3_who_birthday'),inp('s-who','text',v.who,T('f3_who_birthday_ph'),' maxlength="120" required'),1)+hdateFields('birthday',v);
  return '<form class="send" id="send" novalidate><fieldset class="types"><legend>'+E(T('v3_what'))+'</legend><div class="tchips">'+SEND_TYPES.map(function(k){return '<button type="button" data-v3="stype" data-type="'+k+'" aria-pressed="'+(k===ty)+'">'+E(T('typ_'+k))+'</button>';}).join('')+'</div></fieldset>'+f+
    '<div class="row2">'+fld('s-name',T('f3_name'),inp('s-name','text',v.name,'',' maxlength="80" autocomplete="name" required'),1)+fld('s-phone',T('f3_phone'),inp('s-phone','tel',v.phone,'',' maxlength="30" autocomplete="tel" dir="ltr" required'),1)+'</div>'+
    '<label class="hp" aria-hidden="true">Website <input id="s-web" name="website" tabindex="-1" autocomplete="off"></label>'+
    '<p class="note">'+E(T('f3_privacy'))+'</p><p class="fine rc">'+A.rcNote()+'</p>'+(s.err?'<p class="err" role="alert">'+E(T(s.err))+'</p>':'')+
    '<button type="submit" class="btn-sun wide"'+(s.busy?' disabled':'')+'>'+E(T(s.busy?'f3_sending':'f3_submit'))+'</button></form>';
}
function sendVals(){var f=document.getElementById('send');if(!f)return;var v=D.send.v;[].forEach.call(f.querySelectorAll('input,textarea,select'),function(el){if(!el.id||el.id==='s-web')return;var k=el.id.slice(2);v[k]=el.type==='checkbox'?el.checked:el.value;});}
function hyearNum(s){s=String(s||'').trim();if(!s)return '';var n;if(/^\d+$/.test(s))n=+s;else{try{n=Hc().gematriyaStrToNum(s.replace(/[״"׳']/g,''));}catch(e){n=0;}}if(n&&n<1000)n+=5000;return n>=5000&&n<6000?String(n):'';}
function gregToH(){
  var g=document.getElementById('s-greg'),af=document.getElementById('s-after'),out=document.getElementById('s-greg-res'),H=Hc();if(!g||!g.value||!H)return;
  try{var hd=new H.HDate(A.civil(g.value));if(af&&af.checked)hd=hd.next();var m=hd.getMonth(),leap=H.HDate.isLeapYear(hd.getFullYear()),mv=m===12?(leap?'12L':'12'):String(m);
    var sd=document.getElementById('s-hday'),sm=document.getElementById('s-hmonth'),sy=document.getElementById('s-hyear');if(sd)sd.value=String(hd.getDate());if(sm)sm.value=mv;if(sy)sy.value=String(hd.getFullYear());
    if(out)out.textContent=T('f3_greg_res',{d:hebLong(hd)});sendVals();}catch(e){}
}
var SENT_KEY='shul-v3-sent';
function doSend(){
  var s=D.send;sendVals();var v=s.v,ty=s.type,web=document.getElementById('s-web');s.err='';
  var need={mazal:['text'],simcha:['title','date'],yahrzeit:['who','hday','hmonth'],refuah:['who'],birthday:['who','hday','hmonth']}[ty].concat(['name','phone']);
  var miss=need.filter(function(k){return !String(v[k]||'').trim();});
  [].forEach.call(document.querySelectorAll('#send [aria-invalid]'),function(el){el.removeAttribute('aria-invalid');});
  miss.forEach(function(k){var el=document.getElementById('s-'+k);if(el)el.setAttribute('aria-invalid','true');});
  s.miss=miss;if(miss.length){s.err='f3_req';return refreshSend(miss[0]);}
  if(!/^[0-9+() -]{9,30}$/.test(String(v.phone).trim())||String(v.phone).replace(/\D/g,'').length<9){s.err='f3_phone_bad';s.miss=['phone'];return refreshSend('phone');}
  var last=0;try{last=+localStorage.getItem(SENT_KEY)||0;}catch(e){}
  if(Date.now()-last<60000){s.err='f3_wait';return refreshSend();}
  if(web&&web.value){s.done=true;return refreshSend();}
  if(navigator.onLine===false){s.err='f3_offline';return refreshSend();}
  var cut=function(x,n){return String(x||'').trim().slice(0,n);},data={};
  if(ty==='mazal'){data.text=cut(v.text,600);data.start=cut(v.start,10);data.end=cut(v.end,10);}
  else if(ty==='simcha'){data.title=cut(v.title,160);data.date=cut(v.date,10);data.details=cut(v.details,200);}
  else if(ty==='refuah'){data.who=cut(v.who,120);data.until=cut(v.until,10);}
  else{data.who=cut(v.who,120);data.hday=cut(v.hday,2);data.hmonth=cut(v.hmonth,3);if(ty==='yahrzeit'){data.hyear=hyearNum(v.hyear);data.rel=cut(v.rel,80);}}
  Object.keys(data).forEach(function(k){if(data[k]==='')delete data[k];});
  if(!A.canSubmit){s.err='f3_fail';return refreshSend();}
  s.busy=true;refreshSend();
  A.submit(ty,data,cut(v.name,80),cut(v.phone,30)).then(function(){try{localStorage.setItem(SENT_KEY,String(Date.now()));}catch(e){}s.busy=false;s.done=true;s.v={};refreshSend();},function(){s.busy=false;s.err='f3_fail';refreshSend();});
}
function refreshSend(focusK){var b=document.getElementById('dr-b');if(!b||D.dr!=='send')return;b.innerHTML=dSend();if(D.send.err)(D.send.miss||[]).forEach(function(k){var x=document.getElementById('s-'+k);if(x)x.setAttribute('aria-invalid','true');});else D.send.miss=[];var el=focusK?document.getElementById('s-'+focusK):b.querySelector('.err,.sent h3');if(el){if(!el.hasAttribute('tabindex')&&!/INPUT|SELECT|TEXTAREA/.test(el.tagName))el.setAttribute('tabindex','-1');try{el.focus();}catch(e){}}}
function openDr(k,arg){if(!DR[k])return false;D.dr=k;D.drArg=arg||'';D.focusDr=true;A.render();return true;}
function closeDr(){if(!D.dr)return;var k=D.dr;sendVals();D.dr='';A.render();var b=document.querySelector('[data-v3="open"][data-d="'+k+'"]');if(b)try{b.focus({preventScroll:true});}catch(e){}}

/* ---------- TV board (drawn at 1920 x 1080 and scaled to the screen) ---------- */
function TLs(S,k,v){var m=S.display.lang;if(m==='both')return E(T(k,v,'he'))+'<span class="en">'+E(T(k,v,'en'))+'</span>';return E(T(k,v,m==='en'?'en':'he'));}
function TPs(S,o,b){var m=S.display.lang;if(m==='both'){var h=A.pick(o,b,'he'),e=o[b+'En'];return E(h)+(e&&e!==h?'<span class="en">'+E(e)+'</span>':'');}return E(A.pick(o,b,m==='en'?'en':'he'));}
function tvLg(S){return S.display.lang==='en'?'en':'he';}
function display(){
  clearTimeout(D.slideT);clearInterval(D.scT);
  var S=A.screenState(),lg=tvLg(S);
  if(!A.clockOk())return '<div class="tv3 bad"><div class="tv3-c" id="tv3-c"><div class="bad-in"><h1>'+TLs(S,'clock_bad')+'</h1><p>'+TLs(S,'clock_bad2')+'</p></div></div></div>';
  var c=ctx(S),still=!!A.ui.stillFlag,th=themeNow(S,c),ts=A.TSCALE[S.display.textSize]||1;D.theme=th;
  var ug=urgentTv(S,c.P.iso);
  return '<div class="tv3'+(still?' still':'')+'" id="tv3" data-theme="'+E(th)+'"><div class="tv3-c'+(ug?' has-urg':'')+'" id="tv3-c" style="--ts:'+ts+'">'+ug+
    '<header class="th" id="th">'+tHead(S,c,th)+'</header><section class="ta" id="ta">'+tColA(S,c,still)+'</section>'+
    '<main class="ts" id="ts" aria-live="polite"></main><aside class="tc" id="tc">'+tColC(S,c)+'</aside><footer class="tf" id="tf">'+tFoot(S)+'</footer></div></div>'+
    '<button class="tv-fs" data-act="fs">'+E(T('fullscreen',null,lg))+'</button>';
}
function urgentTv(S,iso){var m=S.display.lang,u=A.urgentText(S,iso,m==='en'?'en':'he');if(!u)return '';if(m==='both'&&S.urgent.textEn&&S.urgent.textEn!==u)u+='  /  '+S.urgent.textEn;return '<div class="t-urg" role="alert">'+E(u)+'</div>';}
/* Where the sun (or moon) sits on the thin line under the header: morning on the right in Hebrew. */
function sunPos(c){
  var z=c.di&&c.di.zm;if(!z||!z.netz||!z.shkia)return null;var t=c.now.getTime(),n=z.netz.getTime(),s=z.shkia.getTime(),f,day=false;
  var mid=new Date(c.now);mid.setHours(0,0,0,0);var m0=mid.getTime(),m1=m0+864e5;
  if(t<n)f=.17*(t-m0)/Math.max(1,n-m0);else if(t<=s){f=.17+.53*(t-n)/Math.max(1,s-n);day=true;}else f=.70+.30*(t-s)/Math.max(1,m1-s);
  return {f:Math.max(0,Math.min(1,f)),day:day};
}
function tHead(S,c,th){
  var lg=tvLg(S),wk=A.weekInfo(c.eIso,S.shul),pt=ptLabel(A.parshaText(wk,lg),lg),hl=holLine(c,lg),sp=sunPos(c),emb=emblemFor(th,c),r=rtl(lg);
  var mark=sp?'<i class="'+(sp.day?'sun':'moon')+'" style="'+(r?'right':'left')+':'+(sp.f*100).toFixed(1)+'%"></i>':'';
  return '<div class="th-a"><b>'+TPs(S,S.shul,'name')+'</b><span>'+TLs(S,'v3_kind')+'</span></div>'+
    '<div class="th-b"><b>'+E(dayLine(c,lg))+'</b><span>'+E(A.gregLong(c.P.iso,lg))+'</span></div>'+
    '<div class="th-c">'+(emb?'<span class="th-emb" aria-hidden="true">'+emb+'</span>':'')+'<span class="th-cc"><b>'+E(pt)+'</b>'+(hl.length?'<span>'+E(hl.slice(0,2).join(', '))+'</span>':'')+'</span></div>'+
    '<div class="th-line" aria-hidden="true">'+mark+'</div>';
}
function tColA(S,c,still){
  var lg=tvLg(S),now=c.P.hh*60+c.P.mm,nx=still?null:A.nextTefillah(S,c.now),list=A.dayTimes(S,c.P.iso,false),shi=A.dayTimes(S,c.P.iso,true).filter(function(x){return x.e.group==='shiur';}),daf=dafToday(lg);
  var row=function(x){var past=!still&&A.minsOf(x.time)<now,isN=nx&&nx.e===x.e&&nx.time===x.time,tch=x.e.group==='shiur'?TPs(S,x.e,'teacher'):'',dd=x.e.group==='shiur'&&isDaf(x.e)&&daf?E(T('v3_daf_today',{d:daf},lg)):'';
    var sub=[dd,tch].filter(Boolean).join(', ');return '<li class="'+(past?'past ':'')+(isN?'next':'')+'"><span>'+TPs(S,x.e,'name')+(sub?'<small>'+sub+'</small>':'')+'</span><b>'+E(x.time||'—')+'</b></li>';};
  var chips=chipsFor(c);
  return '<div class="ta-in" id="ta-in">'+(still?'':'<div class="clock" id="t3-clock">'+pad(c.P.hh)+':'+pad(c.P.mm)+'</div>')+
    (nx?'<div class="nxc"><small>'+TLs(S,'v3_next')+'</small><div class="nxc-r"><span>'+TPs(S,nx.e,'name')+'</span><b>'+E(nx.time)+'</b></div><em>'+E(nx.tomorrow?T('tomorrow',null,lg):inLong(nx.mins,lg))+'</em></div>':'')+
    (list.length?'<h3>'+TLs(S,'today')+'</h3><ol class="tr">'+list.map(row).join('')+'</ol>':'')+
    (shi.length?'<h3>'+TLs(S,'shiurim')+'</h3><ol class="tr">'+shi.map(row).join('')+'</ol>':'')+
    (chips.length?'<p class="tchips">'+chips.map(function(k){return '<span'+(/hallel_bracha|notach|nissim|hallel2/.test(k)?' class="hi"':'')+'>'+E(T(k,null,lg))+'</span>';}).join('')+'</p>':'')+'</div>';
}
function tColC(S,c){
  var lg=S.display.lang==='both'?'he':tvLg(S),d=S.donate,go=A.safeUrl(d.payboxLink)||A.safeUrl(d.bitLink),num=d.payboxPhone||d.bitPhone||'',tz=A.safeUrl(d.tzLink),give='';
  if(S.display.showDonate&&(go||num||tz)){
    give='<div class="tgive"><div class="tg-a">'+(go?'<div class="qr">'+A.qrSvg(go)+'</div>':'')+'<div><b>'+TLs(S,'v3_give')+'</b>'+(go?'<small>'+TLs(S,'v3_give_scan')+'</small>':'')+(num?'<bdi dir="ltr" class="num">'+E(num)+'</bdi>':'')+'</div></div>'+
      (tz?'<div class="tg-b"><div class="qr">'+A.qrSvg(tz)+'</div><div><b>'+TPs(S,d,'tzTitle')+'</b>'+(A.pick(d,'tzText',lg)?'<small>'+TPs(S,d,'tzText')+'</small>':'')+'</div></div>':'')+'</div>';
  }
  var groups=commData(S,c,lg).filter(function(g){return g[0]!=='yahrzeit'&&g[1].length;});
  var comm='<div class="tcomm"><h2>'+TLs(S,'v3_comm')+'</h2><div class="tscv" id="tscv"><div>'+(groups.length?groups.map(function(g){return '<div class="tcg"><h3>'+TLs(S,'v3_c_'+g[0])+'</h3>'+(g[0]==='refuah'?'<p>'+g[1].join(', ')+'</p>':g[1].map(function(h){return '<p>'+h+'</p>';}).join(''))+'</div>';}).join(''):'<p class="muted">'+TLs(S,'v3_c_none')+'</p>')+'</div></div></div>';
  return comm+give;
}
function tFoot(S){
  var lg=tvLg(S),wk=A.weekInfo(A.jp().iso,S.shul),url=A.siteUrl(S),q='';
  if(S.display.showQr&&url){q=A.qrSvg(url.replace(/\/?$/,'/')+(/\/v3\/$/.test(url)?'':'v3/'));}
  return '<div class="tf-a">'+(q?'<div class="qr">'+q+'</div><span>'+TLs(S,'scan_site')+'</span>':'<span>'+E(A.pick(S.shul,'address',lg))+'</span>')+'<span class="t-net" id="tv-net"'+(navigator.onLine===false?'':' hidden')+'>'+TLs(S,'offline_tv')+'</span></div>'+
    '<div class="tf-b">'+(wk.candles?'<span>'+TLs(S,'candles')+' '+E(A.DOW[lg==='he'?'he':'en'][5])+' '+E(A.fmtShort(wk.fri))+' <b>'+A.hm(wk.candles)+'</b></span>':'')+(wk.havdalah?'<span>'+TLs(S,'havdalah')+' <b>'+A.hm(wk.havdalah)+'</b></span>':'')+'</div>';
}
/* ---- centre slides ---- */
function top(S,title,sub,pg){return '<div class="s-top"><div><h2>'+title+'</h2>'+(sub?'<p class="sub">'+sub+'</p>':'')+'</div>'+(pg?'<span class="pgn">'+pg+'</span>':'')+'</div>';}
function pageOf(S,i,n){return n>1?TLs(S,'v3_of',{a:i+1,b:n}):'';}
function tSlides(S,c){
  var P=c.P,iso=P.iso,lg=tvLg(S),out=[],secs=Math.max(5,+S.display.slideSecs||12),dsp=S.display;
  if(dsp.slHol!==false)holidaySlides(S,c).forEach(function(x){out.push(x);});
  var notices=S.notices.filter(function(n){return A.noticeOn(n,iso,P.dow,'screen')&&noticeHas(n);}),txt=notices.filter(function(n){return !n.image;});
  notices.forEach(function(n,i){
    var ia=A.imgAttr(n.image),title=TPs(S,n,'title'),body=TPs(S,n,'body'),s=Math.max(5,+n.secs||secs);
    if(ia&&!title&&!body)out.push({cls:'img',html:'<img '+ia+' alt="">',secs:s,img:n.image});
    else if(ia)out.push({cls:'split',html:'<img '+ia+' alt=""><div class="fc">'+(title?'<h2>'+title+'</h2>':'')+(body?'<div class="body">'+body+'</div>':'')+'</div>',secs:s,img:n.image});
    else{var k=txt.indexOf(n),nxt=txt.slice(k+1,k+3);
      out.push({cls:'txt',html:'<div class="fc s-ntc"><div class="s-top"><p class="kick">'+TLs(S,'v3_notices')+'</p><span class="pgn">'+pageOf(S,k,txt.length)+'</span></div>'+(title?'<h2>'+title+'</h2>':'')+(body?'<div class="body">'+body+'</div>':'')+
        (nxt.length?'<div class="s-next"><p class="kick">'+TLs(S,'v3_next_up')+'</p><div>'+nxt.map(function(x){var tt=TPs(S,x,'title');if(!tt){var bd=A.pick(x,'body',lg);tt=E(bd.length>60?bd.slice(0,58)+'…':bd);}return '<span>'+tt+'</span>';}).join('')+'</div></div>':'')+'</div>',secs:s});}
  });
  if(dsp.slYz!==false){var yz=A.yahrzeitsFor(S,c.eIso),per=6,pages=Math.ceil(yz.length/per);
    for(var p=0;p<pages;p++)out.push({cls:'yz',secs:secs,html:'<div class="fc s-yz">'+top(S,TLs(S,'v3_yz_title'),TLs(S,'v3_nishmat'),pageOf(S,p,pages))+'<div class="yz-g">'+yz.slice(p*per,p*per+per).map(function(x){
      var n=daysBetween(c.eIso,x.iso),rel=TPs(S,x.y,'rel'),yr=+x.y.hyear?(lg==='he'?' '+gem(+x.y.hyear%1000):' '+x.y.hyear):'';
      return '<div class="yzc'+(n<=0?' today':'')+'"><div class="yzc-h"><span class="tag">'+E(relDay(c.eIso,x.iso,lg))+'</span>'+IC.candle+'</div><b>'+TPs(S,x.y,'name')+'</b>'+(rel?'<span class="rel">'+rel+'</span>':'')+'<span class="yzd">'+E(hShort(x.hd,lg)+yr)+'</span></div>';}).join('')+'</div></div>'});}
  if(dsp.slMem!==false){var mm=memModel(S,c),per2=12,pages2=Math.max(mm.rest.length?Math.ceil(mm.rest.length/per2):0,mm.featured.length?1:0);
    for(var q=0;q<pages2;q++)out.push({cls:'mem',secs:Math.max(secs,15),html:'<div class="fc s-mem">'+top(S,TLs(S,'v3_mem_title'),TLs(S,'v3_nishmat'),pageOf(S,q,pages2))+
      (q===0&&mm.featured.length?mm.featured.slice(0,2).map(function(x){var by=A.pick(x.m,'by',lg),line=A.pick(x.m,'line',lg);return '<div class="mem-f">'+IC.candle+'<div><small>'+TLs(S,'v3_mem_today')+'</small><b>'+E(A.memName(x.m,lg))+'</b><span>'+E(x.o?hShort(x.o,lg)+(+x.m.hyear?' '+(lg==='he'?gem(+x.m.hyear%1000):x.m.hyear):''):'')+(line?', '+E(line):'')+'</span></div>'+(by?'<em>'+E(T('v3_mem_by',{b:by},lg))+'</em>':'')+'</div>';}).join(''):'')+
      '<div class="mem-g">'+mm.rest.slice(q*per2,q*per2+per2).map(function(x){return '<div class="plate'+(x.first?' first':'')+'"><b>'+E(A.memName(x.m,lg))+'</b><span><span>'+E(x.o?hShort(x.o,lg)+(+x.m.hyear?' '+(lg==='he'?gem(+x.m.hyear%1000):x.m.hyear):''):'')+'</span>'+(x.first?'<i class="t1">'+E(T('v3_mem_first',null,lg))+'</i>':(x.month?'<i class="t2">'+E(T('v3_mem_month',null,lg))+'</i>':''))+'</span></div>';}).join('')+'</div></div>'});}
  var sp=A.sponsorsFor(S,iso);
  if(dsp.slSp!==false&&sp.length)out.push({cls:'sp',secs:secs,html:'<div class="fc s-sp">'+top(S,TLs(S,'v3_sp_title'),TLs(S,'v3_sp_thanks'))+'<div class="sp-l">'+sp.map(function(s){var by=TPs(S,s,'by'),fr=TPs(S,s,'for');return '<div class="spc"><span class="k">'+TLs(S,'sp_'+(s.type||'general'))+'</span><div><b>'+(by||'—')+'</b>'+(fr?'<span>'+fr+'</span>':'')+'</div></div>';}).join('')+'</div><p class="cta">'+TLs(S,'v3_sp_cta')+'</p></div>'});
  var h=halToday()||halRead();
  if(dsp.slHal!==false&&h&&h.ref){var tx=h.text||[],i=tx.length?D.halIdx%tx.length:0,start=+(String(h.ref).match(/:(\d+)/)||[0,0])[1],url='https://www.sefaria.org/'+encodeURI(h.url||'')+'?lang=he';
    out.push({cls:'hal',secs:Math.max(secs,20),hal:true,html:'<div class="fc s-hal">'+top(S,TLs(S,'v3_hal_title'),E(lg==='he'?h.he:h.en),tx.length>1&&start?E(T('v3_hal_seif',{s:lg==='he'?gem(start+i):start+i},lg)):'')+
      '<div class="hal-b"><div class="hal-t" lang="he" dir="rtl">'+(tx.length?'<p>'+E(tx[i])+'</p>':'')+'<small>'+TLs(S,'v3_hal_src')+'</small></div><div class="hal-q"><div class="qr">'+A.qrSvg(url)+'</div><b>'+TLs(S,'v3_hal_full')+'</b><small>'+TLs(S,'v3_hal_scan')+'</small></div></div></div>'});}
  if(!out.length)out.push({cls:'welcome',secs:secs,html:'<div class="fc s-wel"><h2>'+TLs(S,'v3_welcome')+'</h2></div>'});
  return out;
}
/* ---- holiday, fast, national-day and Omer screens ---- */
function tile(k,v,cls){return '<div class="tile'+(cls?' '+cls:'')+'"><small>'+k+'</small><b>'+v+'</b></div>';}
function readTile(S,c,lg,forIso){
  var iso=forIso||((!c.eve&&c.P.hh<12)?c.P.iso:(c.eve?c.eIso:A.isoAdd(c.P.iso,1))),r=readingInfo(iso,lg);if(!r)return '';
  return '<div class="tile wide"><small>'+TLs(S,iso===c.P.iso?'v3_read_today':'v3_read_tmr')+'</small><b>'+E(r.name)+'</b><span>'+E(r.ref)+'</span></div>';
}
function timeTiles(S,c,lg){
  var out='',di=c.di;
  if(di&&di.candles&&c.now<di.candles)out+=tile(TLs(S,'v3_candles'),A.hm(di.candles));
  if(di&&di.havdalah&&c.now<new Date(di.havdalah.getTime()+3600000))out+=tile(TLs(S,di.chag?'v3_chag_end':'v3_shab_end'),A.hm(di.havdalah));
  return out;
}
function holidaySlides(S,c){
  var lg=tvLg(S),out=[],th=themeOfDi(c.edi),secs=Math.max(8,+S.display.slideSecs||12),up=false,nd=null;
  if(!th&&!c.eve){nd=A.dayInfo(A.isoAdd(c.P.iso,1),S.shul);var t2=themeOfDi(nd);if(t2&&t2!=='rc'){th=t2;up=true;}}
  var di=up?nd:c.edi,name=function(re){var e=evOf(di,re);return e?e.render(A.locale(lg)):'';};
  if(th==='chanukah'){
    var n=candlesTonight(c),z=c.di&&c.di.zm;
    out.push({cls:'hol chan',secs:secs,html:'<div class="fc s-hol"><h2 class="greet">'+TLs(S,'g_chanukah')+'</h2><p class="lead">'+(n?TLs(S,n===1?'v3_tonight_1':'v3_tonight_n',{n:n}):TLs(S,'v3_zot'))+'</p>'+
      '<div class="art">'+ART.chanukiah(n||8,T('g_chanukah'))+'</div><div class="tiles">'+(c.P.dow===5&&c.di.candles?tile(TLs(S,'v3_candles'),A.hm(c.di.candles)):(z?tile(TLs(S,'v3_sunset'),A.hm(z.shkia))+tile(TLs(S,'v3_tzeit'),A.hm(z.tzeit)):''))+readTile(S,c,lg)+'</div></div>'});
  }else if(th==='fast'){
    var fIso=up?A.isoAdd(c.P.iso,1):c.eIso,ft=fastTimes(S,fIso),fn=name(/^(Tzom|Asara|Ta'anit Esther|Tish'a)/),list=lyOn(fIso),r0=list[0],isTb=/Tish'a/.test(fn)||evOf(di,/^Tish'a B'Av$/);
    var rd=r0?(lg==='he'?(isTb?refHe(r0.summary):'ויחל'):(isTb?r0.summary:'Vayechal')):'',asara=!!evOf(di,/^Asara B'Tevet$/);
    out.push({cls:'hol fast',secs:secs,html:'<div class="fc s-hol"><h2 class="greet">'+(up?E(T('v3_fast_tmr',{n:fn},lg)):E(fn))+'</h2>'+
      '<div class="tiles big">'+(ft.begin?tile(TLs(S,'v3_fast_start'),A.hm(ft.begin)):'')+(ft.end?tile(TLs(S,'v3_fast_end'),A.hm(ft.end),'dark'):'')+'</div>'+
      '<dl class="facts">'+(rd?'<div><dt>'+TLs(S,'v3_reading')+'</dt><dd>'+E(isTb?rd:T('v3_reading_both',{r:rd},lg))+'</dd></div>':'')+(!isTb?'<div><dt>'+TLs(S,'v3_in_tefilla')+'</dt><dd>'+TLs(S,'v3_fast_adds')+'</dd></div>':'')+
      (asara?'<div><dt>'+TLs(S,'v3_kaddish_klali')+'</dt><dd>'+TLs(S,'v3_kaddish_klali_d')+'</dd></div>':'')+'</dl></div>'});
  }else if(th==='atzmaut'||th==='yerushalayim'){
    var hy=di&&di.hd?di.hd.getFullYear():0,num=th==='atzmaut'?hy-5708:hy-5727,om=di&&di.omer?di.omer.omer:0;
    out.push({cls:'hol nat '+th,secs:secs,html:'<div class="fc s-hol"><div class="art sm">'+ART.emblem(th)+'</div><h2 class="greet">'+TLs(S,'g_'+th)+'</h2><p class="lead">'+TLs(S,th==='atzmaut'?'v3_atz_n':'v3_yy_n',{n:num})+'</p>'+
      '<div class="tiles">'+tile(TLs(S,'v3_in_shacharit'),TLs(S,'v3_hallel_bracha'))+(om?tile(TLs(S,'v3_omer_tonight'),E(omerText(c.eve?om:om+1,lg))):'')+'</div></div>'});
  }else if(th==='shoah'||th==='zikaron'){
    var nm=name(/^(Yom HaShoah|Yom HaZikaron|Swords of Iron)/),zk=!!evOf(di,/^Yom HaZikaron$/);
    var sirens=th==='shoah'?tile(TLs(S,'v3_siren_day'),'10:00'):(zk?tile(TLs(S,'v3_siren_eve'),'20:00')+tile(TLs(S,'v3_siren_day'),'11:00'):'');
    out.push({cls:'hol memday',secs:secs,html:'<div class="fc s-hol"><div class="art sm">'+ART.emblem(th)+'</div><h2 class="greet">'+E(nm)+'</h2><p class="lead">'+TLs(S,'v3_yehi')+'</p>'+(sirens?'<div class="tiles">'+sirens+'</div>':'')+'</div>'});
  }else if(th){
    var g=th==='sukkot'&&di&&di.chol?'g_moadim':(th==='pesach'&&di&&di.chol?'g_moadim':'g_'+th),rule=THEME_RULES.filter(function(r){return r[1]===th;})[0],own=holsOf(di).filter(function(e){return rule&&rule[0].test(e.getDesc());})[0]||holsOf(di).filter(function(e){return !/^Chanukah/.test(e.getDesc());})[0],hn=own?own.render(A.locale(lg)):'';
    out.push({cls:'hol gen',secs:secs,html:'<div class="fc s-hol"><div class="art">'+ART.emblem(th)+'</div><h2 class="greet">'+TLs(S,g)+'</h2>'+(hn?'<p class="lead">'+E(hn)+'</p>':'')+
      '<div class="tiles">'+timeTiles(S,c,lg)+(th!=='tubishvat'&&th!=='lag'?readTile(S,c,lg):'')+'</div></div>'});
  }
  var om2=c.edi&&c.edi.omer&&c.eve&&c.di&&c.di.zm.tzeit&&c.now>=c.di.zm.tzeit?c.edi.omer.omer:0;
  if(om2&&th!=='atzmaut'&&th!=='yerushalayim')out.push({cls:'hol omer',secs:secs,html:'<div class="fc s-hol"><p class="kick">'+TLs(S,'v3_omer_t')+'</p><h2 class="greet omn">'+om2+'</h2><p class="lead">'+TLs(S,'v3_omer_tonight')+': '+E(omerText(om2,lg))+'</p></div>'});
  return out;
}
function stillBoard(S,c){
  var lg=tvLg(S),wk=A.weekInfo(c.eIso,S.shul),fri='',sat='',cards='',th=themeOfDi(c.edi),chag=c.edi&&c.edi.chag,emb=th&&th!=='fast'?emblemFor(th,c):'';
  if(wk.candles)fri+='<li class="cdl"><span>'+TLs(S,'candles')+'</span><b>'+A.hm(wk.candles)+'</b></li>';
  A.shabbatList(S,wk).forEach(function(x){var li='<li><span>'+TPs(S,x.e,'name')+'</span><b>'+E(x.time)+'</b></li>';if(x.dw===5)fri+=li;else sat+=li;});
  if(wk.havdalah)sat+='<li class="cdl"><span>'+TLs(S,'havdalah')+'</span><b>'+A.hm(wk.havdalah)+'</b></li>';
  S.notices.filter(function(n){return n.shabbat&&A.noticeOn(n,c.P.iso,c.P.dow,'screen');}).forEach(function(n){cards+='<div><h3>'+TPs(S,n,'title')+'</h3><p>'+TPs(S,n,'body')+'</p></div>';});
  var sp=A.sponsorsFor(S,c.P.iso);if(sp.length)cards+='<div><h3>'+TLs(S,'sponsors')+'</h3><p>'+sp.map(function(s){return TLs(S,'sp_'+(s.type||'general'))+': '+(TPs(S,s,'by')||'')+(TPs(S,s,'for')?', '+TPs(S,s,'for'):'');}).join('<br>')+'</p></div>';
  var title=chag?holLine(c,lg)[0]||'':A.parshaText(wk,lg);
  return '<div class="fc s-still">'+(emb?'<div class="art sm">'+emb+'</div>':'')+'<p class="kick">'+TLs(S,chag?'v3_chag_sameach':'v3_shabbat_shalom')+'</p><h2>'+E(title)+'</h2><div class="two">'+(fri?'<div><h3>'+TLs(S,'v3_erev')+'</h3><ol>'+fri+'</ol></div>':'')+(sat?'<div><h3>'+TLs(S,'v3_shabbat_day')+'</h3><ol>'+sat+'</ol></div>':'')+'</div>'+(cards?'<div class="cards">'+cards+'</div>':'')+'</div>';
}
/* ---- fitting and scaling ---- */
function scaleTv(){var c=document.getElementById('tv3-c');if(!c)return;var k=Math.min(window.innerWidth/1920,window.innerHeight/1080);c.style.transform='translate(-50%,-50%) scale('+k.toFixed(4)+')';}
function fitBox(el,prop,min){
  if(!el)return;var boxes=[el].concat([].slice.call(el.querySelectorAll('.fc,.cards>div')));
  var over=function(){for(var i=0;i<boxes.length;i++){if(boxes[i].scrollHeight>boxes[i].clientHeight+2||boxes[i].scrollWidth>boxes[i].clientWidth+2)return true;}return false;};
  var f=1;el.style.setProperty(prop,'1');while(f>min&&over()){f-=.03;el.style.setProperty(prop,f.toFixed(2));}
}
function fitA(){var box=document.getElementById('ta');if(!box)return;var f=1;box.style.setProperty('--fa','1');while(f>.55&&(box.scrollHeight>box.clientHeight+1||box.scrollWidth>box.clientWidth+1)){f-=.03;box.style.setProperty('--fa',f.toFixed(2));}}
function startScroll(){
  clearInterval(D.scT);var v=document.getElementById('tscv');if(!v)return;var st=D.sc;v.scrollTop=st.pos;
  if(v.scrollHeight-v.clientHeight<3){st.pos=0;v.scrollTop=0;return;}if(reduce())return;
  D.scT=setInterval(function(){if(!v.isConnected){clearInterval(D.scT);return;}if(st.hold>0){st.hold--;return;}var max=v.scrollHeight-v.clientHeight;st.pos=Math.max(0,Math.min(max,st.pos+st.dir*(st.dir>0?1:3)));v.scrollTop=st.pos;if(st.dir>0&&st.pos>=max){st.dir=-1;st.hold=90;}else if(st.dir<0&&st.pos<=0){st.dir=1;st.hold=90;}},40);
}
function fitFlyer(S,im){
  var tv=document.getElementById('tv3'),stage=document.getElementById('ts');if(!tv||!stage)return;
  tv.classList.remove('wide');var w=im.naturalWidth,h=im.naturalHeight;if(!w||!h||S.display.flyerFull===false)return;
  var a=Math.min(stage.clientWidth/w,stage.clientHeight/h);tv.classList.add('wide');var b=Math.min(stage.clientWidth/w,stage.clientHeight/h);if(b<a*1.15)tv.classList.remove('wide');
}
function startSlides(S){
  clearTimeout(D.slideT);var tv=document.getElementById('tv3'),stage=document.getElementById('ts');if(!stage)return;
  if(tv)tv.classList.remove('wide');var c=ctx(S);
  if(A.ui.stillFlag){stage.innerHTML='<div class="sl still">'+stillBoard(S,c)+'</div>';fitBox(stage.querySelector('.sl'),'--fit',.4);return;}
  var list=tSlides(S,c);if(D.slide>=list.length)D.slide=0;var s=list[D.slide];
  stage.innerHTML='<div class="sl '+s.cls+'">'+s.html+'</div>'+(list.length>1?'<div class="dots" aria-hidden="true">'+list.map(function(_,i){return '<i class="'+(i===D.slide?'on':'')+'"></i>';}).join('')+'</div>':'');
  var el=stage.querySelector('.sl');
  if(s.cls==='img')A.imgUrl(s.img).then(function(url){if(!url||!stage.contains(el))return;var im=A.preload(url);if(im.complete&&im.naturalWidth)fitFlyer(S,im);else im.addEventListener('load',function(){if(stage.contains(el))fitFlyer(S,im);},{once:true});});
  else fitBox(el,'--fit',.4);
  list.forEach(function(x){if(x.img)A.imgUrl(x.img).then(function(u){if(u)A.preload(u);});});
  D.slideT=setTimeout(function(){if(s.hal)D.halIdx++;D.slide=(D.slide+1)%Math.max(1,list.length);if(location.hash==='#display')startSlides(A.screenState());},s.secs*1000);
}

/* ---------- hooks the engine calls ---------- */
var SKIN={
  loading:function(api){A=api;A.addStrings(STR);return '<div class="v3-loading" aria-busy="true"></div>';},
  home:function(api){A=api;A.addStrings(STR);halFetch(function(){if(location.hash!=='#display'){var b=document.getElementById('b-today');if(b){var S=A.state;b.outerHTML=blkToday(S,ctx(S));}}});return home();},
  display:function(api){A=api;A.addStrings(STR);halFetch(function(){if(location.hash==='#display'){var S=A.screenState(),a=document.getElementById('ta');if(a){a.innerHTML=tColA(S,ctx(S),!!A.ui.stillFlag);fitA();}}});return display();},
  after:function(r){
    document.documentElement.classList.toggle('dr-open',r==='home'&&!!D.dr);
    if(r==='home'){
      if(D.dr&&D.focusDr){D.focusDr=false;var dr=document.getElementById('dr');if(dr){requestAnimationFrame(function(){dr.classList.add('in');});try{dr.focus({preventScroll:true});}catch(e){}}}
      else if(D.dr){var d2=document.getElementById('dr');if(d2)d2.classList.add('in','still');}
      swipe();if(D.dr==='send')gregToH();
    }else if(r==='display'){var S=A.screenState();scaleTv();fitA();startScroll();startSlides(S);}
  },
  tick:function(r,P,S,still){
    if(P.mm===D.lastMin)return;D.lastMin=P.mm;var c=ctx(S);
    if(r==='home'){
      if(themeNow(S,c)!==D.theme){A.render();return;}
      var hx=document.getElementById('hd-text');if(hx)hx.innerHTML=hdText(S,c,D.theme);
      var bt=document.getElementById('b-today');if(bt)bt.outerHTML=blkToday(S,c);
      if(P.mm===0)halFetch();
    }else if(r==='display'){
      if(themeNow(S,c)!==D.theme){A.render();return;}
      var th=document.getElementById('th');if(th)th.innerHTML=tHead(S,c,D.theme);
      if(still)return;
      var a=document.getElementById('ta');if(a){a.innerHTML=tColA(S,c,false);fitA();}
      var cc=document.getElementById('tc');if(cc){cc.innerHTML=tColC(S,c);startScroll();}
      var f=document.getElementById('tf');if(f)f.innerHTML=tFoot(S);
      if(P.mm%30===0)halFetch();
    }
  },
  resize:function(r){if(r==='display'){scaleTv();}},
  fit:function(r){if(r==='display'){scaleTv();fitA();var el=document.querySelector('#ts .sl');if(el&&!el.classList.contains('img'))fitBox(el,'--fit',.4);startScroll();}},
  jump:function(h){var map={docs:'docs',minutes:'docs',simchas:'simchas',contact:'contact',donate:'give',notices:'notices',times:'week',schedule:'week',send:'send'};if(map[h]){history.replaceState(null,'',location.pathname+location.search);return openDr(map[h]);}return false;}
};
/* notices: swipe on phones */
function swipe(){
  var v=document.getElementById('ntc-view');if(!v||v._sw)return;v._sw=1;var x0=null,y0=null;
  v.addEventListener('pointerdown',function(e){if(e.pointerType==='mouse')return;x0=e.clientX;y0=e.clientY;},{passive:true});
  v.addEventListener('pointerup',function(e){if(x0==null)return;var dx=e.clientX-x0,dy=e.clientY-y0;x0=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)page((dx<0)===rtl()?-1:1);},{passive:true});
}
function page(n){var S=A.state,c=ctx(S),list=noticeList(S,c.P.iso,c.P.dow);if(list.length<2)return;D.ni=(D.ni+n+list.length)%list.length;var b=document.getElementById('b-notices');if(b){b.outerHTML=blkNotices(S,c);swipe();}}
document.addEventListener('click',function(e){
  var b=e.target.closest('[data-v3]');if(!b||!A)return;var act=b.getAttribute('data-v3');
  if(act==='open'){e.preventDefault();openDr(b.getAttribute('data-d'),b.getAttribute('data-arg'));return;}
  if(act==='close'){e.preventDefault();closeDr();return;}
  if(act==='np'){page(+b.getAttribute('data-n'));return;}
  if(act==='go'){var t=document.getElementById(b.getAttribute('data-to'));if(t){t.scrollIntoView({behavior:reduce()?'auto':'smooth',block:'start'});var h=t.querySelector('h2');if(h){h.setAttribute('tabindex','-1');try{h.focus({preventScroll:true});}catch(x){}}}return;}
  if(act==='send'){e.preventDefault();var ty=b.getAttribute('data-type');if(SEND_TYPES.indexOf(ty)>=0){sendVals();D.send.type=ty;}D.send.done=false;D.send.err='';if(D.dr==='send'){refreshSend();}else openDr('send');return;}
  if(act==='stype'){sendVals();D.send.type=b.getAttribute('data-type');D.send.err='';refreshSend();var p=document.querySelector('[data-v3="stype"][aria-pressed="true"]');if(p)try{p.focus();}catch(x){}return;}
  if(act==='send-again'){D.send.done=false;D.send.err='';refreshSend('text');return;}
});
document.addEventListener('submit',function(e){if(e.target&&e.target.id==='send'){e.preventDefault();doSend();}});
document.addEventListener('change',function(e){var id=e.target&&e.target.id;if(id==='s-greg'||id==='s-after')gregToH();});
document.addEventListener('toggle',function(e){if(e.target&&e.target.classList&&e.target.classList.contains('greg'))D.send.greg=e.target.open;},true);
document.addEventListener('keydown',function(e){
  if(!A||!D.dr)return;
  if(e.key==='Escape'){closeDr();return;}
  if(e.key==='Tab'){var dr=document.getElementById('dr');if(!dr)return;var f=[].slice.call(dr.querySelectorAll('button,a[href],summary,input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter(function(x){return x.offsetParent!==null&&!x.disabled;});if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&(document.activeElement===a||document.activeElement===dr)){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}
});
window.SHUL_SKIN=SKIN;
/* test hook: lets the automated checks render any date's theme and screens */
window.SHUL_V3={ctx:function(S,d){return ctx(S,d);},themeNow:themeNow,holLine:holLine,readingInfo:readingInfo,refHe:refHe,omerText:omerText,memModel:memModel};
})();
