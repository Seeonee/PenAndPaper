jQuery(document).ready(function ($) {

    var tiles = $( '.skilltree' ).find('.tile');
    var keepAlerting = true;

    SkilltreeSchema.initialize(function() {
        tiles.each(function() {
            var tile = $(this);
            var slot = Tiles.slotOf(tile);
            var index = Tiles.indexOf(tile);
            var tile_json = SkilltreeSchema.get(slot, index);
            Tiles.initializeTile(tile, tile_json);
        });
    });
    
});
