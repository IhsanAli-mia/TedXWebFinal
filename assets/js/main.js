/*
	Twenty by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {


	var	$window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$banner = $('#banner'),
		settings = {

			// Carousels
				carousels: {
					speed: 3,
					fadeIn: true,
					fadeDelay: 250
				},

		};

		var $banner = $('#banner'),
    h     = window.innerHeight;
		v     = window.innerWidth;

		$("#intro2").height($("#img1").height());

		console.log("%cEaster Egg Lmao.", "color: white;background:red; font-size: x-large");
		console.log("%cPlease ignore the weird logs, can't really do much about that", "color: white;background:blue; font-size: medium");


$banner.css('max-height', h);
$banner.css('min-height', h);


	// Breakpoints.
		breakpoints({
			wide:      [ '1281px',  '1680px' ],
			normal:    [ '981px',   '1280px' ],
			narrow:    [ '841px',   '980px'  ],
			narrower:  [ '737px',   '840px'  ],
			mobile:    [ null,      '736px'  ]
		});

		/**
		 * Applies parallax scrolling to an element's background image.
		 * @return {jQuery} jQuery object.
		 */
		$.fn._parallax = function(intensity) {

			var	$window = $(window),
				$this = $(this);

			if (this.length == 0 || intensity === 0)
				return $this;

			if (this.length > 1) {

				for (var i=0; i < this.length; i++)
					$(this[i])._parallax(intensity);

				return $this;

			}

			if (!intensity)
				intensity = 0.25;

			$this.each(function() {

				var $t = $(this),
					$bg = $('<div class="bg"></div>').appendTo($t),
					on, off;

				on = function() {

					$bg
						.removeClass('fixed')
						.css('transform', 'matrix(1,0,0,1,0,0)');

					$window
						.on('scroll._parallax', function() {

							var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

							$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

						});

				};

				off = function() {

					$bg
						.addClass('fixed')
						.css('transform', 'none');

					$window
						.off('scroll._parallax');

				};

				// Disable parallax on ..
					if (browser.name == 'ie'			// IE
					||	browser.name == 'edge'			// Edge
					||	window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
					||	browser.mobile)					// Mobile devices
						off();

				// Enable everywhere else.
					else {

						breakpoints.on('>large', on);
						breakpoints.on('<=large', off);

					}

			});

			$window
				.off('load._parallax resize._parallax')
				.on('load._parallax resize._parallax', function() {
					$window.trigger('scroll');
				});

			return $(this);

		};

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly({
		});

	// Dropdowns.
		$('#nav > ul').dropotron({
			mode: 'fade',
			noOpenerFade: true,
			expandMode: (browser.mobile ? 'click' : 'hover')
		});

	// Nav Panel.

		// Button.
			$(
				'<div id="navButton">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

		// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
			if (browser.os == 'wp' && browser.osVersion < 10)
				$('#navButton, #navPanel, #page-wrapper')
					.css('transition', 'none');

	// Header.
		if (!browser.mobile
		&&	$header.hasClass('alt')
		&&	$banner.length > 0) {

			$window.on('load', function() {

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt reveal'); },
					leave:		function() { $header.removeClass('alt'); }
				});

			});

		}
		// Carousels.
			$('.carousel').each(function() {

				var	$t = $(this),
					$forward = $('<span class="forward"></span>'),
					$backward = $('<span class="backward"></span>'),
					$reel = $t.children('.reel'),
					$items = $reel.children('article');

				var	pos = 0,
					leftLimit,
					rightLimit,
					itemWidth,
					reelWidth,
					timerId;

				// Items.
					if (settings.carousels.fadeIn) {

						$items.addClass('loading');

						$t.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							enter: function() {

								var	timerId,
									limit = $items.length - Math.ceil($window.width() / itemWidth);

								timerId = window.setInterval(function() {
									var x = $items.filter('.loading'), xf = x.first();

									if (x.length <= limit) {

										window.clearInterval(timerId);
										$items.removeClass('loading');
										return;

									}

									xf.removeClass('loading');

								}, settings.carousels.fadeDelay);

							}
						});

					}

				// Main.
					$t._update = function() {
						pos = 0;
						rightLimit = (-1 * reelWidth) + $window.width();
						leftLimit = 0;
						$t._updatePos();
					};

					$t._updatePos = function() { $reel.css('transform', 'translate(' + pos + 'px, 0)'); };

				// Forward.
					$forward
						.appendTo($t)
						.hide()
						.mouseenter(function(e) {
							timerId = window.setInterval(function() {
								pos -= settings.carousels.speed;

								if (pos <= rightLimit)
								{
									window.clearInterval(timerId);
									pos = rightLimit;
								}

								$t._updatePos();
							}, 10);
						})
						.mouseleave(function(e) {
							window.clearInterval(timerId);
						});

				// Backward.
					$backward
						.appendTo($t)
						.hide()
						.mouseenter(function(e) {
							timerId = window.setInterval(function() {
								pos += settings.carousels.speed;

								if (pos >= leftLimit) {

									window.clearInterval(timerId);
									pos = leftLimit;

								}

								$t._updatePos();
							}, 10);
						})
						.mouseleave(function(e) {
							window.clearInterval(timerId);
						});

				// Init.
					$window.on('load', function() {

						reelWidth = $reel[0].scrollWidth;

						if (browser.mobile) {

							$reel
								.css('overflow-y', 'hidden')
								.css('overflow-x', 'scroll')
								.scrollLeft(0);
							$forward.hide();
							$backward.hide();

						}
						else {

							$reel
								.css('overflow', 'visible')
								.scrollLeft(0);
							$forward.show();
							$backward.show();

						}

						$t._update();

						$window.on('resize', function() {
							reelWidth = $reel[0].scrollWidth;
							$t._update();
						}).trigger('resize');

					});

			});

})(jQuery);
