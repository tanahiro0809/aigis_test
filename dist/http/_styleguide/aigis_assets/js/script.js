(function() {
  var $body = document.body;
  var navModifier = ' aigis--navclose';
  var navPattern = new RegExp(navModifier);
  var $navButton = document.querySelector('.aigis-toggleNav');

  $navButton.addEventListener('click', function() {
    if (navPattern.test($body.className) === true) {
      $body.className = $body.className.replace(navModifier, '');
    } else {
      $body.className += navModifier;
    }
  });

  var colorModifier = ' theme-dark';
  var colorPattern = new RegExp(colorModifier);
  var $colorButton = document.querySelector('.aigis-toggleColor');

  $colorButton.addEventListener('click', function() {
    if (colorPattern.test($body.className) === true) {
      $body.className = $body.className.replace(colorModifier, '');
    } else {
      $body.className += colorModifier;
    }
  });



  var $invite = $('.sample');
  var $inviteIcon = $invite.find('.sw-inviteBtn');

  $invite.on('mouseenter', function() {
    $inviteIcon.removeClass('is-active');
    $inviteIcon.addClass('is-enter');
  });
  $invite.on('mouseleave', function() {
    $inviteIcon.addClass('is-active');
    $inviteIcon.removeClass('is-enter');
  });

}());