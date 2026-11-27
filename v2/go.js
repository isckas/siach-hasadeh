/* v2 is retired. Its address opens v3 (or the admin page, for #manage links). */
(function(){var h=location.hash||'';location.replace(/^#manage(\/|$)/.test(h)?'../'+h:'../v3/'+h);})();
