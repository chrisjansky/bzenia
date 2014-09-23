$(document).on("ready pjax:success", function() {
  var
    $body = $("body"),
    $pjaxWhole = $("#js-pjax--whole"),
    // Prevent opening Featherlight lightbox when touching Swiper.
    swiperActive = false;

  // Set-up pjax.
  if ($.support.pjax) {

    $body.addClass("is-ready");

    $(document).on("click", "[data-pjax--whole]", function(event) {
      $.pjax.click(event, {
        container: $pjaxWhole,
        fragment: "#js-pjax--whole"
      });
    });

    $(document).on("click", "[data-pjax--aside]", function(event) {
      $.pjax.click(event, {
        container: $("#js-pjax--aside"),
        fragment: "#js-pjax--main"
      });
    });

    $pjaxWhole.on({
      'pjax:send': function() {
        $body.addClass("is-loading");
      },
      'pjax:complete': function() {
        $body.removeClass("is-loading");
      }
    });

  }

  // Initialize Swiper.
  var
    $gallery = $(".m-gallery"),
    galleryStartClass = "m-gallery--start",
    galleryEndClass = "m-gallery--end",
    gallerySwiper = new Swiper('.swiper-container', {
      slideElement: "li",
      slidesPerView: "auto",
      calculateHeight: true,
      keyboardControl: true,
      visibilityFullFit: true,
    onTouchMove: function() {
      swiperActive = true;
    },
    onTouchEnd: function() {
      setTimeout(function() {
        swiperActive = false;
      }, 250);
    },
    onFirstInit: function() {
      $gallery.addClass(galleryStartClass);
    },
    onSlideChangeStart: function(swiper) {
      var
        firstIsActive = swiper.activeIndex === 0,
        lastIsActive = (" " + swiper.getLastSlide().className + " ").indexOf(" swiper-slide-visible ") > -1;
      $gallery
        .toggleClass(galleryStartClass, firstIsActive)
        .toggleClass(galleryEndClass, lastIsActive);
    }
  });
  $("[data-swiper--prev]").on("click", function(e) {
    e.preventDefault();
    gallerySwiper.swipePrev();
  });
  $("[data-swiper--next]").on("click", function(e) {
    e.preventDefault();
    gallerySwiper.swipeNext();
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

});