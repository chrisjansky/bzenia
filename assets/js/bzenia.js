// var paperscript = {};

// alert("lol");

$('.m-brief')
  .waypoint(function(direction) {
    $("body").toggleClass("offscreen--not-active offscreen--is-active");
  // }, {
  //   offset: function() {
  //     return $(this).height() / 2;
  //   }
  });
$('.m-hero')
  .waypoint(function(direction) {
    $(this).toggleClass("is-active");
  }, {
    offset: function() {
      return $(this).height() / 2;
    }
  });

// function updateCanvas() {
  // console.log(ulozeno);
  // paperscript.makeBlack();
  // ulozeno.view.path.fillColor = "yellow";
  // return false;
// }