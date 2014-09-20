var
  $body = $("body"),
  $pjaxContainer = $("#js-pjax"),
  // Prevent opening Featherlight lightbox when touching Swiper.
  swiperActive = false;

// Set-up pjax.
if ($.support.pjax) {

  $body.addClass("is-ready");

  $(document).on("click", "[data-pjax]", function(event) {
    var
      $currentAnchor = $(this),
      $otherAnchors = $(".o-pages__item").not($currentAnchor),
      pagesClass = "o-pages__item",
      selectedClass = "o-pages__item--selected";

    $.pjax.click(event, {
      container: $pjaxContainer,
      fragment: "#js-pjax"
    });

    if ($currentAnchor.hasClass(pagesClass)) {
      $otherAnchors.removeClass(selectedClass);
      $currentAnchor.addClass(selectedClass);
    }

  });

  $pjaxContainer.on({
    'pjax:send': function() {
      $body.addClass("is-loading");
    },
    'pjax:complete': function() {
      $body.removeClass("is-loading");
    }
  });

}

$(document).on("ready pjax:success", function() {

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

});