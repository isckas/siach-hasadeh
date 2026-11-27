/* v3 is the website, the screen and the admin look. This root page only hosts the admin page (#manage); everything else opens v3. */
(function(){var h=location.hash||'';if(!/^#manage(\/|$)/.test(h))location.replace('v3/'+h);})();
