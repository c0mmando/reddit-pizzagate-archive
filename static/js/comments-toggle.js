if (typeof jQuery === 'undefined') {
  console.error("jQuery is required for comments-toggle.js.");
}

jQuery(document).ready(function($) {

  // Sets the depth for each comment element based on hierarchy.
  function setCommentDepths() {
    // Select top-level comments: .comment elements not inside another .comment.
    $('.comment').filter(function() {
      return $(this).parents('.comment').length === 0;
    }).each(function() {
      traverseComment($(this), 0);
    });
  }

  // Recursively traverses a comment and its nested comments adding depth data attributes.
  function traverseComment($comment, depth) {
    $comment.attr('data-depth', depth);

    // If no toggle arrow exists, create one and insert it.
    if ($comment.find(".comment-toggle-arrow").length === 0) {
      var $arrow = $('<span class="comment-toggle-arrow" style="cursor:pointer; font-size:18px; margin-right:12px;">&#x25BC;</span>');
      // Insert at the beginning of the first userinfo element.
      $comment.find('.userinfo').first().prepend($arrow);
    }

    // Find direct child comments (only looking for nested .comment elements)
    $comment.children('.comment').each(function() {
      traverseComment($(this), depth + 1);
    });
  }

  // Toggles the collapse of a comment and its child comments based on their depth.
  function toggleComment($comment) {
    var depth = parseInt($comment.attr('data-depth'), 10) || 0;
    $comment.toggleClass('collapsed');

    // Toggle all following sibling comments until we reach a comment at the same (or higher) level.
    $comment.nextAll().each(function() {
      var $next = $(this);
      var nextDepth = parseInt($next.attr('data-depth'), 10);

      if (isNaN(nextDepth)) {
        // If there's no depth, skip.
        return true; // continue looping
      }

      // Stop toggling when we reach a comment that is not nested further.
      if (nextDepth <= depth) {
        return false; // break out of the loop
      }

      $next.toggleClass('hidden');
    });
  }

  // Initialize comment depths and insert toggle arrows.
  setCommentDepths();

  // Bind the click event for toggle arrows.
  $('body').on('click', '.comment-toggle-arrow', function(e) {
    e.preventDefault();

    var $comment = $(this).closest('.comment');
    toggleComment($comment);

    // Update the toggle arrow symbol.
    if ($comment.hasClass('collapsed')) {
      $(this).html('&#x25B2;');
    } else {
      $(this).html('&#x25BC;');
    }
  });

});
