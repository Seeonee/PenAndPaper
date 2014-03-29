/* From StackOverflow; this lets us scrape ULR vars. */
$.extend({
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function(name){
        return $.getUrlVars()[name];
    }
});

function urlDecode(str) {
    if (str) {
        return decodeURIComponent((str + '').replace(/\+/g, '%20'));
    }
    return str;
}

