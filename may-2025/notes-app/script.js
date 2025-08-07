$(document).ready(function() {
    function renderNotes() {
        var notes = JSON.parse(localStorage.getItem('notes')) || [];
        var $notesList = $('#notes-list');
        $notesList.empty();
        notes.forEach(function(note, index) {
            var $li = $('<li>').text(note).append(
                $('<button>')
                    .addClass('delete-note')
                    .attr('data-index', index)
                    .text('×')
            );
            $notesList.append($li);
        });
    }

    $('#add-note').on('click', function() {
        var noteText = $('#note-input').val().trim();
        if (noteText) {
            var notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.push(noteText);
            localStorage.setItem('notes', JSON.stringify(notes));
            $('#note-input').val('');
            renderNotes();
        }
    });

    $('#notes-list').on('click', '.delete-note', function() {
        var index = $(this).data('index');
        var notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
    });

    renderNotes();
});