// Module with methods which find and manipulate tiles.
var Tiles = (function () {
    var my = {};

    var default_classes = [
        "tile",
        "background",
        "activated",
        "clickable"
    ];
    // Get a tile's slot name.
    my.slotOf = function(tile_div) {
        var found_name = null;
        var upgrade = false;
        $.each(tile_div.attr('class').split(' '), function(k, v) {
            var class_name = $.trim(v);
            if (jQuery.inArray(class_name, default_classes) < 0) {
                if (class_name == 'upgrade') {
                    upgrade = true;
                } else {
                    found_name = class_name;
                }
            }
        });
        if (upgrade) {
            found_name = found_name + '_upgrade';
        }
        return found_name;
    }
    
    // Get a tile's index; some tiles
    // exist multiple times on the skilltree,
    // each with a different index.
    // For singletons, returns null.
    my.indexOf = function(tile_div) {
        var index = tile_div.data('instance');
        if (index) {
            return parseInt(index);
        }
        return null;
    }
    
    // Here's the magic.
    // Take a tile and the JSON describing it,
    // and update its initial state.
    my.initializeTile = function(tile_div, tile_json) {
        var anyUnlocked = false;
        
        tile_div.find('.levelBox').each(function(i) {
            var levelBox = $(this);
            var levelBox_json = tile_json[(1 + i).toString()];
            if (levelBox_json.locked == 1) {
                levelBox.addClass('locked');
                levelBox.addClass('clickable');
            } else if (!levelBox_json.default == 1) {
                if (!anyUnlocked) {
                    levelBox.addClass('clickable');
                    anyUnlocked = true;
                }
            }
        });
        if (anyUnlocked) {
            tile_div.addClass('clickable');
        }
    }
    
	return my;
}());
