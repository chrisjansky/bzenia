var
  durationBasic = 250,
  durationLong = 500;

jQuery.easing.def = "easeInOutCubic";

$(document).on("ready pjax:success", function() {
  var
    $body = $("body"),
    $pjaxWhole = $("#js-pjax--whole"),
    $headerNav = $("[data-header]"),
    $logoMain = $("[data-logo]"),
    mapIframe = document.getElementById("js-google_maps"),
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
      "pjax:send": function() {
        $body.addClass("is-loading");
      },
      "pjax:complete": function() {
        $body.removeClass("is-loading");
      }
    });

  }

  // Initialize Swiper.
  var
    $gallery = $(".m-gallery"),
    galleryStartClass = "m-gallery--start",
    galleryEndClass = "m-gallery--end",
    gallerySwiper = new Swiper(".swiper-container", {
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

  // SVG fallbacks.
  if (!Modernizr.svg) {
    $("[data-fallback]").each(function() {
      var
        $this = $(this),
        targetFile = $this.data("fallback");
      $this.after("<img src='" + targetFile + "' alt='PNG Fallback' />");
      $this.hide();
    });
  }

  // Google Maps.
  if (mapIframe !== null) {
    function initMaps() {
      var mapOptions = {
        center: {lat: 48.9730376, lng: 17.2704202},
        zoom: 16,
        scrollwheel: false
      };
      var 
        map = new google.maps.Map(mapIframe, mapOptions),
        infoWindow = new google.maps.InfoWindow(),
        mapMarker = new google.maps.Marker({
          position: mapOptions.center,
          map: map,
          title: "Bzenia"
        })
      google.maps.event.addListener(mapMarker, "click", function() {
        infoWindow.setContent("Sklep č. 6, ul. Karla Čapka 1542, 696 81 Bzenec");
        infoWindow.open(map, mapMarker);
      });
    }
    initMaps();
  }

  // Header waypoint.
  if (!Modernizr.touch) {
    $body
      .waypoint(function(direction) {
        $headerNav
          .toggleClass("header--is-passive", direction === "down")
          .toggleClass("header--is-top", direction !== "down");
      },
      {
        offset: function() {
          return -Math.round(($(window).height() * 0.05));
        }
      });
  }

  // Accordion.
  var $accordList = $("[data-accordion]");
  if ($accordList.length > 0) {
    var
      $accordItems = $("[data-accordion-item]");

    $accordItems.not("[data-opened]").find("[data-accordion-more]").hide();
    $accordItems.on("click", function() {
      var $this = $(this);

      $this.find("[data-accordion-more]").slideToggle(durationBasic);
      $this.siblings().find("[data-accordion-more]").slideUp(durationBasic);
    });
  }

  // Paperscript.
  var paperCanvas = document.getElementById("js-waves");

  if (paperCanvas !== null) {
    paper.install(window);
    paper.setup(paperCanvas);
    var width, height, center, tool;
    var points = 4;
    if (tool == undefined) {
      tool = new Tool();
    }
    tool.activate();

    var mousePos = view.center;
    var pathHeight = mousePos.y;

    var pathWave = new Path({
      // fillColor: "#474a4d",
      fillColor: "black",
      opacity: 0.375
    });

    initializePath();

    function initializePath() {
      center = view.center;
      width = view.size.width;
      height = view.size.height * 0.5;

      pathWave.segments = [];
      pathWave.add(view.bounds.topLeft);
      pathWave.add(0, view.size.height * 0.75);
      for (var i = 1; i < points; i++) {
        var point = new Point(width / points * i, center.y);
        pathWave.add(point);
      }
      pathWave.add(width, view.size.height * 0.125);
      pathWave.add(view.bounds.topRight);
    }

    if (!Modernizr.touch) {
      tool.onMouseMove = function(event) {
        mousePos = event.point;
      }
    }

    view.onFrame = function(event) {
      pathHeight += (center.y - mousePos.y - pathHeight) / 10;
      for (var i = 2; i < points; i++) {
        var sinSeed = event.count + (i + i % 10) * 150;
        var sinHeight = Math.sin(sinSeed / 50) * pathHeight;
        var yPos = Math.sin(sinSeed / 100) * sinHeight + height;
        pathWave.segments[i].point.y = yPos;
      }
      pathWave.smooth();
    }

    tool.onResize = function(event) {
      initializePath();
    }
  }

});