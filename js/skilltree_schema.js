// Module with methods which reads in slots.
var SkilltreeSchema = (function () {
    var my = {};
    var data = null;

    // Load the default slots and their costs.
    my.initialize = function(callback) {
        if (data != null) {
            return;
        }
        var slot_file = 'file://C:/Users/Kevin/Documents/HTML/p&p/slots.json';
        $.getJSON(slot_file, function(data_param) {
            data = data_param;
            callback();
        });
    }
    
    // Get the dictionary for a given slot.
    my.get = function(slot, index) {
        // If index is an integer instead of null,
        // we're dealing with a multi-slot.
        var slot_obj = data[slot];
        if (index) {
            slot_obj = slot_obj[index - 1];
        }
        return slot_obj;
    }
    
	return my;
}());
