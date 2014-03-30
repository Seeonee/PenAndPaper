jQuery(document).ready(function ($) {

    root = 'file://C:/Users/Kevin/Documents/GitHub/PenAndPaper/json/';
    index_files = ['_index.json'];
    container = $('.container');

    // First, scrape the search terms.
    DocModule.initializeQueries();
    
    // Load the test document(s).
    $.each(index_files, function(i, file) {
        $.getJSON(root + file, parseIndex);
    });
    
    function parseIndex(data) {
        $.each(data, function(k, v) {
            name = k;
            level = v.level.toString();
            slots = v.slots;
            types = v.types;
            if (DocModule.doesValueMatch(name.replace(/_/g, ' '), 'name') &&
                  DocModule.doesValueMatch(level.replace(/_/g, ' '), 'level') &&
                  DocModule.doesValueMatch(slots.replace(/_/g, ' '), 'slot', true) &&
                  DocModule.doesValueMatch(types.replace(/_/g, ' '), 'type')) {
                $.getJSON(root + name, parseBeforeTextFiltering);
            }
        });
    }

    // Parse JSON into a document element.
    function parseBeforeTextFiltering(data) {
        if (DocModule.doesValueMatch(data.text, 'text')) {
            parse(data);
        }
    }
    
    function parse(data) {
        var doc = DocModule.parse(data);
        DocModule.addSaveButton(doc);
        DocModule.addCopyButton(doc, container);
        
        // Add it all to the container.
        doc.appendTo(container);
        doc.slideDown('slow');
    }
    
    $('.add_more').click(function() {
        var new_doc = {};
        new_doc.name = 'Skillname';
        new_doc.level = 1;
        new_doc.slots = ['slot'];
        new_doc.types = null;
        new_doc.text = 'Add your skill\'s description here.';
        parse(new_doc);
    });
    
});
