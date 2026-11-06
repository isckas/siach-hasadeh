
(function(){
'use strict';
var TZ='Asia/Jerusalem';
var H=window.hebcal||null;
var $app=document.getElementById('app');
var SEED=null;                 /* starting content shipped with the site (seed/state.json) */
var state=normalize({});       /* what is live in the database */
var base=clone(state);         /* the version the board member's draft was started from */
var draft=clone(state);        /* the board member's unsaved edits */
var ui={tab:'overview',open:{},previewDraft:false,publishing:false,ready:false,baseRev:0,zDate:'',slide:0,slideTimer:null,lastMinute:-1,stillFlag:null,armed:null,busy:{},uploaded:{}};
/* Firebase: database, Google sign-in, admin role */
var FB={app:null,db:null,auth:null,user:null,email:'',role:'',checked:false,hasDoc:false,meta:{rev:0,by:'',at:null},admins:[],log:[],subs:[]};
var OWNERS=(window.SHUL_OWNERS||[]).map(function(e){return String(e).toLowerCase();});
var lang=(function(){try{return localStorage.getItem('shul-lang')||state.shul.defaultLang||'he';}catch(e){return state.shul.defaultLang||'he';}})();

/* ---------- strings ---------- */
var L={
  kind:['בית כנסת','Synagogue'], city:['מעלה אדומים',"Ma'ale Adumim"],
  nav_times:['תפילות','Prayer times'], nav_zmanim:['זמני היום','Zmanim'], nav_notices:['הודעות','Notices'], nav_community:['השבוע בקהילה','This week'], nav_shiurim:['שיעורים','Shiurim'], nav_donate:['תרומות','Donate'], nav_contact:['הגעה וקשר','Contact'],
  board:['ניהול','Board'], screen_view:['תצוגת מסך','Screen view'], site_view:['לאתר','Back to site'],
  today:['היום','Today'], next:['התפילה הבאה','Next tefillah'], in_min:['בעוד {n} דק׳','in {n} min'], in_hm:['בעוד {h}:{m} ש׳','in {h}h {m}m'], tomorrow:['מחר','tomorrow'], none_today:['אין עוד תפילות היום','No more tefillot today'],
  weekday:['ימי חול','Weekdays'], shabbat:['שבת','Shabbat'], shiurim:['שיעורים','Shiurim'], shiur:['שיעור','Shiur'],
  candles:['הדלקת נרות','Candle lighting'], havdalah:['צאת השבת','Shabbat ends'], parsha:['פרשת השבוע','Parsha'],
  erev_shabbat:['ערב שבת','Friday'], shabbat_day:['שבת','Shabbat'], this_week:['השבוע','This week'],
  times_note:['זמנים התלויים בשקיעה מחושבים אוטומטית לשבוע הנוכחי.','Times tied to sunset are calculated automatically for this week.'],
  zm_title:['זמני היום','Zmanim'], zm_note:['לפי מיקום בית הכנסת. מעוגל לחומרה.','For the shul\'s location, rounded to the stricter side.'], zm_unavail:['זמני היום לא נטענו. נסו לרענן את הדף.','Zmanim did not load. Try refreshing the page.'],
  prev_day:['יום קודם','Previous day'], next_day:['יום הבא','Next day'], back_today:['היום','Today'],
  zm_alot:['עלות השחר','Dawn (Alot)'], zm_misheyakir:['זמן ציצית ותפילין','Earliest tallit'], zm_netz:['הנץ החמה','Sunrise'], zm_shmaMGA:['סוף ק״ש מג״א','Latest Shema (MGA)'], zm_shma:['סוף ק״ש גר״א','Latest Shema (GRA)'], zm_tfillaMGA:['סוף תפילה מג״א','Latest Shacharit (MGA)'], zm_tfilla:['סוף תפילה גר״א','Latest Shacharit (GRA)'], zm_chatzot:['חצות היום','Midday'], zm_minchaGedola:['מנחה גדולה','Earliest Mincha'], zm_minchaKetana:['מנחה קטנה','Mincha Ketana'], zm_plag:['פלג המנחה','Plag HaMincha'], zm_shkia:['שקיעה','Sunset'], zm_tzeit:['צאת הכוכבים','Nightfall'],
  notices:['הודעות ומודעות','Notices & flyers'], no_notices:['אין הודעות כרגע.','No notices right now.'], until:['עד {d}','until {d}'], from:['מ־{d}','from {d}'], every:['כל {d}','every {d}'],
  community:['השבוע בקהילה','This week in the community'], sponsors:['חסויות והקדשות','Sponsors & dedications'], mazal:['מזל טוב','Mazal Tov'], yahrzeit:['יארצייט — לעילוי נשמת','Yahrzeits — l\'ilui nishmat'], refuah:['לרפואה שלמה','Refuah Shleima'],
  no_sponsor_kiddush:['הקידוש השבוע עדיין פנוי להקדשה.','This week\'s Kiddush is still open for sponsorship.'], sponsor_cta:['להקדשת קידוש','Sponsor the Kiddush'],
  sp_kiddush:['קידוש','Kiddush'], sp_seudah:['סעודה שלישית','Seudah Shlishit'], sp_learning:['יום לימוד','Day of learning'], sp_tefillot:['תפילות השבוע','This week\'s tefillot'], sp_general:['הקדשה','Dedication'],
  sp_by:['בחסות','Sponsored by'],
  no_mazal:['אין שמחות רשומות השבוע.','No simchas listed this week.'], no_yahrzeit:['אין יארצייטים רשומים השבוע.','No yahrzeits listed this week.'], no_refuah:['הרשימה ריקה.','The list is empty.'],
  donate:['תרומות','Donate'], donate_lead:['תרומתכם מחזיקה את בית הכנסת: חשמל, ספרים, קידושים ושיעורים.','Your donation keeps the shul running: electricity, books, kiddushes and shiurim.'],
  bit:['ביט','Bit'], paybox:['פייבוקס','PayBox'], pay_bit:['תרומה בביט','Donate with Bit'], pay_paybox:['תרומה בפייבוקס','Donate with PayBox'], bit_phone:['למספר','To number'], bank:['העברה בנקאית','Bank transfer'], scan:['סרקו לתרומה','Scan to donate'], no_donate:['פרטי התרומה יעודכנו בקרוב.','Donation details are coming soon.'],
  contact:['הגעה ויצירת קשר','Find us & contact'], address:['כתובת','Address'], waze:['ניווט בוויז','Navigate with Waze'], gmaps:['Google Maps','Google Maps'], phone:['טלפון','Phone'], email:['אימייל','Email'], whatsapp:['קבוצת וואטסאפ','WhatsApp group'], rabbi:['רב בית הכנסת','Rabbi'], gabbai:['גבאי','Gabbai'], nusach:['נוסח','Nusach'], about:['על בית הכנסת','About'],
  copy:['העתקה','Copy'], copied:['הועתק','Copied'],
  verse_src:['בראשית ב, ה','Bereshit 2:5'],
  foot_board:['כניסת חברי ועד','Board sign-in'], foot_screen:['מסך בית הכנסת','Shul screen'],
  scan_site:['סרקו לזמנים, הודעות ותרומות','Scan for times, notices & donations'],
  welcome:['ברוכים הבאים','Welcome'],
  fullscreen:['מסך מלא','Full screen'],
  s_mashiv:['משיב הרוח ומוריד הגשם','Mashiv HaRuach'], s_tal:['מוריד הטל','Morid HaTal'], s_umatar:['ותן טל ומטר','V\'ten Tal uMatar'], s_bracha:['ותן ברכה','V\'ten Bracha'], s_yaaleh:['יעלה ויבוא','Ya\'aleh VeYavo'], s_nissim:['על הניסים','Al HaNissim'], s_tach:['אומרים תחנון','Tachanun'], s_tach_s:['תחנון בשחרית בלבד','Tachanun: Shacharit only'], s_notach:['אין אומרים תחנון','No Tachanun'], s_hallel2:['הלל שלם','Full Hallel'], s_hallel1:['חצי הלל','Half Hallel'], s_eruv:['עירוב תבשילין','Eruv Tavshilin'],
  /* manage */
  m_title:['ניהול האתר והמסך','Site & screen manager'], m_lead:['כל שינוי כאן מתעדכן באתר ובמסך בבית הכנסת אחרי לחיצה על "שמירה ופרסום".','Every change here updates the website and the shul screen after you press "Save & publish".'],
  tab_overview:['סקירה','Overview'], tab_times:['זמני תפילות','Prayer times'], tab_notices:['הודעות ומודעות','Notices & flyers'], tab_sponsors:['חסויות','Sponsors'], tab_community:['קהילה','Community'], tab_donate:['תרומות','Donations'], tab_urgent:['הודעה דחופה','Urgent banner'], tab_shul:['פרטי בית הכנסת','Shul details'], tab_screen:['הגדרות מסך','Screen settings'],
  checking:['בודק הרשאות…','Checking your access…'],
  unsaved:['{n} שינויים שלא נשמרו','{n} unsaved changes'], unsaved1:['שינוי אחד שלא נשמר','1 unsaved change'], all_saved:['הכל שמור ומפורסם','Everything is saved and published'], publish:['שמירה ופרסום','Save & publish'], publishing:['מפרסם…','Publishing…'], discard:['ביטול שינויים','Discard changes'], discard2:['לחצו שוב לביטול','Click again to discard'],
  published:['פורסם. האתר והמסך מתעדכנים.','Published. The site and screen are updating.'], conflict:['מישהו שמר באותו רגע. השינויים שלו שולבו עם שלכם — לחצו שוב "שמירה ופרסום".','Someone saved at the same moment. Their changes were merged with yours — press "Save & publish" again.'], save_failed:['השמירה נכשלה. בדקו את החיבור לאינטרנט ונסו שוב.','Saving failed. Check the internet connection and try again.'], perm_denied:['אין הרשאה לשמור. ודאו שאתם מחוברים עם חשבון מנהל.','You don\'t have permission to save. Make sure you\'re signed in with an admin account.'],
  add_time:['הוספת תפילה או שיעור','Add a tefillah or shiur'], add_notice:['הוספת הודעה או מודעה','Add a notice or flyer'], add_sponsor:['הוספת חסות','Add a sponsor'], add_mazal:['הוספת מזל טוב','Add a Mazal Tov'], add_refuah:['הוספת שם','Add a name'], add_yahrzeit:['הוספת יארצייט','Add a yahrzeit'],
  duplicate:['שכפול','Duplicate'], del:['מחיקה','Delete'], del2:['לחצו שוב למחיקה','Click again to delete'], empty_list:['עדיין אין פריטים. הוסיפו את הראשון.','Nothing here yet. Add the first one.'],
  st_on:['מוצג','Showing'], st_soon:['מתחיל {d}','Starts {d}'], st_past:['הסתיים','Expired'], st_hidden:['מוסתר','Hidden'], st_always:['קבוע','Always on'],
  f_nameHe:['שם (עברית)','Name (Hebrew)'], f_nameEn:['שם (אנגלית)','Name (English)'], f_group:['סוג','Type'], f_days:['ימים','Days'], f_mode:['שעה','Time'], f_time:['שעה קבועה','Fixed time'], f_base:['ביחס ל','Relative to'], f_offset:['דקות (+ אחרי / − לפני)','Minutes (+ after / − before)'], f_round:['עיגול','Rounding'], f_teacherHe:['מוסר השיעור (עברית)','Teacher (Hebrew)'], f_teacherEn:['מוסר השיעור (אנגלית)','Teacher (English)'], f_noteHe:['הערה (עברית)','Note (Hebrew)'], f_noteEn:['הערה (אנגלית)','Note (English)'], f_hidden:['להסתיר זמנית','Hide for now'],
  g_weekday:['תפילה — ימי חול','Tefillah — weekday'], g_shabbat:['תפילה — שבת','Tefillah — Shabbat'], g_shiur:['שיעור','Shiur'],
  md_fixed:['שעה קבועה','Fixed time'], md_rel:['לפי זמן היום','Tied to a zman'],
  b_candles:['הדלקת נרות','Candle lighting'], b_sunset:['שקיעה','Sunset'], b_sunrise:['הנץ','Sunrise'], b_tzeit:['צאת הכוכבים','Nightfall'], b_havdalah:['צאת השבת','Shabbat end'], b_plag:['פלג המנחה','Plag'], b_minchaKetana:['מנחה קטנה','Mincha Ketana'], b_minchaGedola:['מנחה גדולה','Mincha Gedola'], b_chatzot:['חצות','Chatzot'], b_alot:['עלות השחר','Alot'],
  r_none:['ללא','None'], r_down5:['ל־5 דק׳ למטה','Down to 5 min'], r_up5:['ל־5 דק׳ למעלה','Up to 5 min'], r_near5:['ל־5 דק׳ הקרובות','Nearest 5 min'],
  rule_at:['בזמן {b}','At {b}'], rule_after:['{n} דק׳ אחרי {b}','{n} min after {b}'], rule_before:['{n} דק׳ לפני {b}','{n} min before {b}'],
  f_kind:['סוג ההודעה','Notice type'], k_standard:['קבועה (תמיד מוצגת)','Standard (always on)'], k_ongoing:['שוטפת (חוזרת / עד תאריך)','Ongoing (recurring / until a date)'], k_timed:['לזמן מוגבל (אירוע, מודעה)','Timed (event, flyer)'],
  f_titleHe:['כותרת (עברית)','Title (Hebrew)'], f_titleEn:['כותרת (אנגלית)','Title (English)'], f_bodyHe:['טקסט (עברית)','Text (Hebrew)'], f_bodyEn:['טקסט (אנגלית)','Text (English)'], f_image:['מודעה / תמונה','Flyer / image'], f_start:['מתאריך','From'], f_end:['עד תאריך (כולל)','Until (inclusive)'], f_ndays:['להציג רק בימים','Show only on days'], f_web:['להציג באתר','Show on website'], f_screen:['להציג במסך','Show on screen'], f_shabbat:['להשאיר במסך בשבת','Keep on screen during Shabbat'], f_secs:['שניות בשקופית (ריק = ברירת מחדל)','Seconds on screen (blank = default)'],
  img_pick:['העלאת תמונה','Upload image'], img_remove:['הסרה','Remove'], img_hint:['JPG או PNG בכל גודל — המודעה מותאמת אוטומטית למסך ולא נחתכת, ומודעה רחבה מוצגת על כל המסך. מודעת PDF — שמרו כתמונה והעלו.','JPG or PNG of any size. Flyers are fitted to the TV automatically and never cropped; wide flyers fill the whole screen while they show. For a PDF flyer, save it as an image and upload that.'],
  f_flyerFull:['מודעה רחבה תוצג על כל המסך כשזה מגדיל אותה','Show a wide flyer on the whole screen when that makes it bigger'], img_only:['אפשר להעלות רק תמונות (JPG/PNG).','Only image files (JPG/PNG) can be uploaded.'], img_toobig:['התמונה גדולה מדי גם אחרי דחיסה. נסו תמונה קטנה יותר.','The image is still too large after compressing. Try a smaller image.'], img_fail:['העלאת התמונה נכשלה.','The image upload failed.'], uploading:['מעלה…','Uploading…'],
  f_type:['סוג החסות','Sponsorship'], f_byHe:['בחסות (עברית)','Sponsored by (Hebrew)'], f_byEn:['בחסות (אנגלית)','Sponsored by (English)'], f_forHe:['לרגל / לעילוי נשמת (עברית)','In honor of / in memory of (Hebrew)'], f_forEn:['לרגל / לעילוי נשמת (אנגלית)','In honor of / in memory of (English)'],
  f_textHe:['נוסח (עברית)','Text (Hebrew)'], f_textEn:['נוסח (אנגלית)','Text (English)'], f_name:['שם (למשל: פלוני בן פלונית)','Name (e.g. Ploni ben Plonit)'], f_until:['עד תאריך (לא חובה)','Until (optional)'],
  f_hday:['יום בחודש העברי','Hebrew day'], f_hmonth:['חודש עברי','Hebrew month'], f_hyear:['שנה עברית (לא חובה, למשל 5780)','Hebrew year (optional, e.g. 5780)'], f_relHe:['קרבה / הערה (עברית)','Relation / note (Hebrew)'], f_relEn:['קרבה / הערה (אנגלית)','Relation / note (English)'],
  f_bitPhone:['מספר טלפון לביט','Bit phone number'], f_bitLink:['קישור תשלום בביט (לעסקים/עמותות)','Bit payment link (business/nonprofit)'], f_payboxLink:['קישור לקבוצת/דף פייבוקס','PayBox group or payment link'], f_otherLink:['קישור תרומה נוסף (נדרים פלוס וכד׳)','Other donation link (Nedarim Plus etc.)'], f_otherLabelHe:['שם הכפתור (עברית)','Button label (Hebrew)'], f_otherLabelEn:['שם הכפתור (אנגלית)','Button label (English)'], f_bankHe:['פרטי העברה בנקאית (עברית)','Bank details (Hebrew)'], f_bankEn:['פרטי העברה בנקאית (אנגלית)','Bank details (English)'], f_dnoteHe:['הערה (למשל: קבלה לפי סעיף 46)','Note (e.g. Section 46 receipt)'], f_dnoteEn:['הערה (אנגלית)','Note (English)'],
  donate_hint:['הקישורים מוצגים כ"כפתור" באתר וכקוד QR במסך. בדקו כל קישור בטלפון לפני הפרסום.','Links appear as buttons on the site and as QR codes on the screen. Test each link on a phone before publishing.'],
  f_on:['להציג את ההודעה הדחופה','Show the urgent banner'], urgent_hint:['פס אדום בראש האתר והמסך. מתאים לביטול תפילה, שינוי מקום או הנחיות פיקוד העורף.','A red bar at the top of the site and screen. Use it for a cancelled minyan, a change of location or Home Front Command instructions.'],
  f_shulName:['שם (עברית)','Name (Hebrew)'], f_taglineHe:['תיאור קצר (עברית)','Short description (Hebrew)'], f_taglineEn:['תיאור קצר (אנגלית)','Short description (English)'], f_addressHe:['כתובת (עברית)','Address (Hebrew)'], f_addressEn:['כתובת (אנגלית)','Address (English)'], f_directionsHe:['הכוונה (עברית)','Directions (Hebrew)'], f_directionsEn:['הכוונה (אנגלית)','Directions (English)'], f_aboutHe:['על בית הכנסת (עברית)','About (Hebrew)'], f_aboutEn:['על בית הכנסת (אנגלית)','About (English)'], f_rabbiHe:['רב (עברית)','Rabbi (Hebrew)'], f_rabbiEn:['רב (אנגלית)','Rabbi (English)'], f_gabbaiHe:['גבאי (עברית)','Gabbai (Hebrew)'], f_gabbaiEn:['גבאי (אנגלית)','Gabbai (English)'], f_nusachHe:['נוסח (עברית)','Nusach (Hebrew)'], f_nusachEn:['נוסח (אנגלית)','Nusach (English)'], f_phone:['טלפון','Phone'], f_email:['אימייל','Email'], f_whatsapp:['קישור לקבוצת וואטסאפ','WhatsApp group link'], f_siteUrl:['הקישור הציבורי לאתר (לקוד ה-QR במסך)','Public link to this site (for the screen QR code)'], f_lat:['קו רוחב','Latitude'], f_lng:['קו אורך','Longitude'], f_candleMins:['הדלקת נרות: דקות לפני השקיעה','Candle lighting: minutes before sunset'], f_havdalahMode:['צאת השבת לפי','Shabbat ends by'], hv_tzeit:['צאת הכוכבים (8.5°)','Nightfall (8.5°)'], hv_mins:['דקות אחרי השקיעה','Minutes after sunset'], f_havdalahMins:['דקות אחרי השקיעה','Minutes after sunset'], f_defaultLang:['שפת ברירת המחדל באתר','Default website language'],
  shul_hint:['זמני היום מחושבים לפי המיקום וההגדרות כאן. כדאי לאשר עם הרב את מספר הדקות להדלקת נרות.','Zmanim are calculated from the location and settings here. Confirm the candle-lighting minutes with the Rav.'],
  f_dlang:['שפת המסך','Screen language'], dl_he:['עברית','Hebrew'], dl_en:['אנגלית','English'], dl_both:['עברית + אנגלית','Hebrew + English'], f_slideSecs:['שניות לכל שקופית','Seconds per slide'], f_shabbatMode:['בשבת ובחג','On Shabbat & Yom Tov'], sm_still:['תצוגה קבועה ללא החלפות (זמנים והודעות שבת)','Still board, no rotation (times & Shabbat notices)'], sm_normal:['להמשיך כרגיל','Keep rotating as usual'], f_zmanim:['זמני היום במסך','Zmanim on screen'], f_showDonate:['שקופית תרומות','Donation slide'], f_showQr:['קוד QR לאתר בתחתית המסך','QR code to the site at the bottom'],
  screen_hint:['כדי להציג על הטלוויזיה: פתחו בדפדפן המסך (או ב-Yodeck כ"דף אינטרנט") את הכתובת הזו. המסך לא צריך כניסה, ומתעדכן לבד כששומרים שינויים.','To show on the TV, open this address in the screen\'s browser (or as a Yodeck "Web page"). The screen needs no sign-in and updates by itself when changes are saved.'],
  open_screen:['פתיחת תצוגת המסך','Open the screen view'], preview_edits:['תצוגה מקדימה של המסך עם השינויים','Preview the screen with my edits'], preview_on:['תצוגה מקדימה — לא פורסם','Preview — not published'], back_edit:['חזרה לעריכה','Back to editing'],
  ov_screen:['על המסך עכשיו','On the screen now'], ov_slides:['שקופיות','slides'], ov_notices:['הודעות פעילות','active notices'], ov_expiring:['מסתיימים השבוע','ending this week'], ov_quick:['פעולות מהירות','Quick actions'], ov_clean:['הסרת פריטים שפג תוקפם','Remove expired items'], ov_cleaned:['הוסרו {n} פריטים. לחצו "שמירה ופרסום".','Removed {n} items. Press "Save & publish".'], ov_nothing:['אין פריטים שפג תוקפם.','Nothing has expired.'], ov_setup:['חיבור המסך בבית הכנסת','Connecting the shul screen'], ov_link_missing:['הוסיפו את הקישור הציבורי בלשונית "פרטי בית הכנסת" כדי שיופיע קוד QR במסך.','Add the public link under "Shul details" so a QR code shows on the screen.'],
  sub_mazal:['מזל טוב','Mazal Tov'], sub_refuah:['לרפואה שלמה','Refuah Shleima'], sub_yahrzeit:['יארצייט','Yahrzeits'], yahrzeit_hint:['היארצייט מחושב לפי התאריך העברי ומוצג אוטומטית בשבוע שבו הוא חל.','The yahrzeit is calculated from the Hebrew date and shows automatically in the week it falls.'],
  daily:['כל יום','Daily'], none:['—','—'],
  f_nstart:['מתאריך (לא חובה)','From (optional)'], f_nend:['תאריך הסרה (לא חובה — ריק = ללא הגבלה)','Take down after (optional — blank = no end date)'], f_mstart:['תאריך פרסום','Posted on'], f_mend:['יורד אוטומטית אחרי (שבועיים)','Comes down after (2 weeks)'],
  signin_title:['כניסת חברי ועד','Board sign-in'], signin_body:['הכניסה מיועדת למנהלי האתר בלבד. האתר הציבורי והמסך בבית הכנסת לא דורשים כניסה.','Sign-in is only for the site\'s admins. The public website and the shul screen need no login.'], signin_btn:['כניסה עם Google','Sign in with Google'], signout:['יציאה','Sign out'], other_account:['כניסה עם חשבון אחר','Use a different account'], signin_failed:['הכניסה נכשלה ({c}). נסו שוב.','Sign-in failed ({c}). Try again.'],
  not_admin_title:['החשבון הזה לא ברשימת המנהלים','This account isn\'t on the admin list'], not_admin_body:['{email} לא מורשה לנהל את האתר. בקשו מבעל האתר להוסיף את הכתובת בלשונית "משתמשים".','{email} can\'t manage the site. Ask the owner to add this address under "Users".'],
  no_fb:['האתר עדיין לא מחובר ל-Firebase.','This site isn\'t connected to Firebase yet.'], loading:['טוען…','Loading…'],
  tab_users:['משתמשים','Users'], users_lead:['רק מי שמופיע כאן יכול להיכנס עם Google ולערוך. בעלים יכולים גם להוסיף ולהסיר מנהלים. אין משתמשים רגילים — כל השאר רואים את האתר בלי כניסה.','Only people listed here can sign in with Google and edit. Owners can also add and remove admins. There are no regular users: everyone else sees the site without signing in.'],
  role_owner:['בעלים','Owner'], role_admin:['מנהל','Admin'], role_builtin:['בעלים קבוע','Built-in owner'], role_owner_d:['עורך תוכן ומנהל משתמשים','Edits content and manages users'], role_admin_d:['עורך תוכן','Edits content'],
  add_user:['הוספת מנהל','Add admin'], user_email:['כתובת חשבון Google','Google account email'], user_role:['הרשאה','Role'], add_btn:['הוספה','Add'], rm_user:['הסרה','Remove'], rm_user2:['לחצו שוב להסרה','Click again to remove'],
  user_added:['{email} נוסף ויכול להיכנס עכשיו.','{email} was added and can sign in now.'], user_removed:['{email} הוסר.','{email} was removed.'], user_updated:['ההרשאה עודכנה.','Role updated.'], user_bad:['הכניסו כתובת אימייל תקינה.','Enter a valid email address.'], only_owner:['רק בעלים יכולים לשנות את רשימת המנהלים.','Only owners can change the admin list.'], user_fail:['השינוי נכשל ({c}).','The change failed ({c}).'],
  you:['את/ה','you'], added_by:['נוסף ע״י {who}','Added by {who}'],
  merged:['{who} שמר שינויים בזמן שערכת. השינויים שולבו עם שלך.','{who} saved changes while you were editing. They were merged with yours.'],
  not_in_db:['התוכן עדיין לא נשמר במסד הנתונים. לחצו "שמירה ופרסום" פעם אחת כדי להעלות אותו.','The content isn\'t in the database yet. Press "Save & publish" once to upload it.'],
  last_saved:['נשמר לאחרונה ע״י {who}, {when}','Last saved by {who}, {when}'], recent:['שינויים אחרונים','Recent changes'], log_line:['{n} שינויים: {what}','{n} changes: {what}'], signed_in_as:['מחובר/ת כ־{email}','Signed in as {email}'],
  mazal_hint:['ברכות מזל טוב יורדות אוטומטית שבועיים אחרי תאריך הפרסום. אפשר לשנות את התאריך ידנית.','Mazal Tov notices come down automatically two weeks after the posted date. You can change the date by hand.']
};
var DOW={he:['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'],en:['Sun','Mon','Tue','Wed','Thu','Fri','Sat']};
var HMONTHS=[['7','תשרי','Tishrei'],['8','חשוון','Cheshvan'],['9','כסלו','Kislev'],['10','טבת','Tevet'],['11','שבט','Shevat'],['12','אדר','Adar'],['12L','אדר א׳','Adar I'],['13','אדר ב׳','Adar II'],['1','ניסן','Nisan'],['2','אייר','Iyar'],['3','סיוון','Sivan'],['4','תמוז','Tamuz'],['5','אב','Av'],['6','אלול','Elul']];
var ZKEYS=['alot','misheyakir','netz','shmaMGA','shma','tfillaMGA','tfilla','chatzot','minchaGedola','minchaKetana','plag','shkia','tzeit'];
var ZDEADLINE={shmaMGA:1,shma:1,tfillaMGA:1,tfilla:1,chatzot:1,shkia:1};

function t(k,vars,lg){var e=L[k];var s=e?(e[(lg||lang)==='he'?0:1]):k;if(vars)for(var v in vars)s=s.split('{'+v+'}').join(vars[v]);return s;}
function both(k,vars){return esc(t(k,vars,'he'))+'<span class="en">'+esc(t(k,vars,'en'))+'</span>';}
function pick(o,b,lg){if(!o)return '';lg=lg||lang;var a=o[b+(lg==='he'?'He':'En')],c=o[b+(lg==='he'?'En':'He')];return (a&&String(a).trim())?a:(c||'');}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function clone(o){return JSON.parse(JSON.stringify(o));}
function uid(p){return (p||'x')+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function safeUrl(u){u=String(u||'').trim();return /^https?:\/\//i.test(u)?u:'';}

function normalize(S){
  S.v=S.v||1;
  S.shul=Object.assign({nameHe:'שיח השדה',nameEn:'Siach HaSadeh',lat:31.7795,lng:35.3015,candleMins:30,havdalahMode:'tzeit',havdalahMins:40,defaultLang:'he'},S.shul||{});
  ['times','notices','sponsors','mazal','refuah','yahrzeit'].forEach(function(k){if(!Array.isArray(S[k]))S[k]=[];});
  S.donate=Object.assign({},S.donate||{});
  S.urgent=Object.assign({on:false,textHe:'',textEn:'',until:''},S.urgent||{});
  S.display=Object.assign({lang:'he',slideSecs:12,shabbatMode:'still',zmanim:['alot','netz','shmaMGA','shma','tfilla','chatzot','minchaGedola','plag','shkia','tzeit'],showDonate:true,showQr:true,flyerFull:true},S.display||{});
  return S;
}

/* ---------- dates (always Jerusalem civil time) ---------- */
var JPF=new Intl.DateTimeFormat('en-CA',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',weekday:'short'});
function jp(d){var o={};JPF.formatToParts(d||new Date()).forEach(function(p){o[p.type]=p.value;});return {iso:o.year+'-'+o.month+'-'+o.day,hh:+o.hour,mm:+o.minute,ss:+o.second,dow:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(o.weekday)};}
function isoAdd(iso,n){var a=iso.split('-').map(Number);return new Date(Date.UTC(a[0],a[1]-1,a[2]+n)).toISOString().slice(0,10);}
function isoDow(iso){var a=iso.split('-').map(Number);return new Date(Date.UTC(a[0],a[1]-1,a[2])).getUTCDay();}
function civil(iso){var a=iso.split('-').map(Number);return new Date(a[0],a[1]-1,a[2],12);}
var HMF=new Intl.DateTimeFormat('en-GB',{timeZone:TZ,hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
function hm(d){return d?HMF.format(d):'';}
function minsOf(s){if(!s)return 99999;var a=s.split(':');return (+a[0])*60+(+a[1]);}
function fmtShort(iso){if(!iso)return '';var a=iso.split('-');return (+a[2])+'/'+(+a[1]);}
function gregLong(iso,lg){return new Intl.DateTimeFormat((lg||lang)==='he'?'he-IL':'en-GB',{timeZone:'UTC',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date(iso+'T12:00:00Z'));}
function locale(lg){return (lg||lang)==='he'?'he-x-NoNikud':'en';}

/* ---------- calendar engine (Hebcal, runs in the page) ---------- */
var DI={};
function dayInfo(iso,shul){
  if(!H)return null;
  var key=iso+'|'+shul.lat+'|'+shul.lng+'|'+shul.candleMins+'|'+shul.havdalahMode+'|'+shul.havdalahMins;
  if(DI[key])return DI[key];
  var r=null;
  try{
    var loc=new H.Location(+shul.lat||31.7795,+shul.lng||35.3015,true,TZ,"Ma'ale Adumim",'IL');
    var dt=civil(iso),z=new H.Zmanim(loc,dt,false),hd=new H.HDate(dt);
    var opts={start:dt,end:dt,location:loc,il:true,candlelighting:true,candleLightingMins:(+shul.candleMins||30),sedrot:true,omer:true};
    if(shul.havdalahMode==='mins')opts.havdalahMins=(+shul.havdalahMins||40);else opts.havdalahDeg=8.5;
    var evs=[];try{evs=H.HebrewCalendar.calendar(opts);}catch(e){}
    var F=H.flags,mask=F.CHAG|F.MINOR_HOLIDAY|F.MAJOR_FAST|F.MINOR_FAST|F.ROSH_CHODESH|F.MODERN_HOLIDAY|F.CHOL_HAMOED|F.SPECIAL_SHABBAT|F.EREV;
    var candles=null,havdalah=null,parsha=null,omer=null,hol=[],chol=false,chag=false,rc=false;
    evs.forEach(function(e){
      if(e instanceof H.CandleLightingEvent)candles=e.eventTime;
      else if(e instanceof H.HavdalahEvent)havdalah=e.eventTime;
      else if(e instanceof H.ParshaEvent)parsha=e;
      else if(e instanceof H.OmerEvent)omer=e;
      else if(!(e instanceof H.TimedEvent)&&(e.getFlags()&mask)){hol.push(e);var f=e.getFlags();if(f&F.CHOL_HAMOED)chol=true;if(f&F.CHAG)chag=true;if(f&F.ROSH_CHODESH)rc=true;}
    });
    var zm={alot:z.alotHaShachar(),misheyakir:z.misheyakir(),netz:z.neitzHaChama(),shmaMGA:z.sofZmanShmaMGA(),shma:z.sofZmanShma(),tfillaMGA:z.sofZmanTfillaMGA(),tfilla:z.sofZmanTfilla(),chatzot:z.chatzot(),minchaGedola:z.minchaGedola(),minchaKetana:z.minchaKetana(),plag:z.plagHaMincha(),shkia:z.shkiah(),tzeit:z.tzeit(8.5)};
    r={iso:iso,hd:hd,zm:zm,candles:candles,havdalah:havdalah,parsha:parsha,omer:omer,hol:hol,chol:chol,chag:chag,rc:rc,loc:loc};
  }catch(e){r=null;}
  DI[key]=r;return r;
}
function zText(d,key){if(!d)return '';var ms=d.getTime();ms=ZDEADLINE[key]?Math.floor(ms/60000)*60000:Math.ceil(ms/60000)*60000;return hm(new Date(ms));}
function hebDate(di,lg){if(!di)return '';try{return (lg||lang)==='he'?di.hd.renderGematriya(true):di.hd.render('en');}catch(e){return '';}}
function seasonal(di,dow){
  if(!di)return [];
  var hd=di.hd,m=hd.getMonth(),d=hd.getDate(),out=[];
  var winter=(m===7&&d>=22)||(m>=8&&m<=13)||(m===1&&d<15);
  out.push(winter?'s_mashiv':'s_tal');
  var matar=(m===8&&d>=7)||(m>=9&&m<=13)||(m===1&&d<15);
  if(dow!==6)out.push(matar?'s_umatar':'s_bracha');
  if(di.rc||di.chol||di.chag)out.push('s_yaaleh');
  try{var cs=new H.HDate(25,9,hd.getFullYear());var diff=hd.abs()-cs.abs();var purim=di.hol.some(function(e){return /^Purim$/.test(e.getDesc());});if((diff>=0&&diff<=7)||purim)out.push('s_nissim');}catch(e){}
  try{var hl=H.HebrewCalendar.hallel(hd,true);if(hl===2)out.push('s_hallel2');else if(hl===1)out.push('s_hallel1');}catch(e){}
  if(dow!==6&&!di.chag){try{var tc=H.HebrewCalendar.tachanun(hd,true);if(tc.shacharit&&tc.mincha)out.push('s_tach');else if(tc.shacharit)out.push('s_tach_s');else out.push('s_notach');}catch(e){}}
  try{if(H.HebrewCalendar.eruvTavshilin(civil(di.iso),true))out.push('s_eruv');}catch(e){}
  return out;
}
function weekInfo(iso,shul){
  var dow=isoDow(iso),sat=isoAdd(iso,(6-dow+7)%7),fri=isoAdd(sat,-1);
  var dF=dayInfo(fri,shul),dS=dayInfo(sat,shul);
  return {fri:fri,sat:sat,candles:dF&&dF.candles,havdalah:dS&&dS.havdalah,parsha:dS&&dS.parsha,hol:dS?dS.hol:[]};
}
function parshaText(wk,lg){if(!wk)return '';if(wk.parsha)return wk.parsha.render(locale(lg));if(wk.hol&&wk.hol.length)return wk.hol[0].render(locale(lg));return '';}
function isShabbatNow(shul){if(!H)return false;try{var loc=new H.Location(+shul.lat||31.7795,+shul.lng||35.3015,true,TZ);return H.isAssurBemlacha(new Date(),loc,false);}catch(e){return false;}}

/* ---------- prayer & shiur times ---------- */
function baseDate(en,di,shul){
  if(!di)return null;
  switch(en.base){
    case 'candles':return di.candles||new Date(di.zm.shkia.getTime()-(+shul.candleMins||30)*60000);
    case 'havdalah':return di.havdalah||di.zm.tzeit;
    case 'sunset':return di.zm.shkia;
    case 'sunrise':return di.zm.netz;
    default:return di.zm[en.base]||null;
  }
}
function entryTime(en,iso,shul){
  if(en.mode!=='relative')return en.time||'';
  var b=baseDate(en,dayInfo(iso,shul),shul);if(!b)return '';
  var ms=Math.floor((b.getTime()+(+en.offset||0)*60000)/60000)*60000,step=300000;
  if(en.round==='down5')ms=Math.floor(ms/step)*step;else if(en.round==='up5')ms=Math.ceil(ms/step)*step;else if(en.round==='near5')ms=Math.round(ms/step)*step;
  return hm(new Date(ms));
}
function ruleText(en,lg){
  if(en.mode!=='relative')return '';
  var b=t('b_'+en.base,null,lg),n=+en.offset||0;
  if(!n)return t('rule_at',{b:b},lg);
  return n>0?t('rule_after',{n:n,b:b},lg):t('rule_before',{n:-n,b:b},lg);
}
function daysLabel(days,lg){
  days=(days||[]).slice().sort();if(!days.length)return '';if(days.length===7)return t('daily',null,lg);
  var names=DOW[(lg||lang)==='he'?'he':'en'],runs=[],s=days[0],p=days[0];
  for(var i=1;i<=days.length;i++){var c=days[i];if(c===p+1){p=c;continue;}runs.push([s,p]);s=c;p=c;}
  return runs.map(function(r){return r[0]===r[1]?names[r[0]]:(r[1]-r[0]===1?names[r[0]]+', '+names[r[1]]:names[r[0]]+'–'+names[r[1]]);}).join(', ');
}
function dayTimes(S,iso,inclShiur){
  var dow=isoDow(iso);
  return S.times.filter(function(e){return !e.hidden&&(e.days||[]).indexOf(dow)>=0&&(inclShiur||e.group!=='shiur');})
    .map(function(e){return {e:e,time:entryTime(e,iso,S.shul)};})
    .sort(function(a,b){return minsOf(a.time)-minsOf(b.time);});
}
function nextTefillah(S,now){
  var P=jp(now),nowM=P.hh*60+P.mm;
  for(var add=0;add<2;add++){
    var iso=isoAdd(P.iso,add),list=dayTimes(S,iso,false);
    for(var i=0;i<list.length;i++){var x=list[i];if(!x.time)continue;var diff=add*1440+minsOf(x.time)-nowM;if(diff>=0)return {e:x.e,time:x.time,mins:diff,tomorrow:add>0};}
  }
  return null;
}
function inText(mins){if(mins<60)return t('in_min',{n:mins});var h=Math.floor(mins/60),m=mins%60;return t('in_hm',{h:h,m:(m<10?'0':'')+m});}

/* ---------- content activity ---------- */
function inRange(it,iso){if(it.start&&iso<it.start)return false;if(it.end&&iso>it.end)return false;return true;}
function noticeOn(n,iso,dow,where){
  if(n.hidden)return false;if(where==='web'&&n.web===false)return false;if(where==='screen'&&n.screen===false)return false;
  if(!inRange(n,iso))return false;if(n.kind==='standard')return true;
  if(n.kind==='ongoing'&&n.days&&n.days.length&&n.days.indexOf(dow)<0)return false;return true;
}
function status(it,iso,kind){
  if(it.hidden)return ['off','st_hidden'];
  if(it.start&&iso<it.start)return ['warn','st_soon',{d:fmtShort(it.start)}];
  var end=it.end||it.until;if(end&&iso>end)return ['bad','st_past'];
  if(kind==='standard'&&!end)return ['','st_always'];
  return ['','st_on'];
}
function overlaps(it,a,b){var s=it.start||a,e=it.end||it.start||b;return s<=b&&e>=a;}
function sponsorsFor(S,iso){var wk=weekInfo(iso,S.shul);return S.sponsors.filter(function(s){return !s.hidden&&overlaps(s,iso,wk.sat);});}
var MAZAL_DAYS=14;
function mazalEnd(m){return m.end||(m.start?isoAdd(m.start,MAZAL_DAYS):'');}
function mazalFor(S,iso){return S.mazal.filter(function(m){var e=mazalEnd(m);return !m.hidden&&(!m.start||iso>=m.start)&&(!e||iso<=e);});}
function refuahFor(S,iso){return S.refuah.filter(function(r){return !r.hidden&&(!r.until||r.until>=iso);});}
function yahrzeitIso(y,fromIso){
  if(!H||!y.hday||!y.hmonth)return null;
  try{
    var mv=String(y.hmonth),month=mv==='12L'?12:+mv,leapRef=(mv==='12L'||mv==='13');
    var oy=+y.hyear||(leapRef?5784:5785);
    var orig=new H.HDate(+y.hday,month,oy);
    var cur=new H.HDate(civil(fromIso)).getFullYear();
    for(var hy=cur-1;hy<=cur+1;hy++){
      var a=H.HebrewCalendar.getYahrzeit(hy,orig);if(!a)continue;
      var g=a.greg(),iso=g.getFullYear()+'-'+String(g.getMonth()+1).padStart(2,'0')+'-'+String(g.getDate()).padStart(2,'0');
      if(iso>=fromIso&&iso<=isoAdd(fromIso,6))return {iso:iso,hd:a};
    }
  }catch(e){}
  return null;
}
function yahrzeitsFor(S,iso){var out=[];S.yahrzeit.forEach(function(y){if(y.hidden)return;var r=yahrzeitIso(y,iso);if(r)out.push({y:y,iso:r.iso,hd:r.hd});});return out.sort(function(a,b){return a.iso<b.iso?-1:1;});}
/* Flyers live in Firestore (images/{fid}, one data URL per document), or as static files shipped with the site (img.src). */
var BLANK='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
var IMGDATA={},IMGP={};
function imgSrc(img){if(!img)return '';if(img.data)return img.data;if(img.src)return img.src;if(img.fid)return IMGDATA[img.fid]||'';return '';}
function loadImage(fid){
  if(IMGDATA[fid])return Promise.resolve(IMGDATA[fid]);if(IMGP[fid])return IMGP[fid];if(!FB.db)return Promise.resolve('');
  IMGP[fid]=FB.db.collection('images').doc(fid).get().then(function(snap){
    var d=snap.exists?snap.data().data:'';
    if(d&&/^data:image\//.test(d)){IMGDATA[fid]=d;[].forEach.call(document.querySelectorAll('img[data-fid="'+fid+'"]'),function(el){el.src=d;el.removeAttribute('data-fid');});return d;}
    delete IMGP[fid];return '';
  }).catch(function(){delete IMGP[fid];return '';});
  return IMGP[fid];
}
function imgUrl(img){var s=imgSrc(img);if(s)return Promise.resolve(s);if(img&&img.fid)return loadImage(img.fid);return Promise.resolve('');}
function imgAttr(img){if(!img)return '';var s=imgSrc(img);if(s)return 'src="'+esc(s)+'"';if(img.fid){loadImage(img.fid);return 'src="'+BLANK+'" data-fid="'+esc(img.fid)+'"';}return '';}
function siteUrl(S){return safeUrl(S.shul.siteUrl)||(/^https?:/.test(location.protocol)?location.origin+location.pathname:'');}
var QRC={};
function qrSvg(text){
  text=String(text||'');if(!text||!window.qrcode)return '';if(QRC[text])return QRC[text];
  try{var q=window.qrcode(0,'M');q.addData(text);q.make();QRC[text]=q.createSvgTag({cellSize:4,margin:2,scalable:true});}catch(e){QRC[text]='';}
  return QRC[text];
}
var SPRIG='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 30V9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 21c-4.6-.4-8-3.6-8.6-8.4 4.7.3 8.2 3.6 8.6 8.4z" fill="currentColor" opacity=".9"/><path d="M16 15.5c3.9-.5 6.8-3.6 7-7.7-4 .4-6.9 3.5-7 7.7z" fill="currentColor" opacity=".7"/><path d="M16 26c4.3-.1 7.6-2.4 9-6.2-4.3-.4-7.8 2-9 6.2z" fill="currentColor" opacity=".55"/><circle cx="16" cy="7" r="1.7" fill="currentColor"/></svg>';

/* ---------- routing & render ---------- */
function route(){var h=(location.hash||'').slice(1);return (h==='display'||h==='manage')?h:'home';}
function render(){
  var r=route(),root=document.documentElement;
  clearTimeout(ui.slideTimer);ui.slideTimer=null;
  if(!ui.ready){root.classList.remove('tv-mode');$app.innerHTML='<div class="loading">'+SPRIG+'<span>'+esc(t('loading'))+'</span></div>';return;}
  root.classList.toggle('tv-mode',r==='display');
  if(r==='display'){var S=screenState();var dl=S.display.lang;root.lang=dl==='en'?'en':'he';root.dir=dl==='en'?'ltr':'rtl';$app.innerHTML=renderDisplay(S);fitSide();startSlides(S);keepAwake();armFs();return;}
  root.lang=lang;root.dir=lang==='he'?'rtl':'ltr';
  $app.innerHTML=(r==='manage'?renderManage():renderHome());
}
function screenState(){return ui.previewDraft?normalize(clone(draft)):state;}

function header(){
  var S=state,r=route();
  var nav=r==='home'?'<nav class="nav" aria-label="sections">'+[['sec-times','nav_times'],['sec-zmanim','nav_zmanim'],['sec-notices','nav_notices'],['sec-community','nav_community'],['sec-donate','nav_donate'],['sec-contact','nav_contact']].map(function(n){return '<button data-act="go" data-to="'+n[0]+'">'+esc(t(n[1]))+'</button>';}).join('')+'</nav>':'<span class="nav"></span>';
  return '<header class="top"><div class="wrap top-in">'+
    '<button class="brand" data-act="nav" data-to="">'+SPRIG+'<span><b>'+esc(pick(S.shul,'name'))+'</b><small>'+esc(pick(S.shul,'kind')||t('kind'))+' · '+esc(t('city'))+'</small></span></button>'+nav+
    '<div class="top-tools"><div class="lang" role="group" aria-label="language"><button data-act="lang" data-lang="he" aria-pressed="'+(lang==='he')+'">עברית</button><button data-act="lang" data-lang="en" aria-pressed="'+(lang==='en')+'">English</button></div>'+
    (r==='manage'?'<button class="btn sm" data-act="nav" data-to="">'+esc(t('site_view'))+'</button>':(FB.role?'<button class="btn sm primary" data-act="nav" data-to="manage">'+esc(t('board'))+'</button>':''))+
    '</div></div></header>';
}
function urgentHtml(S,iso,tv){
  var u=S.urgent;if(!u||!u.on)return '';if(u.until&&iso>u.until)return '';
  var txt=tv?(S.display.lang==='en'?esc(pick(u,'text','en')):S.display.lang==='both'?esc(pick(u,'text','he'))+(u.textEn?' · '+esc(u.textEn):''):esc(pick(u,'text','he'))):esc(pick(u,'text'));
  if(!txt)return '';
  return tv?'<div class="tv-urgent" role="alert">'+txt+'</div>':'<div class="urgent" role="alert"><b>!</b><span>'+txt+'</span></div>';
}

/* ---------- public site ---------- */
function renderHome(){
  var S=state,now=new Date(),P=jp(now),iso=P.iso,di=dayInfo(iso,S.shul),wk=weekInfo(iso,S.shul);
  if(!ui.zDate)ui.zDate=iso;
  return header()+'<div class="wrap">'+urgentHtml(S,iso,false)+hero(S,P,di,wk)+'</div><main class="wrap sections">'+
    secTimes(S,P,wk)+secZmanim(S,P)+secNotices(S,iso,P.dow)+secCommunity(S,iso)+secShiurim(S)+secDonate(S)+secContact(S)+
    '</main><footer class="wrap foot"><span>© '+esc(pick(S.shul,'name'))+' · '+esc(pick(S.shul,'address'))+'</span><span style="display:flex;gap:14px;flex-wrap:wrap"><button class="linkbtn" data-act="nav" data-to="display">'+esc(t('foot_screen'))+'</button>'+'<button class="linkbtn" data-act="nav" data-to="manage">'+esc(FB.role?t('board'):t('foot_board'))+'</button></span></footer>';
}
function hero(S,P,di,wk){
  var nx=nextTefillah(S,new Date()),chips=seasonal(di,P.dow),pt=parshaText(wk);
  var hol=di?di.hol.map(function(e){return e.render(locale());}):[];
  if(di&&di.omer)hol.push(di.omer.render(locale()));
  return '<section class="hero"><div><div class="eyebrow">'+esc(pick(S.shul,'kind')||t('kind'))+' · '+esc(t('city'))+'</div>'+
    '<h1>'+esc(pick(S.shul,'name'))+(lang==='he'&&S.shul.nameEn?'<span class="en-name">'+esc(S.shul.nameEn)+'</span>':'')+(lang==='en'&&S.shul.nameHe?'<span class="en-name">'+esc(S.shul.nameHe)+'</span>':'')+'</h1>'+
    '<p class="lead">'+esc(pick(S.shul,'tagline'))+'</p>'+
    '<p class="verse">וְכֹל שִׂיחַ הַשָּׂדֶה טֶרֶם יִהְיֶה בָאָרֶץ<small>'+esc(t('verse_src'))+'</small></p>'+
    '<div class="hero-actions"><button class="btn primary" data-act="go" data-to="sec-times">'+esc(t('nav_times'))+'</button><button class="btn" data-act="go" data-to="sec-donate">'+esc(t('nav_donate'))+'</button><button class="btn ghost" data-act="go" data-to="sec-contact">'+esc(t('nav_contact'))+'</button></div></div>'+
    '<aside class="ledger" aria-label="'+esc(t('today'))+'"><div class="ledger-date"><div class="hd">'+esc(hebDate(di))+'</div><div class="gd">'+esc(gregLong(P.iso))+'</div></div><dl>'+
    '<div><dt>'+esc(t('next'))+'</dt><dd id="live-next">'+nextHtml(nx)+'</dd></div>'+
    (pt?'<div><dt>'+esc(t('parsha'))+'</dt><dd>'+esc(pt)+'</dd></div>':'')+
    (wk.candles?'<div><dt>'+esc(t('candles'))+' <span class="muted small">'+esc(fmtShort(wk.fri))+'</span></dt><dd class="tn"><span class="big">'+hm(wk.candles)+'</span></dd></div>':'')+
    (wk.havdalah?'<div><dt>'+esc(t('havdalah'))+'</dt><dd class="tn">'+hm(wk.havdalah)+'</dd></div>':'')+
    '</dl>'+((chips.length||hol.length)?'<div class="chips">'+hol.map(function(h){return '<span class="chip sage">'+esc(h)+'</span>';}).join('')+chips.map(function(c){return '<span class="chip">'+esc(t(c))+'</span>';}).join('')+'</div>':'')+'</aside></section>';
}
function nextHtml(nx){if(!nx)return '<span class="muted">'+esc(t('none_today'))+'</span>';return esc(pick(nx.e,'name'))+' · <span class="tn big">'+esc(nx.time)+'</span><small>'+esc(nx.tomorrow?t('tomorrow'):inText(nx.mins))+'</small>';}
function schedRow(e,time,extra){
  var note=pick(e,'note'),rule=ruleText(e);
  return '<tr><th>'+esc(pick(e,'name'))+(e.group==='shiur'&&pick(e,'teacher')?'<span class="note">'+esc(pick(e,'teacher'))+'</span>':'')+(note?'<span class="note">'+esc(note)+'</span>':'')+'</th><td class="d">'+(extra||'')+'</td><td class="t tn">'+esc(time||'—')+(rule?'<span class="rule">'+esc(rule)+'</span>':'')+'</td></tr>';
}
function secTimes(S,P,wk){
  var wd=S.times.filter(function(e){return !e.hidden&&e.group==='weekday';}).map(function(e){var dd=(e.days||[]).indexOf(P.dow)>=0?P.iso:isoAdd(P.iso,1);return {e:e,time:entryTime(e,dd,S.shul)};}).sort(function(a,b){return minsOf(a.time)-minsOf(b.time);});
  var sh=S.times.filter(function(e){return !e.hidden&&e.group==='shabbat';}).map(function(e){var d=(e.days||[]).indexOf(5)>=0&&(e.days||[]).indexOf(6)<0?wk.fri:wk.sat;var dw=(e.days||[]).indexOf(5)>=0&&(e.days||[]).indexOf(6)<0?5:6;return {e:e,dw:dw,time:entryTime(e,d,S.shul)};}).sort(function(a,b){return a.dw-b.dw||minsOf(a.time)-minsOf(b.time);});
  return '<section id="sec-times"><div class="sec-head"><h2>'+esc(t('nav_times'))+'</h2><p>'+esc(t('times_note'))+'</p></div><div class="grid2">'+
    '<div class="card"><h3>'+esc(t('weekday'))+'</h3>'+(wd.length?'<table class="sched">'+wd.map(function(x){return schedRow(x.e,x.time,esc(daysLabel(x.e.days)));}).join('')+'</table>':'<p class="empty">—</p>')+'</div>'+
    '<div class="card"><h3>'+esc(t('shabbat'))+' <small>'+esc(parshaText(wk))+' · '+esc(fmtShort(wk.sat))+'</small></h3>'+(sh.length?'<table class="sched">'+(wk.candles?'<tr><th>'+esc(t('candles'))+'</th><td class="d">'+esc(t('erev_shabbat'))+'</td><td class="t tn">'+hm(wk.candles)+'</td></tr>':'')+sh.map(function(x){return schedRow(x.e,x.time,esc(t(x.dw===5?'erev_shabbat':'shabbat_day')));}).join('')+(wk.havdalah?'<tr><th>'+esc(t('havdalah'))+'</th><td class="d">'+esc(t('shabbat_day'))+'</td><td class="t tn">'+hm(wk.havdalah)+'</td></tr>':'')+'</table>':'<p class="empty">—</p>')+'</div>'+
    '</div></section>';
}
function secZmanim(S,P){
  var iso=ui.zDate||P.iso,di=dayInfo(iso,S.shul),isToday=iso===P.iso,nowMs=Date.now();
  var body;
  if(!di)body='<p class="empty">'+esc(t('zm_unavail'))+'</p>';
  else body='<div class="zgrid">'+ZKEYS.map(function(k){var d=di.zm[k];var cls='';if(isToday&&d){var diff=d.getTime()-nowMs;if(diff<0)cls='past';else if(diff<3600000)cls='soon';}return '<div class="'+cls+'"><span>'+esc(t('zm_'+k))+'</span><b class="tn">'+zText(d,k)+'</b></div>';}).join('')+'</div>';
  return '<section id="sec-zmanim"><div class="sec-head"><div><h2>'+esc(t('zm_title'))+'</h2><p>'+esc(hebDate(di))+' · '+esc(gregLong(iso))+'</p></div>'+
    '<div class="zbar"><button class="btn sm" data-act="zday" data-n="-1" aria-label="'+esc(t('prev_day'))+'">'+(lang==='he'?'→':'←')+'</button>'+(isToday?'':'<button class="btn sm" data-act="zday" data-n="0">'+esc(t('back_today'))+'</button>')+'<button class="btn sm" data-act="zday" data-n="1" aria-label="'+esc(t('next_day'))+'">'+(lang==='he'?'←':'→')+'</button></div></div>'+
    body+'<p class="muted small" style="margin-top:8px">'+esc(t('zm_note'))+'</p></section>';
}
function secNotices(S,iso,dow){
  var list=S.notices.filter(function(n){return noticeOn(n,iso,dow,'web');}).sort(function(a,b){var o={timed:0,ongoing:1,standard:2};return (o[a.kind]-o[b.kind])||((a.start||'')<(b.start||'')?-1:1);});
  return '<section id="sec-notices"><div class="sec-head"><h2>'+esc(t('notices'))+'</h2></div>'+
    (list.length?'<div class="notices">'+list.map(function(n){var ia=imgAttr(n.image),title=pick(n,'title'),body=pick(n,'body');
      var when=n.kind==='ongoing'&&n.days&&n.days.length?t('every',{d:daysLabel(n.days)}):(n.end?t('until',{d:fmtShort(n.end)}):'');
      return '<article class="notice">'+(ia?'<img '+ia+' alt="'+esc(title||t('f_image'))+'" loading="lazy">':'')+'<div class="notice-b">'+(when?'<span class="pill">'+esc(when)+'</span>':'')+(title?'<h3>'+esc(title)+'</h3>':'')+(body?'<p>'+esc(body)+'</p>':'')+'</div></article>';}).join('')+'</div>':'<p class="empty">'+esc(t('no_notices'))+'</p>')+'</section>';
}
function sponsorLine(s,lg){var by=pick(s,'by',lg),fr=pick(s,'for',lg);return '<li><span class="k">'+esc(t('sp_'+(s.type||'general'),null,lg))+(s.start?' · '+esc(fmtShort(s.start)):'')+'</span>'+(by?esc(t('sp_by',null,lg))+' '+esc(by):'')+(fr?(by?' — ':'')+esc(fr):'')+'</li>';}
function secCommunity(S,iso){
  var sp=sponsorsFor(S,iso),mz=mazalFor(S,iso),yz=yahrzeitsFor(S,iso),rf=refuahFor(S,iso);
  var hasKiddush=sp.some(function(s){return s.type==='kiddush';});
  var cards='<div class="card"><h3>'+esc(t('sponsors'))+'</h3>'+(sp.length?'<ul class="list">'+sp.map(function(s){return sponsorLine(s);}).join('')+'</ul>':'')+
    (!hasKiddush?'<div class="cta"><span>'+esc(t('no_sponsor_kiddush'))+'</span><button class="btn sm primary" data-act="go" data-to="sec-donate" style="justify-self:start">'+esc(t('sponsor_cta'))+'</button></div>':'')+'</div>';
  cards+='<div class="card"><h3>'+esc(t('mazal'))+'</h3>'+(mz.length?'<ul class="list">'+mz.map(function(m){return '<li>'+esc(pick(m,'text'))+'</li>';}).join('')+'</ul>':'<p class="empty">'+esc(t('no_mazal'))+'</p>')+'</div>';
  cards+='<div class="card"><h3>'+esc(t('yahrzeit'))+'</h3>'+(yz.length?'<ul class="list">'+yz.map(function(x){return '<li><span class="k">'+esc(lang==='he'?x.hd.renderGematriya(true):x.hd.render('en'))+' · '+esc(fmtShort(x.iso))+'</span>'+esc(pick(x.y,'name'))+(pick(x.y,'rel')?' <span class="muted small">('+esc(pick(x.y,'rel'))+')</span>':'')+'</li>';}).join('')+'</ul>':'<p class="empty">'+esc(t('no_yahrzeit'))+'</p>')+'</div>';
  if(rf.length)cards+='<div class="card" style="grid-column:1/-1"><h3>'+esc(t('refuah'))+'</h3><div class="names">'+rf.map(function(r){return '<span>'+esc(r.name)+'</span>';}).join('')+'</div></div>';
  return '<section id="sec-community"><div class="sec-head"><h2>'+esc(t('community'))+'</h2></div><div class="grid3">'+cards+'</div></section>';
}
function secShiurim(S){
  var list=S.times.filter(function(e){return !e.hidden&&e.group==='shiur';});if(!list.length)return '';
  var today=jp().iso;
  return '<section id="sec-shiurim"><div class="sec-head"><h2>'+esc(t('shiurim'))+'</h2></div><div class="card"><table class="sched">'+list.map(function(e){var d=(e.days||[])[0];var iso=d==null?today:isoAdd(today,((d-isoDow(today))+7)%7);return schedRow(e,entryTime(e,iso,S.shul),esc(daysLabel(e.days)));}).join('')+'</table></div></section>';
}
function payCard(label,link,qrText,sub){
  var q=qrText?qrSvg(qrText):'';
  return '<div class="card pay">'+(q?'<div class="qr" aria-hidden="true">'+q+'</div>':'')+'<div style="display:grid;gap:8px;min-width:0"><h3 style="margin:0">'+esc(label)+'</h3>'+(sub||'')+(link?'<a class="btn primary" style="justify-self:start" href="'+esc(link)+'" target="_blank" rel="noopener">'+esc(label)+'</a>':'')+'</div></div>';
}
function copyRow(txt){return '<div class="copyrow"><code>'+esc(txt)+'</code><button class="btn sm" data-act="copy" data-text="'+esc(txt)+'">'+esc(t('copy'))+'</button></div>';}
function secDonate(S){
  var d=S.donate,bit=safeUrl(d.bitLink),pb=safeUrl(d.payboxLink),ot=safeUrl(d.otherLink),cards='';
  if(bit||d.bitPhone)cards+=payCard(t('pay_bit'),bit,bit,d.bitPhone?'<span class="muted small">'+esc(t('bit_phone'))+'</span>'+copyRow(d.bitPhone):'');
  if(pb)cards+=payCard(t('pay_paybox'),pb,pb,'');
  if(ot)cards+=payCard(pick(d,'otherLabel')||t('donate'),ot,ot,'');
  if(pick(d,'bank'))cards+='<div class="card"><h3>'+esc(t('bank'))+'</h3><p style="white-space:pre-line">'+esc(pick(d,'bank'))+'</p></div>';
  return '<section id="sec-donate"><div class="sec-head"><div><h2>'+esc(t('donate'))+'</h2><p>'+esc(t('donate_lead'))+'</p></div></div>'+
    (cards?'<div class="donate">'+cards+'</div>':'<p class="empty">'+esc(t('no_donate'))+'</p>')+(pick(d,'note')?'<p class="muted small" style="margin-top:10px">'+esc(pick(d,'note'))+'</p>':'')+'</section>';
}
function secContact(S){
  var s=S.shul,addr=pick(s,'address'),q=encodeURIComponent((s.addressHe||addr||'')),wa=safeUrl(s.whatsapp);
  var people=[['rabbi',pick(s,'rabbi')],['gabbai',pick(s,'gabbai')],['nusach',pick(s,'nusach')]].filter(function(p){return p[1];});
  return '<section id="sec-contact"><div class="sec-head"><h2>'+esc(t('contact'))+'</h2></div><div class="contact">'+
    '<div class="card"><h3>'+esc(t('address'))+'</h3><p style="font-size:1.15rem;font-weight:600">'+esc(addr)+'</p>'+(pick(s,'directions')?'<p class="muted">'+esc(pick(s,'directions'))+'</p>':'')+
    '<div class="hero-actions" style="margin-top:14px"><a class="btn primary" target="_blank" rel="noopener" href="https://waze.com/ul?ll='+(+s.lat)+','+(+s.lng)+'&navigate=yes">'+esc(t('waze'))+'</a><a class="btn" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query='+q+'">'+esc(t('gmaps'))+'</a></div></div>'+
    '<div class="card"><h3>'+esc(pick(s,'about')?t('about'):t('nav_contact'))+'</h3>'+(pick(s,'about')?'<p style="white-space:pre-line;margin-bottom:12px">'+esc(pick(s,'about'))+'</p>':'')+
    '<ul class="list">'+people.map(function(p){return '<li><span class="k">'+esc(t(p[0]))+'</span>'+esc(p[1])+'</li>';}).join('')+
    (s.phone?'<li><span class="k">'+esc(t('phone'))+'</span>'+copyRow(s.phone)+'</li>':'')+(s.email?'<li><span class="k">'+esc(t('email'))+'</span>'+copyRow(s.email)+'</li>':'')+
    (wa?'<li><a class="btn sm" href="'+esc(wa)+'" target="_blank" rel="noopener">'+esc(t('whatsapp'))+'</a></li>':'')+'</ul>'+
    ((!people.length&&!s.phone&&!s.email&&!wa&&!pick(s,'about'))?'<p class="empty">'+esc(pick(s,'tagline'))+'</p>':'')+'</div></div></section>';
}

/* ---------- TV display ---------- */
function TL(S,k,vars){var m=S.display.lang;return m==='both'?both(k,vars):esc(t(k,vars,m==='en'?'en':'he'));}
function TP(S,o,b){var m=S.display.lang;if(m==='both'){var h=pick(o,b,'he'),e=o[b+'En'];return esc(h)+(e&&e!==h?'<span class="en">'+esc(e)+'</span>':'');}return esc(pick(o,b,m==='en'?'en':'he'));}
function tvLang(S){return S.display.lang==='en'?'en':'he';}
function renderDisplay(S){
  var P=jp(),still=S.display.shabbatMode==='still'&&isShabbatNow(S.shul);ui.stillFlag=still;
  return (ui.previewDraft?'<div class="preview-bar">'+esc(t('preview_on'))+'<button class="btn sm" data-act="endpreview">'+esc(t('back_edit'))+'</button></div>':'')+
    '<button class="tv-fs" data-act="fs">'+esc(t('fullscreen',null,tvLang(S)))+'</button>'+
    '<div class="tv">'+urgentHtml(S,P.iso,true)+'<aside class="tv-side" id="tv-side">'+tvSide(S,still)+'</aside><main class="tv-stage" id="tv-stage" aria-live="polite">'+(still?stillBoard(S):'')+'</main><footer class="tv-foot" id="tv-foot">'+tvFoot(S)+'</footer></div>';
}
function tvSide(S,still){
  var now=new Date(),P=jp(now),di=dayInfo(P.iso,S.shul),wk=weekInfo(P.iso,S.shul),lg=tvLang(S),bothM=S.display.lang==='both';
  var nowM=P.hh*60+P.mm,list=dayTimes(S,P.iso,false),nx=nextTefillah(S,now);
  var zk=(S.display.zmanim||[]).filter(function(k){return ZKEYS.indexOf(k)>=0;});
  var hol=di?di.hol.map(function(e){return e.render(locale(lg));}):[],pt=parshaText(wk,lg);
  var chips=seasonal(di,P.dow);
  return '<div class="tv-brand">'+SPRIG+'<div><b>'+TP(S,S.shul,'name')+'</b><small>'+esc(t('kind',null,lg))+' · '+esc(t('city',null,lg))+'</small></div></div>'+
    (still?'':'<div class="tv-clock tn" id="tv-clock">'+String(P.hh).padStart(2,'0')+':'+String(P.mm).padStart(2,'0')+'</div>')+
    '<div class="tv-dates"><div class="h">'+esc(hebDate(di,lg))+'</div><div class="g">'+esc(gregLong(P.iso,lg))+(pt?' · '+esc(pt):'')+(hol.length?' · '+esc(hol.join(' · ')):'')+'</div></div>'+
    (chips.length?'<div class="tv-chips">'+chips.map(function(c){return '<span>'+esc(t(c,null,lg))+'</span>';}).join('')+'</div>':'')+
    (!still&&nx?'<div class="tv-next"><span><small>'+TL(S,'next')+'</small> '+TP(S,nx.e,'name')+'</span><span style="text-align:end;white-space:nowrap"><b class="tn">'+esc(nx.time)+'</b> <small>'+esc(nx.tomorrow?t('tomorrow',null,lg):(nx.mins<60?t('in_min',{n:nx.mins},lg):t('in_hm',{h:Math.floor(nx.mins/60),m:String(nx.mins%60).padStart(2,'0')},lg)))+'</small></span></div>':'')+
    (list.length?'<div class="tv-block"><h3>'+TL(S,'today')+'</h3><div class="tv-rows">'+list.map(function(x){return '<div class="'+(minsOf(x.time)<nowM&&!still?'past':'')+'"><span>'+TP(S,x.e,'name')+'</span><b class="tn">'+esc(x.time||'—')+'</b></div>';}).join('')+'</div></div>':'')+
    (di&&zk.length?'<div class="tv-block"><h3>'+TL(S,'zm_title')+'</h3><div class="tv-rows two">'+zk.map(function(k){var d=di.zm[k];return '<div class="'+(d&&d.getTime()<now.getTime()&&!still?'past':'')+'"><span>'+(bothM?esc(t('zm_'+k,null,'he')):esc(t('zm_'+k,null,lg)))+'</span><b class="tn">'+zText(d,k)+'</b></div>';}).join('')+'</div></div>':'');
}
function tvFoot(S){
  var lg=tvLang(S),iso=jp().iso,wk=weekInfo(iso,S.shul),url=siteUrl(S),q=S.display.showQr&&url?qrSvg(url):'';
  return '<div class="fl">'+(q?'<div class="qr">'+q+'</div><span>'+TL(S,'scan_site')+'</span>':'<span>'+esc(pick(S.shul,'address',lg))+'</span>')+'</div>'+
    '<div class="shab">'+(wk.candles?'<span>'+TL(S,'candles')+' '+esc(fmtShort(wk.fri))+' <b class="tn">'+hm(wk.candles)+'</b></span>':'')+(wk.havdalah?'<span>'+TL(S,'havdalah')+' <b class="tn">'+hm(wk.havdalah)+'</b></span>':'')+'</div>';
}
function slidesFor(S){
  var P=jp(),iso=P.iso,lg=tvLang(S),out=[],secs=Math.max(5,+S.display.slideSecs||12);
  S.notices.filter(function(n){return noticeOn(n,iso,P.dow,'screen');}).forEach(function(n){
    var ia=imgAttr(n.image),title=TP(S,n,'title'),body=TP(S,n,'body'),s=Math.max(5,+n.secs||secs);
    if(ia&&!title&&!body)out.push({cls:'img',html:'<img '+ia+' alt="">',secs:s,img:n.image});
    else if(ia)out.push({cls:'split',html:'<img '+ia+' alt=""><div class="fitcol">'+(title?'<h2>'+title+'</h2>':'')+(body?'<div class="body">'+body+'</div>':'')+'</div>',secs:s,img:n.image});
    else out.push({cls:'',html:'<div class="kick">'+TL(S,'notices')+'</div>'+(title?'<h2>'+title+'</h2>':'')+(body?'<div class="body">'+body+'</div>':''),secs:s});
  });
  var dow=P.dow;
  if(dow===4||dow===5||dow===6){
    var wk=weekInfo(iso,S.shul),rows='';
    if(wk.candles)rows+='<div><span>'+TL(S,'candles')+'</span><b class="tn">'+hm(wk.candles)+'</b></div>';
    S.times.filter(function(e){return !e.hidden&&e.group==='shabbat';}).map(function(e){var f=(e.days||[]).indexOf(5)>=0&&(e.days||[]).indexOf(6)<0;return {e:e,f:f,time:entryTime(e,f?wk.fri:wk.sat,S.shul)};}).sort(function(a,b){return (a.f?0:1)-(b.f?0:1)||minsOf(a.time)-minsOf(b.time);}).forEach(function(x){rows+='<div><span>'+TP(S,x.e,'name')+'</span><b class="tn">'+esc(x.time)+'</b></div>';});
    if(wk.havdalah)rows+='<div><span>'+TL(S,'havdalah')+'</span><b class="tn">'+hm(wk.havdalah)+'</b></div>';
    out.push({cls:'',html:'<div class="kick">'+TL(S,'shabbat')+'</div><h2>'+esc(parshaText(wk,lg))+'</h2><div class="big-rows">'+rows+'</div>',secs:secs});
  }
  var sp=sponsorsFor(S,iso);
  if(sp.length)out.push({cls:'',html:'<div class="kick">'+TL(S,'sponsors')+'</div><div class="sp">'+sp.map(function(s){var by=TP(S,s,'by'),fr=TP(S,s,'for');return '<div><span>'+TL(S,'sp_'+(s.type||'general'))+'</span>'+(by?TL(S,'sp_by')+' '+by:'')+(fr?(by?' — ':'')+fr:'')+'</div>';}).join('')+'</div>',secs:secs});
  var mz=mazalFor(S,iso);
  if(mz.length)out.push({cls:'',html:'<div class="kick">'+TL(S,'this_week')+'</div><h2>'+TL(S,'mazal')+'</h2><div class="sp">'+mz.map(function(m){return '<div>'+TP(S,m,'text')+'</div>';}).join('')+'</div>',secs:secs});
  var yz=yahrzeitsFor(S,iso);
  if(yz.length)out.push({cls:'',html:'<div class="kick">'+TL(S,'this_week')+'</div><h2>'+TL(S,'yahrzeit')+'</h2><div class="big-rows">'+yz.map(function(x){return '<div><span>'+TP(S,x.y,'name')+(pick(x.y,'rel',lg)?'<small>'+esc(pick(x.y,'rel',lg))+'</small>':'')+'</span><b>'+esc(lg==='he'?x.hd.renderGematriya(true):x.hd.render('en'))+'</b></div>';}).join('')+'</div>',secs:secs});
  var rf=refuahFor(S,iso);
  if(rf.length)out.push({cls:'',html:'<h2>'+TL(S,'refuah')+'</h2><div class="names">'+rf.map(function(r){return '<span>'+esc(r.name)+'</span>';}).join('')+'</div>',secs:secs});
  var sh=S.times.filter(function(e){return !e.hidden&&e.group==='shiur';});
  if(sh.length)out.push({cls:'',html:'<h2>'+TL(S,'shiurim')+'</h2><div class="big-rows">'+sh.map(function(e){var d=(e.days||[])[0];var di2=d==null?iso:isoAdd(iso,((d-dow)+7)%7);return '<div><span>'+TP(S,e,'name')+'<small>'+esc(daysLabel(e.days,lg))+(pick(e,'teacher',lg)?' · '+esc(pick(e,'teacher',lg)):'')+'</small></span><b class="tn">'+esc(entryTime(e,di2,S.shul))+'</b></div>';}).join('')+'</div>',secs:secs});
  var d=S.donate,bit=safeUrl(d.bitLink),pb=safeUrl(d.payboxLink),ot=safeUrl(d.otherLink);
  if(S.display.showDonate&&(bit||pb||ot||d.bitPhone)){
    var figs='';
    if(bit)figs+='<figure><div class="qr">'+qrSvg(bit)+'</div>'+TL(S,'bit')+'</figure>';
    if(pb)figs+='<figure><div class="qr">'+qrSvg(pb)+'</div>'+TL(S,'paybox')+'</figure>';
    if(ot)figs+='<figure><div class="qr">'+qrSvg(ot)+'</div>'+(TP(S,d,'otherLabel')||TL(S,'donate'))+'</figure>';
    out.push({cls:'',html:'<div class="kick">'+TL(S,'scan')+'</div><h2>'+TL(S,'donate')+'</h2><div class="body">'+TL(S,'donate_lead')+(d.bitPhone?'<br>'+TL(S,'bit')+' · <span class="tn">'+esc(d.bitPhone)+'</span>':'')+'</div><div class="pays">'+figs+'</div>',secs:secs});
  }
  if(!out.length)out.push({cls:'welcome',html:'<div>'+SPRIG.replace('<svg','<svg style="width:12vmin;height:12vmin;color:var(--tv-sage)"')+'</div><h2>'+TL(S,'welcome')+'</h2><p>וְכֹל שִׂיחַ הַשָּׂדֶה טֶרֶם יִהְיֶה בָאָרֶץ</p>',secs:secs});
  return out;
}
function stillBoard(S){
  var P=jp(),iso=P.iso,wk=weekInfo(iso,S.shul),lg=tvLang(S),cards='';
  var rows='';if(wk.candles)rows+='<div><span>'+TL(S,'candles')+'</span><b class="tn">'+hm(wk.candles)+'</b></div>';
  S.times.filter(function(e){return !e.hidden&&e.group==='shabbat';}).forEach(function(e){var f=(e.days||[]).indexOf(5)>=0&&(e.days||[]).indexOf(6)<0;rows+='<div><span>'+TP(S,e,'name')+'</span><b class="tn">'+esc(entryTime(e,f?wk.fri:wk.sat,S.shul))+'</b></div>';});
  if(wk.havdalah)rows+='<div><span>'+TL(S,'havdalah')+'</span><b class="tn">'+hm(wk.havdalah)+'</b></div>';
  S.notices.filter(function(n){return n.shabbat&&noticeOn(n,iso,P.dow,'screen');}).forEach(function(n){cards+='<div><h3>'+TP(S,n,'title')+'</h3><p>'+TP(S,n,'body')+'</p></div>';});
  var sp=sponsorsFor(S,iso);if(sp.length)cards+='<div><h3>'+TL(S,'sponsors')+'</h3><p>'+sp.map(function(s){return TL(S,'sp_'+(s.type||'general'))+': '+(TP(S,s,'by')||'')+(TP(S,s,'for')?' — '+TP(S,s,'for'):'');}).join('\n')+'</p></div>';
  return '<div class="slide"><div class="kick">'+TL(S,'shabbat')+'</div><h2>'+esc(parshaText(wk,lg))+'</h2><div class="big-rows">'+rows+'</div>'+(cards?'<div class="still-grid">'+cards+'</div>':'')+'</div>';
}
var fsIdle=null;
function armFs(){var b=document.querySelector('.tv-fs');if(!b)return;b.classList.remove('idle');clearTimeout(fsIdle);fsIdle=setTimeout(function(){var x=document.querySelector('.tv-fs');if(x)x.classList.add('idle');},8000);}
document.addEventListener('pointermove',function(){if(route()==='display')armFs();});
/* Fit to the screen: text shrinks until nothing is cut off; a flyer is never cropped,
   and takes over the whole screen while it shows when that makes it noticeably bigger. */
var IMGC={};
function preload(src){if(!src)return null;var im=IMGC[src];if(!im){im=new Image();im.src=src;IMGC[src]=im;}return im;}
function fitText(el){
  if(!el)return;
  var boxes=[el].concat([].slice.call(el.querySelectorAll('.fitcol,.still-grid>div')));
  var over=function(){for(var i=0;i<boxes.length;i++){if(boxes[i].scrollHeight>boxes[i].clientHeight+2)return true;}return false;};
  var f=1;el.style.setProperty('--fit','1');
  while(f>0.36&&over()){f-=0.04;el.style.setProperty('--fit',f.toFixed(2));}
}
/* Shrink the info column evenly until every list fits (e.g. when the urgent banner takes a row). */
function fitSide(){
  var side=document.getElementById('tv-side');if(!side||!side.offsetParent)return;
  var over=function(){if(side.scrollHeight>side.clientHeight+2)return true;var b=side.querySelectorAll('.tv-block');for(var i=0;i<b.length;i++){if(b[i].scrollHeight>b[i].clientHeight+2)return true;}return false;};
  var z=1;side.style.setProperty('--sz','1');
  while(z>0.6&&over()){z-=0.03;side.style.setProperty('--sz',z.toFixed(2));}
}
function fitFlyer(S,im){
  var tv=document.querySelector('.tv'),stage=document.getElementById('tv-stage');if(!tv||!stage)return;
  var was=tv.classList.contains('full');tv.classList.remove('full');
  var w=im.naturalWidth,h=im.naturalHeight;
  if(w&&h&&S.display.flyerFull!==false){
    var a=Math.min(stage.clientWidth/w,stage.clientHeight/h);
    tv.classList.add('full');
    var b=Math.min(stage.clientWidth/w,stage.clientHeight/h);
    if(b<a*1.15)tv.classList.remove('full');
  }
  if(was&&!tv.classList.contains('full'))fitSide();
}
function startSlides(S){
  var tv=document.querySelector('.tv');if(tv&&tv.classList.contains('full')){tv.classList.remove('full');fitSide();}
  if(ui.stillFlag){fitText(document.querySelector('#tv-stage .slide'));return;}
  var stage=document.getElementById('tv-stage');if(!stage)return;
  var list=slidesFor(S);if(ui.slide>=list.length)ui.slide=0;
  var s=list[ui.slide];
  stage.innerHTML='<div class="slide '+s.cls+'">'+s.html+'</div>'+(list.length>1?'<div class="tv-dots">'+list.map(function(_,i){return '<i class="'+(i===ui.slide?'on':'')+'"></i>';}).join('')+'</div>':'');
  var el=stage.querySelector('.slide');
  if(s.cls==='img')imgUrl(s.img).then(function(url){if(!url||!stage.contains(el))return;var im=preload(url);if(im.complete&&im.naturalWidth)fitFlyer(S,im);else im.addEventListener('load',function(){if(stage.contains(el))fitFlyer(S,im);},{once:true});});
  else fitText(el);
  list.forEach(function(x){if(x.img)imgUrl(x.img).then(function(u){if(u)preload(u);});});
  ui.slideTimer=setTimeout(function(){ui.slide=(ui.slide+1)%Math.max(1,list.length);if(route()==='display')startSlides(screenState());},s.secs*1000);
}
var wakeLock=null;
function keepAwake(){try{if(navigator.wakeLock&&!wakeLock)navigator.wakeLock.request('screen').then(function(w){wakeLock=w;w.addEventListener('release',function(){wakeLock=null;});}).catch(function(){});}catch(e){}}

/* ---------- board manager ---------- */
var TABS=['overview','times','notices','sponsors','community','donate','urgent','shul','screen','users'];
var LISTS=['times','notices','sponsors','mazal','refuah','yahrzeit'],SECTS=['donate','urgent','shul','display'];
function changes(B,D){B=B||base;D=D||draft;var out=[];
  LISTS.forEach(function(k){var a={},b={},n=0;B[k].forEach(function(x){a[x.id]=JSON.stringify(x);});D[k].forEach(function(x){b[x.id]=JSON.stringify(x);});Object.keys(b).forEach(function(id){if(a[id]!==b[id])n++;});Object.keys(a).forEach(function(id){if(!(id in b))n++;});if(n)out.push([k,n]);});
  SECTS.forEach(function(k){var o=B[k],d=D[k],n=0;Object.keys(Object.assign({},o,d)).forEach(function(f){if(JSON.stringify(o[f])!==JSON.stringify(d[f]))n++;});if(n)out.push([k,n]);});
  return out;}
function changeCount(B,D){return changes(B,D).reduce(function(a,c){return a+c[1];},0);}
/* Three-way merge: another admin's save (theirs) plus this admin's unsaved edits (relative to base). */
function merge3(B,mine,theirs){
  var out=clone(theirs);
  LISTS.forEach(function(k){
    var b={};B[k].forEach(function(x){b[x.id]=JSON.stringify(x);});
    var m={};mine[k].forEach(function(x){m[x.id]=1;});
    var list=out[k].filter(function(x){return !(x.id in b)||(x.id in m);});
    mine[k].forEach(function(x){var js=JSON.stringify(x);if(js===b[x.id])return;var j=-1;for(var i=0;i<list.length;i++)if(list[i].id===x.id){j=i;break;}if(j>=0)list[j]=clone(x);else list.unshift(clone(x));});
    out[k]=list;
  });
  SECTS.forEach(function(k){Object.keys(mine[k]).forEach(function(f){if(JSON.stringify(mine[k][f])!==JSON.stringify(B[k][f]))out[k][f]=clone(mine[k][f]);});});
  return out;
}
function fmtWhen(d){if(!d)return '';try{return new Intl.DateTimeFormat(lang==='he'?'he-IL':'en-GB',{timeZone:TZ,day:'numeric',month:'numeric',hour:'2-digit',minute:'2-digit'}).format(d);}catch(e){return '';}}
function metaPanel(){
  var m=FB.meta,lines='';
  if(!FB.hasDoc)return '<div class="banner"><span>'+esc(t('not_in_db'))+'</span></div>';
  if(m.by)lines+='<p class="muted small">'+esc(t('last_saved',{who:m.by,when:fmtWhen(m.at)}))+'</p>';
  if(FB.log.length)lines+='<div class="panel"><h3>'+esc(t('recent'))+'</h3><ul class="list">'+FB.log.map(function(l){return '<li><span class="k">'+esc(l.by||'')+' · '+esc(fmtWhen(l.at))+'</span>'+esc(t('log_line',{n:l.count||0,what:(l.sections||[]).map(function(x){return t('tab_'+(x==='mazal'||x==='refuah'||x==='yahrzeit'?'community':x==='display'?'screen':x))}).filter(function(v,i,a){return a.indexOf(v)===i;}).join(', ')}))+'</li>';}).join('')+'</ul></div>';
  return lines;
}
function renderManage(){
  var body;
  if(!FB.app)body='<div class="panel gate"><h3>'+esc(t('signin_title'))+'</h3><p>'+esc(t('no_fb'))+'</p></div>';
  else if(!FB.checked)body='<p class="empty" style="padding:40px 0">'+esc(t('checking'))+'</p>';
  else if(!FB.user)body='<div class="panel gate"><h3>'+esc(t('signin_title'))+'</h3><p>'+esc(t('signin_body'))+'</p><button class="btn primary gbtn" data-act="signin">'+GLOGO+esc(t('signin_btn'))+'</button></div>';
  else if(!FB.role)body='<div class="panel gate"><h3>'+esc(t('not_admin_title'))+'</h3><p>'+esc(t('not_admin_body',{email:FB.email}))+'</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-act="switch">'+esc(t('other_account'))+'</button><button class="btn" data-act="signout">'+esc(t('signout'))+'</button></div></div>';
  else{
    var counts={times:draft.times.length,notices:draft.notices.length,sponsors:draft.sponsors.length,community:draft.mazal.length+draft.refuah.length+draft.yahrzeit.length};
    body='<div class="mg"><nav class="mg-tabs" aria-label="manager">'+TABS.map(function(k){return '<button data-act="tab" data-tab="'+k+'" aria-current="'+(ui.tab===k)+'"><span>'+esc(t('tab_'+k))+'</span>'+(counts[k]!=null?'<span class="count">'+counts[k]+'</span>':(k==='urgent'&&draft.urgent.on?'<span class="count" style="color:var(--danger)">●</span>':''))+'</button>';}).join('')+'<div class="whoami"><span title="'+esc(FB.email)+'">'+esc(t('signed_in_as',{email:FB.email}))+'</span><button class="linkbtn" data-act="signout">'+esc(t('signout'))+'</button></div></nav>'+
      '<section class="mg-body" id="mg-body">'+tabBody()+'</section></div>'+saveBar();
  }
  return header()+'<div class="wrap">'+body+'</div><div class="toast" aria-live="polite"><div id="toast" hidden></div></div>';
}
function saveBar(){
  var n=changeCount();
  return '<div class="savebar" id="savebar"><div class="wrap"><span>'+(n?esc(n===1?t('unsaved1'):t('unsaved',{n:n})):esc(t('all_saved')))+'</span><span style="display:flex;gap:8px;flex-wrap:wrap">'+
    (n?'<button class="btn sm" data-act="discard">'+esc(t('discard'))+'</button>':'')+'<button class="btn sm" data-act="preview">'+esc(t('preview_edits'))+'</button>'+
    '<button class="btn primary" data-act="publish" '+(((!n&&FB.hasDoc)||ui.publishing)?'disabled':'')+'>'+esc(ui.publishing?t('publishing'):t('publish'))+'</button></span></div></div>';
}
function updateBar(){var b=document.getElementById('savebar');if(b)b.outerHTML=saveBar();}
function mgTitle(k,lead){return '<div class="mg-title"><div><h2>'+esc(t('tab_'+k))+'</h2>'+(lead?'<p>'+esc(lead)+'</p>':'')+'</div></div>';}
function tabBody(){
  var D=draft,iso=jp().iso;
  switch(ui.tab){
    case 'overview':return overview();
    case 'times':return mgTitle('times',t('times_note'))+listEditor('times',D.times,TIME_F,sumTime,'add_time');
    case 'notices':return mgTitle('notices',t('img_hint'))+listEditor('notices',D.notices,NOTICE_F,sumNotice,'add_notice');
    case 'sponsors':return mgTitle('sponsors')+listEditor('sponsors',D.sponsors,SPONSOR_F,sumSponsor,'add_sponsor');
    case 'community':return mgTitle('community')+'<div class="subhead">'+esc(t('sub_mazal'))+'</div><p class="muted small">'+esc(t('mazal_hint'))+'</p>'+listEditor('mazal',D.mazal,MAZAL_F,sumMazal,'add_mazal')+'<div class="subhead">'+esc(t('sub_yahrzeit'))+'</div><p class="muted small">'+esc(t('yahrzeit_hint'))+'</p>'+listEditor('yahrzeit',D.yahrzeit,YZ_F,sumYz,'add_yahrzeit')+'<div class="subhead">'+esc(t('sub_refuah'))+'</div>'+listEditor('refuah',D.refuah,REFUAH_F,sumRefuah,'add_refuah');
    case 'donate':return mgTitle('donate',t('donate_hint'))+'<div class="panel"><div class="ed-body" style="padding:0">'+fields('donate','',D.donate,DONATE_F)+'</div></div>';
    case 'urgent':return mgTitle('urgent',t('urgent_hint'))+'<div class="panel"><div class="ed-body" style="padding:0">'+fields('urgent','',D.urgent,URGENT_F)+'</div></div>';
    case 'shul':return mgTitle('shul',t('shul_hint'))+'<div class="panel"><div class="ed-body" style="padding:0">'+fields('shul','',D.shul,SHUL_F)+'</div></div>';
    case 'users':return usersTab();
    case 'screen':return mgTitle('screen',t('screen_hint'))+'<div class="panel"><div class="ed-body" style="padding:0">'+fields('display','',D.display,SCREEN_F)+'</div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="nav" data-to="display">'+esc(t('open_screen'))+'</button><button class="btn" data-act="preview">'+esc(t('preview_edits'))+'</button></div>';
  }
  return '';
}
function overview(){
  var D=normalize(clone(draft)),P=jp(),iso=P.iso,slides=slidesFor(D).length;
  var act=D.notices.filter(function(n){return noticeOn(n,iso,P.dow,'screen')||noticeOn(n,iso,P.dow,'web');}).length;
  var wkEnd=isoAdd(iso,6),exp=0;['notices','sponsors','mazal'].forEach(function(k){D[k].forEach(function(x){var e=k==='mazal'?mazalEnd(x):x.end;if(e&&e>=iso&&e<=wkEnd)exp++;});});
  var url=siteUrl(D);
  return mgTitle('overview',t('m_lead'))+metaPanel()+
    '<div class="stat"><div><b class="tn">'+slides+'</b><span>'+esc(t('ov_screen'))+' · '+esc(t('ov_slides'))+'</span></div><div><b class="tn">'+act+'</b><span>'+esc(t('ov_notices'))+'</span></div><div><b class="tn">'+exp+'</b><span>'+esc(t('ov_expiring'))+'</span></div></div>'+
    '<div class="panel"><h3>'+esc(t('ov_quick'))+'</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-act="quick" data-col="notices">+ '+esc(t('add_notice'))+'</button><button class="btn" data-act="quick" data-col="sponsors">+ '+esc(t('add_sponsor'))+'</button><button class="btn" data-act="quick" data-col="mazal">+ '+esc(t('add_mazal'))+'</button><button class="btn" data-act="tab" data-tab="urgent">'+esc(t('tab_urgent'))+'</button><button class="btn" data-act="clean">'+esc(t('ov_clean'))+'</button></div></div>'+
    '<div class="panel"><h3>'+esc(t('ov_setup'))+'</h3><p style="margin-bottom:10px">'+esc(t('screen_hint'))+'</p>'+(url?copyRow(url+'#display'):'<p class="muted small">'+esc(t('ov_link_missing'))+'</p>')+'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px"><button class="btn" data-act="nav" data-to="display">'+esc(t('open_screen'))+'</button><button class="btn" data-act="preview">'+esc(t('preview_edits'))+'</button></div></div>';
}

/* field schemas */
var DAYS_OPT=[0,1,2,3,4,5,6];
var TIME_F=[
  {k:'group',type:'select',opts:[['weekday','g_weekday'],['shabbat','g_shabbat'],['shiur','g_shiur']],re:1},
  {k:'days',type:'days'},
  {k:'nameHe',type:'text'},{k:'nameEn',type:'text'},
  {k:'mode',type:'select',opts:[['fixed','md_fixed'],['relative','md_rel']],re:1},
  {k:'time',type:'time',show:function(x){return x.mode!=='relative';}},
  {k:'base',type:'select',opts:['candles','sunset','sunrise','tzeit','havdalah','plag','minchaKetana','minchaGedola','chatzot','alot'].map(function(b){return [b,'b_'+b];}),show:function(x){return x.mode==='relative';}},
  {k:'offset',type:'number',show:function(x){return x.mode==='relative';}},
  {k:'round',type:'select',opts:[['none','r_none'],['down5','r_down5'],['up5','r_up5'],['near5','r_near5']],show:function(x){return x.mode==='relative';}},
  {k:'teacherHe',type:'text',show:function(x){return x.group==='shiur';}},{k:'teacherEn',type:'text',show:function(x){return x.group==='shiur';}},
  {k:'noteHe',type:'text'},{k:'noteEn',type:'text'},
  {k:'hidden',type:'check',full:1}
];
var NOTICE_F=[
  {k:'kind',type:'select',opts:[['standard','k_standard'],['ongoing','k_ongoing'],['timed','k_timed']],re:1,full:1},
  {k:'titleHe',type:'text'},{k:'titleEn',type:'text'},
  {k:'bodyHe',type:'textarea'},{k:'bodyEn',type:'textarea'},
  {k:'image',type:'image',full:1},
  {k:'start',l:'f_nstart',type:'date'},{k:'end',l:'f_nend',type:'date'},
  {k:'days',l:'f_ndays',type:'days',show:function(x){return x.kind==='ongoing';},full:1},
  {k:'web',type:'check'},{k:'screen',type:'check'},{k:'shabbat',type:'check'},{k:'secs',type:'number'},
  {k:'hidden',type:'check'}
];
var SPONSOR_F=[
  {k:'type',type:'select',opts:['kiddush','seudah','learning','tefillot','general'].map(function(x){return [x,'sp_'+x];}),full:1},
  {k:'byHe',type:'text'},{k:'byEn',type:'text'},{k:'forHe',type:'text'},{k:'forEn',type:'text'},
  {k:'start',type:'date'},{k:'end',type:'date'},{k:'hidden',type:'check',full:1}
];
var MAZAL_F=[{k:'textHe',type:'textarea'},{k:'textEn',type:'textarea'},{k:'start',l:'f_mstart',type:'date'},{k:'end',l:'f_mend',type:'date'},{k:'hidden',type:'check',full:1}];
var REFUAH_F=[{k:'name',type:'text'},{k:'until',type:'date'},{k:'hidden',type:'check',full:1}];
var YZ_F=[{k:'nameHe',type:'text'},{k:'nameEn',type:'text'},{k:'hday',type:'number'},{k:'hmonth',type:'hmonth'},{k:'hyear',type:'number'},{k:'relHe',l:'f_relHe',type:'text'},{k:'relEn',l:'f_relEn',type:'text'},{k:'hidden',type:'check',full:1}];
var DONATE_F=[{k:'bitPhone',type:'tel'},{k:'bitLink',type:'url'},{k:'payboxLink',type:'url'},{k:'otherLink',type:'url'},{k:'otherLabelHe',type:'text'},{k:'otherLabelEn',type:'text'},{k:'bankHe',type:'textarea'},{k:'bankEn',type:'textarea'},{k:'noteHe',l:'f_dnoteHe',type:'text'},{k:'noteEn',l:'f_dnoteEn',type:'text'}];
var URGENT_F=[{k:'on',type:'check',full:1},{k:'textHe',type:'textarea'},{k:'textEn',type:'textarea'},{k:'until',type:'date'}];
var SHUL_F=[{k:'nameHe',l:'f_shulName',type:'text'},{k:'nameEn',type:'text'},{k:'taglineHe',type:'text'},{k:'taglineEn',type:'text'},{k:'addressHe',type:'text'},{k:'addressEn',type:'text'},{k:'directionsHe',type:'text'},{k:'directionsEn',type:'text'},{k:'aboutHe',type:'textarea'},{k:'aboutEn',type:'textarea'},{k:'rabbiHe',type:'text'},{k:'rabbiEn',type:'text'},{k:'gabbaiHe',type:'text'},{k:'gabbaiEn',type:'text'},{k:'nusachHe',type:'text'},{k:'nusachEn',type:'text'},{k:'phone',type:'tel'},{k:'email',type:'email'},{k:'whatsapp',type:'url'},{k:'siteUrl',type:'url',full:1},{k:'candleMins',type:'number'},{k:'havdalahMode',type:'select',opts:[['tzeit','hv_tzeit'],['mins','hv_mins']],re:1},{k:'havdalahMins',type:'number',show:function(x){return x.havdalahMode==='mins';}},{k:'defaultLang',type:'select',opts:[['he','dl_he'],['en','dl_en']]},{k:'lat',type:'number'},{k:'lng',type:'number'}];
var SCREEN_F=[{k:'lang',l:'f_dlang',type:'select',opts:[['he','dl_he'],['en','dl_en'],['both','dl_both']]},{k:'slideSecs',type:'number'},{k:'shabbatMode',type:'select',opts:[['still','sm_still'],['normal','sm_normal']],full:1},{k:'zmanim',type:'zm',full:1},{k:'showDonate',type:'check'},{k:'showQr',type:'check'},{k:'flyerFull',type:'check',full:1}];

function fieldDir(k){return /He$/.test(k)?'rtl':(/En$/.test(k)||/(Link|Url|url|phone|Phone|email|whatsapp|lat|lng)$/.test(k)?'ltr':'auto');}
function fields(col,id,obj,F){
  return F.filter(function(f){return !f.show||f.show(obj);}).map(function(f){
    var k=f.k,lab=t(f.l||('f_'+k)),v=obj[k],a='data-col="'+col+'" data-id="'+esc(id)+'" data-k="'+k+'"',fid='f-'+col+'-'+(id||'x')+'-'+k,cls='f'+(f.full||f.type==='textarea'?' full':'');
    switch(f.type){
      case 'textarea':return '<label class="'+cls+'"><span>'+esc(lab)+'</span><textarea id="'+fid+'" dir="'+fieldDir(k)+'" '+a+'>'+esc(v||'')+'</textarea></label>';
      case 'select':return '<label class="'+cls+'"><span>'+esc(lab)+'</span><select id="'+fid+'" '+a+(f.re?' data-re="1"':'')+'>'+f.opts.map(function(o){return '<option value="'+esc(o[0])+'"'+(String(v)===String(o[0])?' selected':'')+'>'+esc(t(o[1]))+'</option>';}).join('')+'</select></label>';
      case 'hmonth':return '<label class="'+cls+'"><span>'+esc(lab)+'</span><select id="'+fid+'" '+a+'><option value="">—</option>'+HMONTHS.map(function(m){return '<option value="'+m[0]+'"'+(String(v)===m[0]?' selected':'')+'>'+esc(lang==='he'?m[1]:m[2])+'</option>';}).join('')+'</select></label>';
      case 'check':return '<label class="'+cls+' toggle"><input type="checkbox" id="'+fid+'" '+a+(v?' checked':'')+'><span style="color:var(--ink);font-weight:500;font-size:.92rem">'+esc(lab)+'</span></label>';
      case 'days':return '<div class="'+cls+'"><span>'+esc(lab)+'</span><div class="checks">'+DAYS_OPT.map(function(d){return '<label><input type="checkbox" id="'+fid+'-'+d+'" '+a+' data-day="'+d+'"'+((v||[]).indexOf(d)>=0?' checked':'')+'>'+esc(DOW[lang][d])+'</label>';}).join('')+'</div></div>';
      case 'zm':return '<div class="'+cls+'"><span>'+esc(lab)+'</span><div class="checks">'+ZKEYS.map(function(z){return '<label><input type="checkbox" id="'+fid+'-'+z+'" '+a+' data-multi="'+z+'"'+((v||[]).indexOf(z)>=0?' checked':'')+'>'+esc(t('zm_'+z))+'</label>';}).join('')+'</div></div>';
      case 'image':var src=v?imgAttr(v):'';return '<div class="'+cls+'"><span>'+esc(lab)+'</span><div class="imgf">'+(src?'<img '+src+' alt="">':'')+'<label class="btn sm">'+esc(ui.busy[id]?t('uploading'):t('img_pick'))+'<input type="file" accept="image/*" id="'+fid+'" '+a+' hidden></label>'+(src?'<button class="btn sm danger" data-act="rmimg" data-col="'+col+'" data-id="'+esc(id)+'" data-k="'+k+'">'+esc(t('img_remove'))+'</button>':'')+'</div><span class="hint">'+esc(t('img_hint'))+'</span></div>';
      default:var ty=f.type==='number'?'number':f.type;return '<label class="'+cls+'"><span>'+esc(lab)+'</span><input type="'+ty+'" id="'+fid+'" dir="'+fieldDir(k)+'" '+a+' value="'+esc(v==null?'':v)+'"'+(f.type==='number'?' step="any"':'')+'></label>';
    }
  }).join('');
}
function listEditor(col,items,F,sum,addKey){
  var iso=jp().iso;
  return '<div><button class="btn primary" data-act="add" data-col="'+col+'">+ '+esc(t(addKey))+'</button></div>'+
    (items.length?items.map(function(it){return card(col,it,F,sum,iso);}).join(''):'<p class="empty">'+esc(t('empty_list'))+'</p>');
}
function card(col,it,F,sum,iso){
  var s=sum(it,iso);
  return '<details class="ed" data-col="'+col+'" data-id="'+esc(it.id)+'"'+(ui.open[it.id]?' open':'')+'><summary id="sum-'+esc(it.id)+'">'+summaryHtml(s)+'</summary><div class="ed-body" id="body-'+esc(it.id)+'">'+cardBody(col,it,F)+'</div></details>';
}
function cardBody(col,it,F){return fields(col,it.id,it,F)+'<div class="ed-actions"><button class="btn sm" data-act="dup" data-col="'+col+'" data-id="'+esc(it.id)+'">'+esc(t('duplicate'))+'</button><button class="btn sm danger" data-act="del" data-col="'+col+'" data-id="'+esc(it.id)+'">'+esc(t('del'))+'</button></div>';}
function summaryHtml(s){var st=s.st;return '<span class="s-main"><b>'+esc(s.title||'—')+'</b><span>'+esc(s.sub||'')+'</span></span><span class="s-side">'+(st?'<span class="pill '+st[0]+'">'+esc(t(st[1],st[2]))+'</span>':'')+'</span>';}
function sumTime(x){var iso=jp().iso;return {title:pick(x,'name'),sub:t('g_'+(x.group||'weekday'))+' · '+daysLabel(x.days)+' · '+(x.mode==='relative'?ruleText(x):(x.time||'')),st:x.hidden?['off','st_hidden']:null};}
function sumNotice(x,iso){return {title:pick(x,'title')||(x.image?t('f_image'):''),sub:t('k_'+(x.kind||'standard'))+(x.end?' · '+t('until',{d:fmtShort(x.end)}):''),st:status(x,iso,x.kind)};}
function sumSponsor(x,iso){return {title:t('sp_'+(x.type||'general'))+(pick(x,'by')?' — '+pick(x,'by'):''),sub:pick(x,'for')+(x.start?' · '+fmtShort(x.start):''),st:status(x,iso)};}
function sumMazal(x,iso){var e=mazalEnd(x);return {title:pick(x,'text'),sub:x.start?fmtShort(x.start)+(e?'–'+fmtShort(e):''):'',st:status({hidden:x.hidden,start:x.start,end:e},iso)};}
function sumRefuah(x,iso){return {title:x.name,sub:x.until?t('until',{d:fmtShort(x.until)}):'',st:status({hidden:x.hidden,until:x.until},iso)};}
function sumYz(x,iso){var m=HMONTHS.filter(function(h){return h[0]===String(x.hmonth);})[0];var r=yahrzeitIso(x,iso);return {title:pick(x,'name'),sub:(x.hday||'')+' '+(m?(lang==='he'?m[1]:m[2]):''),st:x.hidden?['off','st_hidden']:(r?['warn','this_week']:null)};}

var DEFAULTS={
  times:function(){return {group:'weekday',nameHe:'',nameEn:'',days:[0,1,2,3,4],mode:'fixed',time:'',base:'sunset',offset:-15,round:'down5',noteHe:'',noteEn:'',teacherHe:'',teacherEn:'',hidden:false};},
  notices:function(){var i=jp().iso;return {kind:'timed',titleHe:'',titleEn:'',bodyHe:'',bodyEn:'',image:null,start:i,end:isoAdd(i,14),days:[],web:true,screen:true,shabbat:false,secs:'',hidden:false};},
  sponsors:function(){var i=jp().iso,w=weekInfo(i,draft.shul);return {type:'kiddush',byHe:'',byEn:'',forHe:'',forEn:'',start:w.sat,end:w.sat,hidden:false};},
  mazal:function(){var i=jp().iso;return {textHe:'',textEn:'',start:i,end:isoAdd(i,MAZAL_DAYS),hidden:false};},
  refuah:function(){return {name:'',until:'',hidden:false};},
  yahrzeit:function(){return {nameHe:'',nameEn:'',hday:'',hmonth:'',hyear:'',relHe:'',relEn:'',hidden:false};}
};
function target(col,id){if(!col)return null;if(!id)return draft[col];var arr=draft[col];if(!Array.isArray(arr))return null;for(var i=0;i<arr.length;i++)if(arr[i].id===id)return arr[i];return null;}
var SCHEMA={times:[TIME_F,sumTime],notices:[NOTICE_F,sumNotice],sponsors:[SPONSOR_F,sumSponsor],mazal:[MAZAL_F,sumMazal],refuah:[REFUAH_F,sumRefuah],yahrzeit:[YZ_F,sumYz]};
function refreshCard(col,id,body){
  var it=target(col,id),sc=SCHEMA[col];if(!it||!sc)return;var iso=jp().iso;
  var s=document.getElementById('sum-'+id);if(s)s.innerHTML=summaryHtml(sc[1](it,iso));
  if(body){var b=document.getElementById('body-'+id);if(b)b.innerHTML=cardBody(col,it,sc[0]);}
}
function refreshPanel(){var b=document.getElementById('mg-body');if(b){var y=window.scrollY;b.innerHTML=tabBody();window.scrollTo(0,y);}}
/* ---------- users (admins only; owners manage the list) ---------- */
function usersTab(){
  var owner=FB.role==='owner',rows='';
  OWNERS.forEach(function(e){rows+='<li class="urow"><span class="s-main"><b>'+esc(e)+'</b><span>'+esc(t('role_builtin'))+(e===FB.email?' · '+esc(t('you')):'')+'</span></span><span class="pill">'+esc(t('role_owner'))+'</span></li>';});
  FB.admins.filter(function(a){return OWNERS.indexOf(a.email)<0;}).forEach(function(a){
    var me=a.email===FB.email;
    rows+='<li class="urow"><span class="s-main"><b>'+esc(a.email)+'</b><span>'+(a.addedBy?esc(t('added_by',{who:a.addedBy})):'')+(me?' · '+esc(t('you')):'')+'</span></span><span class="s-side">'+
      (owner&&!me?'<select id="role-'+esc(a.email)+'" data-userrole="'+esc(a.email)+'" aria-label="'+esc(t('user_role'))+'"><option value="admin"'+(a.role!=='owner'?' selected':'')+'>'+esc(t('role_admin'))+'</option><option value="owner"'+(a.role==='owner'?' selected':'')+'>'+esc(t('role_owner'))+'</option></select><button class="btn sm danger" data-act="rmuser" data-email="'+esc(a.email)+'">'+esc(t('rm_user'))+'</button>':'<span class="pill">'+esc(t(a.role==='owner'?'role_owner':'role_admin'))+'</span>')+'</span></li>';
  });
  return mgTitle('users',t('users_lead'))+
    (owner?'<form class="panel uadd" id="uadd"><h3>'+esc(t('add_user'))+'</h3><div class="ed-body" style="padding:0"><label class="f"><span>'+esc(t('user_email'))+'</span><input type="email" id="u-email" dir="ltr" autocomplete="off" placeholder="name@gmail.com" required></label><label class="f"><span>'+esc(t('user_role'))+'</span><select id="u-role"><option value="admin">'+esc(t('role_admin'))+' — '+esc(t('role_admin_d'))+'</option><option value="owner">'+esc(t('role_owner'))+' — '+esc(t('role_owner_d'))+'</option></select></label><div class="ed-actions"><button class="btn primary" type="submit">'+esc(t('add_btn'))+'</button></div></div></form>':'<p class="muted small">'+esc(t('only_owner'))+'</p>')+
    '<ul class="panel ulist">'+rows+'</ul>';
}
function addUser(email,role){
  email=String(email||'').trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast(t('user_bad'));return;}
  FB.db.collection('admins').doc(email).set({role:role==='owner'?'owner':'admin',addedBy:FB.email,addedAt:firebase.firestore.FieldValue.serverTimestamp()})
    .then(function(){toast(t('user_added',{email:email}));var i=document.getElementById('u-email');if(i)i.value='';})
    .catch(function(e){toast(t('user_fail',{c:e.code||'error'}));});
}

function onField(e){
  var el=e.target;if(!el||!el.dataset||!el.dataset.k)return;
  var col=el.dataset.col,id=el.dataset.id,k=el.dataset.k,obj=target(col,id);if(!obj)return;
  var v;
  if(el.type==='file'){if(e.type==='change')handleImage(el,obj,col,id,k);return;}
  if(el.type==='checkbox'&&el.dataset.day!=null){var a=(obj[k]||[]).slice(),d=+el.dataset.day,i=a.indexOf(d);if(el.checked&&i<0)a.push(d);if(!el.checked&&i>=0)a.splice(i,1);v=a.sort();}
  else if(el.type==='checkbox'&&el.dataset.multi){var b=(obj[k]||[]).slice(),z=el.dataset.multi,j=b.indexOf(z);if(el.checked&&j<0)b.push(z);if(!el.checked&&j>=0)b.splice(j,1);v=ZKEYS.filter(function(q){return b.indexOf(q)>=0;});}
  else if(el.type==='checkbox')v=el.checked;
  else if(el.type==='number')v=el.value===''?'':+el.value;
  else v=el.value;
  obj[k]=v;
  if(col==='mazal'&&k==='start'&&/^\d{4}-\d{2}-\d{2}$/.test(v)){obj.end=isoAdd(v,MAZAL_DAYS);var ef=document.getElementById('f-mazal-'+id+'-end');if(ef)ef.value=obj.end;}
  if(id)refreshCard(col,id,el.dataset.re==='1'&&e.type==='change');
  else if(el.dataset.re==='1'&&e.type==='change')refreshPanel();
  updateBar();
}
/* Compress to a JPEG data URL that fits in one Firestore document (under ~1 MB), as sharp as possible. */
function encodeImage(file){
  return new Promise(function(res,rej){
    var url=URL.createObjectURL(file),im=new Image();
    im.onload=function(){
      URL.revokeObjectURL(url);
      var tries=[[2560,.85],[2560,.75],[2048,.8],[2048,.7],[1800,.7],[1600,.7],[1400,.65],[1200,.6]];
      for(var i=0;i<tries.length;i++){
        var w=im.naturalWidth,h=im.naturalHeight,sc=Math.min(1,tries[i][0]/Math.max(w,h)),c=document.createElement('canvas');
        c.width=Math.round(w*sc);c.height=Math.round(h*sc);var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
        var d=c.toDataURL('image/jpeg',tries[i][1]);
        if(d.length<990000){res({data:d,w:c.width,h:c.height});return;}
      }
      rej(new Error('toobig'));
    };
    im.onerror=function(){URL.revokeObjectURL(url);rej(new Error('decode'));};
    im.src=url;
  });
}
function handleImage(el,obj,col,id,k){
  var f=el.files&&el.files[0];if(!f)return;
  if(!/^image\//.test(f.type)){toast(t('img_only'));return;}
  ui.busy[id]=1;refreshCard(col,id,true);
  encodeImage(f).then(function(r){
    var fid=uid('i');
    return FB.db.collection('images').doc(fid).set({data:r.data,w:r.w,h:r.h,by:FB.email,at:firebase.firestore.FieldValue.serverTimestamp()}).then(function(){
      IMGDATA[fid]=r.data;ui.uploaded[fid]=1;obj[k]={fid:fid,w:r.w,h:r.h};
    });
  }).catch(function(err){toast(err&&err.message==='toobig'?t('img_toobig'):t('img_fail'));})
  .then(function(){delete ui.busy[id];refreshCard(col,id,true);updateBar();});
}
function toast(msg){var el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(function(){el.hidden=true;},5200);}

/* ---------- saving to Firestore ---------- */
function fids(S){var out=[];(S.notices||[]).forEach(function(n){if(n.image&&n.image.fid)out.push(n.image.fid);});return out;}
function dropImages(list){list.forEach(function(fid){FB.db.collection('images').doc(fid).delete().catch(function(){});});}
function publish(){
  if(!FB.role||ui.publishing)return;
  var S=normalize(clone(draft)),ref=FB.db.collection('site').doc('state'),baseRev=ui.baseRev||0,ch=changes(base,S),prevFids=fids(base);
  ui.publishing=true;updateBar();
  FB.db.runTransaction(function(tx){
    return tx.get(ref).then(function(snap){
      var cur=snap.exists?(snap.data().rev||0):0;
      if(cur!==baseRev){var e=new Error('conflict');e.code='conflict';throw e;}
      var doc=clone(S);delete doc.updated;doc.rev=cur+1;doc.updatedBy=FB.email;doc.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
      tx.set(ref,doc);
    });
  }).then(function(){
    var now=fids(S);dropImages(prevFids.filter(function(f){return now.indexOf(f)<0;}));ui.uploaded={};
    FB.db.collection('log').add({by:FB.email,at:firebase.firestore.FieldValue.serverTimestamp(),count:ch.reduce(function(a,c){return a+c[1];},0),sections:ch.map(function(c){return c[0];})}).catch(function(){});
    toast(t('published'));
  }).catch(function(err){
    var c=err&&err.code;
    toast(c==='conflict'||c==='aborted'?t('conflict'):(c==='permission-denied'?t('perm_denied'):t('save_failed')));
  }).then(function(){ui.publishing=false;updateBar();});
}
function discardDraft(){
  var keep=fids(state);dropImages(Object.keys(ui.uploaded).filter(function(f){return keep.indexOf(f)<0;}));ui.uploaded={};
  draft=clone(base);
}

/* ---------- events ---------- */
$app.addEventListener('input',onField);
$app.addEventListener('change',onField);
document.addEventListener('toggle',function(e){var d=e.target;if(d&&d.classList&&d.classList.contains('ed')){if(d.open)ui.open[d.dataset.id]=1;else delete ui.open[d.dataset.id];}},true);
$app.addEventListener('click',function(e){
  var b=e.target.closest('[data-act]');if(!b)return;var act=b.dataset.act;
  if(act==='go'){var s=document.getElementById(b.dataset.to);if(s)s.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return;}
  if(act==='nav'){ui.previewDraft=false;if(b.dataset.to){location.hash=b.dataset.to;}else{history.replaceState(null,'',location.pathname+location.search);render();window.scrollTo(0,0);}return;}
  if(act==='lang'){lang=b.dataset.lang;try{localStorage.setItem('shul-lang',lang);}catch(err){}render();return;}
  if(act==='zday'){var n=+b.dataset.n,today=jp().iso;ui.zDate=n===0?today:isoAdd(ui.zDate||today,n);var sec=document.getElementById('sec-zmanim');if(sec)sec.outerHTML=secZmanim(state,jp());return;}
  if(act==='copy'){e.preventDefault();var txt=b.dataset.text;var done=function(){var o=b.textContent;b.textContent=t('copied');setTimeout(function(){b.textContent=o;},1500);};try{navigator.clipboard.writeText(txt).then(done,function(){selectNear(b);});}catch(err){selectNear(b);}return;}
  if(act==='fs'){var de=document.documentElement;if(de.requestFullscreen)de.requestFullscreen().catch(function(){});b.hidden=true;keepAwake();return;}
  if(act==='endpreview'){ui.previewDraft=false;location.hash='manage';return;}
  if(act==='tab'){ui.tab=b.dataset.tab;render();window.scrollTo(0,0);return;}
  if(act==='add'||act==='quick'){var col=b.dataset.col,it=DEFAULTS[col]();it.id=uid(col.charAt(0));draft[col].unshift(it);ui.open[it.id]=1;if(act==='quick')ui.tab=(col==='mazal'?'community':col);render();if(act==='quick')window.scrollTo(0,0);return;}
  if(act==='dup'){var c2=b.dataset.col,src=target(c2,b.dataset.id);if(!src)return;var cp=clone(src);cp.id=uid(c2.charAt(0));var arr=draft[c2];arr.splice(arr.indexOf(src)+1,0,cp);ui.open[cp.id]=1;refreshPanel();updateBar();return;}
  if(act==='del'||act==='discard'){
    if(ui.armed!==b){if(ui.armed)disarm();ui.armed=b;b.dataset.label=b.textContent;b.textContent=t(act==='del'?'del2':'discard2');b.classList.add('armed','danger');b._t=setTimeout(disarm,3500);return;}
    clearTimeout(b._t);ui.armed=null;
    if(act==='del'){var c3=b.dataset.col,a3=draft[c3],o3=target(c3,b.dataset.id);if(o3)a3.splice(a3.indexOf(o3),1);refreshPanel();}
    else{discardDraft();refreshPanel();}
    updateBar();return;
  }
  if(act==='rmimg'){var o4=target(b.dataset.col,b.dataset.id);if(o4){o4[b.dataset.k]=null;refreshCard(b.dataset.col,b.dataset.id,true);updateBar();}return;}
  if(act==='publish'){publish();return;}
  if(act==='preview'){ui.previewDraft=true;location.hash='display';return;}
  if(act==='signin'){signIn(false);return;}
  if(act==='switch'){signIn(true);return;}
  if(act==='signout'){if(FB.auth)FB.auth.signOut();return;}
  if(act==='rmuser'){
    if(ui.armed!==b){if(ui.armed)disarm();ui.armed=b;b.dataset.label=b.textContent;b.textContent=t('rm_user2');b.classList.add('armed');b._t=setTimeout(disarm,3500);return;}
    clearTimeout(b._t);ui.armed=null;var em=b.dataset.email;
    FB.db.collection('admins').doc(em).delete().then(function(){toast(t('user_removed',{email:em}));}).catch(function(e2){toast(t('user_fail',{c:e2.code||'error'}));});return;
  }
  if(act==='clean'){var iso=jp().iso,n2=0;['notices','sponsors','mazal'].forEach(function(k){var before=draft[k].length;draft[k]=draft[k].filter(function(x){var e=k==='mazal'?mazalEnd(x):x.end;return !(e&&e<iso);});n2+=before-draft[k].length;});var b2=draft.refuah.length;draft.refuah=draft.refuah.filter(function(x){return !(x.until&&x.until<iso);});n2+=b2-draft.refuah.length;toast(n2?t('ov_cleaned',{n:n2}):t('ov_nothing'));refreshPanel();updateBar();return;}
});
function disarm(){var b=ui.armed;if(!b)return;b.textContent=b.dataset.label||b.textContent;b.classList.remove('armed');if(b.dataset.act==='discard')b.classList.remove('danger');ui.armed=null;}
$app.addEventListener('submit',function(e){if(e.target&&e.target.id==='uadd'){e.preventDefault();addUser(document.getElementById('u-email').value,document.getElementById('u-role').value);}});
$app.addEventListener('change',function(e){var el=e.target;if(!el||!el.dataset||!el.dataset.userrole)return;FB.db.collection('admins').doc(el.dataset.userrole).set({role:el.value==='owner'?'owner':'admin'},{merge:true}).then(function(){toast(t('user_updated'));}).catch(function(e2){toast(t('user_fail',{c:e2.code||'error'}));});});
function selectNear(b){var c=b.parentNode&&b.parentNode.querySelector('code');if(!c)return;var r=document.createRange();r.selectNodeContents(c);var s=window.getSelection();s.removeAllRanges();s.addRange(r);}
window.addEventListener('hashchange',function(){if(route()!=='display')ui.previewDraft=false;render();window.scrollTo(0,0);});
var GLOGO='<svg class="glogo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>';
document.addEventListener('visibilitychange',function(){if(!document.hidden&&route()==='display')keepAwake();});
var rsT=null;window.addEventListener('resize',function(){if(route()!=='display')return;clearTimeout(rsT);rsT=setTimeout(render,300);});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){if(route()!=='display')return;fitSide();var el=document.querySelector('#tv-stage .slide');if(el&&!el.classList.contains('img'))fitText(el);});

/* ---------- clock ---------- */
setInterval(function(){
  var r=route(),P=jp();
  if(r==='display'){
    var S=screenState();
    if(P.hh===3&&P.mm===30&&P.ss<2&&!ui.previewDraft&&!isShabbatNow(S.shul)){location.reload();return;}
    var still=S.display.shabbatMode==='still'&&isShabbatNow(S.shul);
    if(still!==ui.stillFlag){render();return;}
    if(still)return;
    var c=document.getElementById('tv-clock');if(c)c.textContent=String(P.hh).padStart(2,'0')+':'+String(P.mm).padStart(2,'0');
    if(P.mm!==ui.lastMinute){ui.lastMinute=P.mm;var side=document.getElementById('tv-side');if(side)side.innerHTML=tvSide(S,false);fitSide();var ft=document.getElementById('tv-foot');if(ft)ft.innerHTML=tvFoot(S);}
  }else if(r==='home'){
    if(P.mm!==ui.lastMinute){var dayChanged=ui.lastDay&&ui.lastDay!==P.iso;ui.lastMinute=P.mm;ui.lastDay=P.iso;if(dayChanged){ui.zDate=P.iso;render();return;}var n=document.getElementById('live-next');if(n)n.innerHTML=nextHtml(nextTefillah(state,new Date()));}
  }
},1000);

/* ---------- Firebase ---------- */
function fbInit(){
  var cfg=window.SHUL_FIREBASE;
  if(!window.firebase||!cfg||!cfg.apiKey){FB.checked=true;loadSeed().then(function(sd){state=normalize(clone(sd));base=clone(state);draft=clone(state);ready();});return;}
  FB.app=firebase.initializeApp(cfg);FB.db=firebase.firestore();FB.auth=firebase.auth();
  if(window.SHUL_EMULATOR){FB.db.useEmulator(SHUL_EMULATOR.host,SHUL_EMULATOR.firestore);FB.auth.useEmulator('http://'+SHUL_EMULATOR.host+':'+SHUL_EMULATOR.auth,{disableWarnings:true});}
  else FB.db.enablePersistence({synchronizeTabs:true}).catch(function(){});
  FB.db.collection('site').doc('state').onSnapshot(onState,function(){loadSeed().then(function(sd){if(!ui.ready){state=normalize(clone(sd));base=clone(state);draft=clone(state);ready();}});});
  FB.auth.onAuthStateChanged(onUser);
  FB.auth.getRedirectResult().catch(function(e){if(e&&e.code)toast(t('signin_failed',{c:e.code}));});
}
function loadSeed(){if(SEED)return Promise.resolve(SEED);return fetch('seed/state.json',{cache:'no-cache'}).then(function(r){return r.json();}).catch(function(){return {};}).then(function(j){SEED=j||{};return SEED;});}
function ready(){if(ui.ready)return;ui.ready=true;try{lang=localStorage.getItem('shul-lang')||state.shul.defaultLang||'he';}catch(e){lang=state.shul.defaultLang||'he';}render();}
function onState(snap){
  var d=snap.exists?snap.data():null;
  if(!d){loadSeed().then(function(sd){applyState(normalize(clone(sd)),{rev:0,by:'',at:null},false);});return;}
  var meta={rev:d.rev||0,by:d.updatedBy||'',at:d.updatedAt&&d.updatedAt.toDate?d.updatedAt.toDate():null};
  var S=clone(d);delete S.rev;delete S.updatedBy;delete S.updatedAt;
  applyState(normalize(S),meta,true);
}
function applyState(S,meta,hasDoc){
  var dirty=changeCount(base,draft)>0;
  state=S;FB.meta=meta;FB.hasDoc=hasDoc;
  if(!dirty){draft=clone(S);base=clone(S);ui.baseRev=meta.rev;}
  else if(meta.rev!==ui.baseRev){draft=merge3(base,draft,S);base=clone(S);ui.baseRev=meta.rev;if(meta.by&&meta.by!==FB.email)setTimeout(function(){toast(t('merged',{who:meta.by}));},50);}
  if(!ui.ready){ready();return;}
  var r=route();
  if(r==='manage'){if(document.getElementById('mg-body')){refreshPanel();updateBar();}else render();}
  else if(r==='display'&&ui.previewDraft){/* preview shows the draft; keep it */}
  else render();
}
function onUser(user){
  FB.subs.forEach(function(u){try{u();}catch(e){}});FB.subs=[];FB.admins=[];FB.log=[];
  FB.user=user||null;FB.email=user&&user.email?user.email.toLowerCase():'';FB.role='';FB.checked=false;
  if(!user){FB.checked=true;rerenderAuth();return;}
  var done=function(role){FB.role=role;FB.checked=true;if(role)watchAdminData();rerenderAuth();};
  if(OWNERS.indexOf(FB.email)>=0){done('owner');return;}
  FB.db.collection('admins').doc(FB.email).get().then(function(s){done(s.exists?(s.data().role==='owner'?'owner':'admin'):'');},function(){done('');});
}
function watchAdminData(){
  FB.subs.push(FB.db.collection('admins').onSnapshot(function(q){FB.admins=q.docs.map(function(d){var x=d.data();return {email:d.id,role:x.role||'admin',addedBy:x.addedBy||''};}).sort(function(a,b){return a.email<b.email?-1:1;});
    var me=FB.admins.filter(function(a){return a.email===FB.email;})[0];
    if(OWNERS.indexOf(FB.email)<0){var nr=me?(me.role==='owner'?'owner':'admin'):'';if(nr!==FB.role){FB.role=nr;rerenderAuth();return;}}
    if(route()==='manage'&&ui.tab==='users')refreshPanel();},function(e){if(e&&e.code==='permission-denied'&&OWNERS.indexOf(FB.email)<0){FB.role='';rerenderAuth();}}));
  FB.subs.push(FB.db.collection('log').orderBy('at','desc').limit(8).onSnapshot(function(q){FB.log=q.docs.map(function(d){var x=d.data();return {by:x.by,at:x.at&&x.at.toDate?x.at.toDate():null,count:x.count,sections:x.sections};});
    if(route()==='manage'&&ui.tab==='overview')refreshPanel();},function(){}));
}
function rerenderAuth(){if(!ui.ready)return;if(route()!=='display')render();}
function signIn(choose){
  if(!FB.auth)return;
  var p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
  var go=function(){return FB.auth.signInWithPopup(p).catch(function(e){
    var c=e&&e.code||'error';
    if(c==='auth/popup-blocked'||c==='auth/operation-not-supported-in-this-environment')return FB.auth.signInWithRedirect(p);
    if(c!=='auth/popup-closed-by-user'&&c!=='auth/cancelled-popup-request')toast(t('signin_failed',{c:c}));
  });};
  if(choose&&FB.user)FB.auth.signOut().then(go);else go();
}

/* ---------- boot ---------- */
if(window.SHUL_EMULATOR)window.T={ui:ui,render:render,get draft(){return draft;},get state(){return state;},setLang:function(l){lang=l;render();}};/* test hook, local emulator only */
render();
fbInit();
setTimeout(function(){if(!ui.ready)loadSeed().then(function(sd){if(!ui.ready){state=normalize(clone(sd));base=clone(state);draft=clone(state);ready();}});},4000);
})();
