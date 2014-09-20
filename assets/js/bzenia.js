// Prevent opening Featherlight lightbox when touching Swiper.
var swiperActive = false;

// Initialize Swiper.
var gallerySwiper = new Swiper('.swiper-container', {
  slideElement: "li",
  slidesPerView: "auto",
  calculateHeight: true,
  onTouchMove: function() {
    swiperActive = true;
  },
  onTouchEnd: function() {
    setTimeout(function() {
      swiperActive = false;
    }, 250);
  }
});

// Trigger Featherlight lightbox on click.
$("[data-js-featherlight]").on("click", function(e) {
  e.preventDefault();
  if (!swiperActive) {
    $.featherlight(this.href, {
      closeOnClick: "anywhere",
      type: {image: true}
    });
  }
});