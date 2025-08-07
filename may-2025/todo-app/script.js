$(document).ready(function() {
  const $input = $('#new-todo');
  const $list = $('#todo-list');

  function addTodo() {
    const text = $input.val().trim();
    if (!text) return;
    const $item = $('<li>').text(text);
    const $removeBtn = $('<button>').addClass('remove-btn').html('&times;');
    $item.append($removeBtn);
    $list.append($item);
    $input.val('');
  }

  $('#add-btn').on('click', addTodo);
  $input.on('keypress', function(e) {
    if (e.which === 13) {
      addTodo();
    }
  });

  $list.on('click', 'li', function(e) {
    if (e.target.tagName !== 'BUTTON') {
      $(this).toggleClass('completed');
    }
  });

  $list.on('click', '.remove-btn', function(e) {
    e.stopPropagation();
    $(this).parent().remove();
  });
});