// Module with methods for converting between
// JSON and <div> documents.
var DocModule = (function () {
    var my = {};
    
    // URL vars pulled from the query string.
    var query_values = [];
    my.initializeQueries = function() {
        var terms = {
            'name': 'text', 
            'level': 'text', 
            'slot': 'select', 
            'type': 'text', 
            'text': 'text'
        };
        $.each(terms, function(k ,v) {
            var s = urlDecode($.getUrlVar('query_' + k));
            if (s) {
                s = s.toLowerCase();
            }
            query_values[k] = s;
            if (v == 'select') {
                $( "select[name*='query_" + k + "'] option" ).filter(function() {
                    return $(this).val() == s;
                }).prop('selected', true);
            } else {
                $( "input[name*='query_" + k + "']" ).val(s);
            }
        });
    }

    // Matching function.
    my.doesValueMatch = function(value, query_key, exact_match) {
        exact_match = exact_match || false;
        var v = query_values[query_key];
        if (v) {
            if (exact_match) {
                pieces = value.toLowerCase().split(',');
                var found = false;
                $.each(pieces, function(k, v2) {
                    if (v2 == v) {
                        found = true;
                    }
                });
                return found;
            } else {
                return value.toLowerCase().search(v) >= 0;
            }
        } else {
            return true;
        }
    }

    // Takes a string like "word1_word2_word3",
    // and returns "Word1 word2 word3".
    function formatWordSet(s, joiner) {
        if (!s) {
            return '';
        }
        joiner = joiner || ', ';
        var result = [];
        $.each(s, function(k, v) {
            var v2 = v.replace(/_/g, ' ');
            result[k] = v2[0].toUpperCase() + v2.slice(1);
        });
        return result.join(joiner);
    }
    
    // Reverses the previous method.
    function unformatWordString(s) {
        var values = [];
        $.each(s.split(','), function(k, v) {
            values[k] = $.trim(v).toLowerCase().replace(/ /g, '_');
            values[k] = values[k].replace(/['"-]/g, '');
        });
        return values;
    }
    
    
    // Parse JSON and return a document <div> element.
    my.parse = function(data) {
        var name = data.name.toUpperCase();
        var level = data.level;
        var slots = formatWordSet(data.slots);
        var types = formatWordSet(data.types);
        var text = data.text.replace(/\\n|\n/g, '<br />');
        
        var doc = $('<div>').attr('class', 'document').hide();
        
        // Name and icon.
        var icon_class = data.slots[0].replace('_upgrade', ' upgrade');
        var icon = $('<div>').attr('class', 'icon activated background ' + icon_class);
        icon.appendTo(doc);
        var name_div = $('<div>').attr('class', 'name').attr('contenteditable', 'true').html(name);
        name_div.appendTo(icon);
        
        // Info supersection.
        var info = $('<div>').attr('class', 'info');
        info.appendTo(doc);
        
        // Level section.
        var level_div = $('<div>').attr('class', 'level');
        level_div.appendTo(info);
        $('<div>').attr('class', 'tag').html('LEVEL:').appendTo(level_div);
        $('<div>').attr('class', 'value').attr('contenteditable', 'true').html(level).appendTo(level_div);
        
        // Slot section.
        var slot_div = $('<div>').attr('class', 'slot');
        slot_div.appendTo(info);
        $('<div>').attr('class', 'tag').html('SLOT:').appendTo(slot_div);
        $('<div>').attr('class', 'value').attr('contenteditable', 'true').html(slots).appendTo(slot_div);
        
        // Type section.
        var type_div = $('<div>').attr('class', 'type');
        type_div.appendTo(info);
        $('<div>').attr('class', 'tag').html('TYPE:').appendTo(type_div);
        $('<div>').attr('class', 'value').attr('contenteditable', 'true').html(types).appendTo(type_div);
        
        // And finally, the text.
        var text_div = $('<div>').attr('class', 'text');
        text_div.appendTo(info);
        $('<div>').attr('class', 'tag').html('TEXT:').appendTo(text_div);
        $('<div>').attr('class', 'value').attr('contenteditable', 'true').html(text).appendTo(text_div);
        
        return doc;
    }
    
    // Add a save button to a doc.
    var json_prefix = 'data:text/json;charset=utf-8,';
    my.addSaveButton = function(doc) {
        var save = $('<div>').attr('class', 'button save');
        var download = $('<a>').attr('class', 'button download');
        
        save.click(function() {
            var doc = $( this ).parent('.document');
            var name = unformatWordString(doc.find('.icon').find('.name').text());
            var slot = unformatWordString(doc.find('.slot').find('.value').text())[0];
            var download = doc.find('a');
            download.attr('href', json_prefix + my.store(doc));
            download.attr('download', slot + '_' + name + '.json');
            doc.find('.download')[0].click();
        });
        save.appendTo(doc);
        
        var name = unformatWordString(doc.find('.icon').find('.name').text());
        var slot = unformatWordString(doc.find('.slot').find('.value').text())[0];
        download.attr('href', json_prefix + my.store(doc));
        download.attr('download', slot + '_' + name + '.json');
        download.appendTo(doc);
    }
    
    // Add a duplicate button.
    my.addCopyButton = function(doc, container) {
        var copy = $('<div>').attr('class', 'button copy');
        copy.click(function() {
            var parent = $( this ).parent('.document');
            var doc = parent.clone();
            doc.hide();
            doc.remove('.button');
            my.addSaveButton(doc);
            my.addCopyButton(doc, container);
            doc.insertAfter(parent);
            doc.slideDown('slow');
        });
        copy.appendTo(doc);
    }
    
    // This function takes a div and 
    // returns its values as a JSON string.
    my.store = function(doc) {
        // Initialize the dictionary.
        var doc_json = {};
        
        // Get the name and fix the capitalization.
        var name_str = doc.find('.icon').find('.name').text();
        doc_json.name = formatWordSet(name_str.toLowerCase().split(' '), ' ');
        
        // Info section; we'll need it from here onwards.
        var info = doc.find('.info');
        
        // Get the level.
        var level_str = info.find('.level').find('.value').text();
        doc_json.level = parseInt(level_str);
        
        // Get the slot(s).
        var slot_strs = info.find('.slot').find('.value').text();
        doc_json.slots = unformatWordString(slot_strs);
        
        // Get the type(s).
        var type_strs = info.find('.type').find('.value').text();
        if (type_strs.length > 0) {
            doc_json.types = unformatWordString(type_strs);
        } else {
            doc_json.types = null;
        }
        
        // Get the text.
        var text_str = info.find('.text').find('.value').html();
        doc_json.text = text_str.replace(/<br>/g, '\n');
        
        // Turn into JSON.
        return JSON.stringify(doc_json, null, 2);
    }
    
	return my;
}());
