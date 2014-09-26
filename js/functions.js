$(function() {
	$('select.custom').selectBoxIt({
		showEffect: "fade",
		hideEffect: "fade"
	});

	var $doc = $(document),
		$header = $('.page-header'),
		$latestNews = $('.latest-news'),
		$latestNewsMinimized = $('.minimized .latest-news'),
		$userInfo = $('.user-info'),
		$userInfoMinimized = $('.minimized .user-info'),
		$container = $('.page-wrapper'),
		$asideContent = $('.aside-content'),
		$asideMenu = $('.aside-menu'),
		$asideMenuClose = $('.aside-menu-close'),
		asideTimeOut;
	var $btn = $('.btn-placeholder .btn');
	var btnOffsetTop = 0;

	if( $btn.length ) {
		btnOffsetTop = $btn.offset().top
	}

	$doc.ready(function(){
		$(window)
			.on('scroll', function(){
				var scroll_top = $(window).scrollTop();
				var winWidth = getWindowWidth();

				if ( scroll_top > 95 ) {
					$('.page-header, .top-bar').addClass('minimized');
				} else if ( scroll_top <= 95 && winWidth > 640 ) {
					if ( !$('.page-header').hasClass('always-minimized')) {
						$('.page-header, .top-bar').removeClass('minimized');
					}
				}

				if( btnOffsetTop - scroll_top <= 132 ) {
					$btn.addClass('btn-fixed');
				} else {
					$btn.removeClass('btn-fixed')
				}
			})
			.on('resize', function() {
				var winWidth = getWindowWidth();

				if ( winWidth <= 640 || winWidth > 640 && $('.always-minimized').length !== 0) {
					$('.page-header, .top-bar').addClass('minimized');
				} else if ( winWidth > 640 && $(window).scrollTop() === 0 && $('.always-minimized').length === 0 ) {
					$('.page-header, .top-bar').removeClass('minimized');
				}
			}).resize();

		$('.menu').on('click', function(e) {
			e.preventDefault();
			$('.page-header').toggleClass('nav-opened');
			$('.nav .dd').hide();
		});

		$('.nav li:has(.dd) > a').on('click', function(e) {
			var winWidth = getWindowWidth();
			var $dd = $(this).parent().find('.dd:eq(0)');

			if( winWidth <= 640 ) {
				e.preventDefault();
				$dd.show();
			}
		});

		$('.nav-back').on('click', function(e) {
			e.preventDefault();
			$(this).closest('.dd').hide();
		})

		$('.popup-link').colorbox({
			closeBtn: false
		});

		$('#colorbox').on('click', '.popup-close', function(e) {
			e.preventDefault();
			$.colorbox.close();
		});

		$('.latest-news .entry').each(function(){
			var imgSrc = $(this).find('> img').attr('src');
			$(this).css('background-image', 'url(' + imgSrc + ')');
		});

		$('.filler').each(function(){
			var percentFilled = $(this).data('percent'),
				$counter = $(this).parents('.progress-bar').find('.counter');
			$(this).css('width', percentFilled + '%');
			$counter.html( percentFilled + '%<i></i>').css('left', percentFilled + '%')
		})

		var asideTimer,
			asideIsOpen = false;

	
		$('.select-multiple > select').selecter({
			callback: function() {
				var $selectedItems = $(this).find('.selecter-item.selected');


				if ( !$selectedItems.length ) {
					$('.select-multiple .selecter-item[data-value="All"]').addClass('selected');
				}
			}
		});

		$('.select-multiple .selecter-item').on('click', function() {
			if( $(this).data('value') === 'All') {
				$(this).siblings().removeClass('selected');
			} else {
				$('.select-multiple .selecter-item[data-value="All"]').removeClass('selected');
			}
		})

		$('.select-genres > select').selecter();
		$('.select-country > select').selectBoxIt();

		$('.aside-content input:checkbox, .aside-content input:radio').ezMark()

		$('.field-card').inputmask('mask', {'mask': '9999 9999 9999 9999', 'placeholder': '---- ---- ---- ----'});
		$('.field-sec-code').inputmask('mask', {'mask': '999', 'placeholder': '---'});
		$('.field-expire-month').inputmask('m', {'placeholder': 'm'});
		$('.field-expire-year').inputmask('mask', {'mask': '99', 'placeholder': 'YY'});

		$('.label-block').on('click', function(){
			$(this).closest('form').find('.label-block').removeClass('selected');
			$(this).addClass('selected');
		})

		$('#btn-genres').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			asideIsOpen = true;

			var winWidth = getWindowWidth();
			if( winWidth > 640 ) {
				$container.animate({'left': '-200px'}); 
				$header.animate({'left': '-200px'});
				$latestNews.animate({'left': '-200px'});
				$userInfo.animate({'left': '-120px'});
				$asideMenu.animate({'right': '0px'}).show();
			}
			else {
				$asideMenu.css({'right': '0px'}).show();
				$asideMenuClose.addClass('visible');
			}
			$container.append('<div class="container-overlay"></div>');
		});

		$('.btn-aside-show').on('click', function(event) {
			event.preventDefault();
			asideIsOpen = true;
			
			var $asideContent = $($(this).attr('href')),
				$latestNewsMinimized = $('.minimized .latest-news'),
				$userInfoMinimized = $('.minimized .user-info');
			var animateOpts = {'left': '-100%', 'margin-left': 234 };
			var winWidth = getWindowWidth();

			if( $asideContent.length ) {
				if ( winWidth > 640 ) {
					$container.animate( animateOpts ); 
					$header.animate( animateOpts ); 
					$latestNewsMinimized.animate( animateOpts );
					$userInfoMinimized.animate({'left': '-100%', 'margin-left': 80 });

					$asideContent.show().animate({'left': 234, 'right': 0 });
				} else {
					$asideContent.show().css({'left': 0, 'right': 0});
				}

				if( $('.slider').length && !$('.aside-content .bx-wrapper').length ) {
					$('.slider ul.slides').bxSlider({
						mode: 'horizontal',
						speed: 500,
						randomStart: false,
						auto: true,
						pause: 6000,
						adaptiveHeight: true,
						adaptiveHeightSpeed: 200,
						useCSS: false,
						pager: false,
						preloadImages: 'all'
					})
				}

				event.stopPropagation();
				$container.find('.container-overlay').remove();
				$container.append('<div class="container-overlay"></div>');
			}
		});


		var asideClose = function(event) {
			event.preventDefault()
			var resetOpts = {'left': '0px', 'margin-left': 0 };
			var winWidth = getWindowWidth();

			if(asideIsOpen) {
				if( winWidth > 640 ) {
					$container.animate( resetOpts );
					$header.animate(resetOpts);
					$latestNews.animate(resetOpts);
					$userInfo.animate({'left': '80px', 'margin-left': 0 });
					$asideMenu.animate({'right': '-200px'}, function(){
						$asideMenu.hide();					
					});
					$asideContent.animate({ 'left': '100%', 'right': '-100%'}, function(){
						$asideContent.hide();
					});
				} else {
					$asideContent.css({ 'left': '100%', 'right': '-100%'});
					$asideMenu.css({'right': '-100%'});
					$asideMenu.hide();					
					$asideMenuClose.removeClass('visible');
				}
				clearTimeout(asideTimeOut)
				$('.container-overlay').remove();

				
				asideIsOpen = false;
			}
		}

		$asideMenuClose.on('click', asideClose )
		$container.on('click', '.container-overlay', asideClose );
		$asideContent.on('click', '.btn-back, .btn-cancel, .btn-close', asideClose );

		$doc.on('mouseleave', '.aside-menu', function() {
			var resetOpts = {'left': '0px', 'margin-left': 0 };
			var winWidth = getWindowWidth();

			asideTimeOut = setTimeout(function(){
				$('.container-overlay').remove();
				if( winWidth > 640 ) {
					$container.animate( resetOpts );
					$header.animate(resetOpts);
					$latestNews.animate(resetOpts);
					$userInfo.animate({'left': '80px', 'margin-left': 0});
					$asideMenu.animate({'right': '-200px'}); 
				} else {
					$asideContent.css({ 'left': '100%', 'right': '-100%'});
					$asideMenu.css({'right': '-100%'});
					$asideMenu.hide();					
					$asideMenuClose.removeClass('visible');
				}
				$('.aside-menu').hide();
				$('.aside-content').hide();
				
			}, 3000);

		});
		$asideMenu.on('mouseover', function(){
			clearTimeout(asideTimeOut)
		});

		$('.icons li').tooltip({position: { my: "center-10 top+20", at: "right center" } });

		$('.rate-slider').each(function(){
			var $self = $(this),
				$points = $self.find('.points'),
				$points_field = $self.find('.points-field'),
				$counter = $self.find('.points-counter');

			$self.slider({
				value: $counter.text(),
				min: 0,
				max: 100,
				range: 'min',
				step: 1,
				slide: function( event, ui ) {
					var $handle = $self.find('.ui-slider-handle');
					$counter.text( ui.value );
					$points_field.val( ui.value );
					$points.css('left', ui.value + '%' ).attr('class', 'points color color-'+ ui.value);
					$points.find('i').attr('class', 'color color-'+ ui.value);
				},
				start: function( event, ui) {
					$points.css({ 'opacity': 1, 'visibility': 'visible' });
				},
				stop: function( event, ui) {
					$points.css({ 'opacity': 0, 'visibility': 'hidden' });
				}
			});
			$counter.val( $self.slider( "value" ) );
			$points.css( 'left', $self.slider( "value" ) + '%' ).attr('class', 'points color color-'+  $self.slider( "value" ));
			$points_field.val( $self.slider( "value" ) );
			$points.find('i').attr('class', 'color color-' +  $self.slider( "value" ));
		});

		$('.video-player .play').on('click', function(){
			$(this).toggleClass('pause');
		})

		$('.rate-form').on('submit', function(e){
			e.preventDefault();

			$('.rate-form').hide();
			$('.rate-form-submitted').fadeIn(function(){
				setTimeout(function() {
					$('.rate-form-submitted').fadeOut();
				}, 3000);
			});
		})

	})

	$('.sort-btn').on('click', function(event){
		event.preventDefault();
		$(this).closest('.board-row-sort').find('.sort-btn').not($(this)).removeClass('selected')
		// $(this).hasClass('selected') ? $(this).toggleClass('desc') : $(this).addClass('selected');
		$(this).toggleClass('desc')
		$(this).addClass('selected');
	})


	$('.field-num').keydown(numbers);

	$('a[data-scroll]').on('click', function(event){
		event.preventDefault();
		var anchor = $(this).data('scroll'),
			headerHeight = 48;
		if( $(anchor).length ) {
			var scrollPos = $(anchor).offset().top - headerHeight;
			$('html, body').animate({ scrollTop: scrollPos });
		}
	});

	// tabs
	$('.tabs').find('.tab:not(:first-child)').hide();

	$('.tabs-nav ul:not(.ext-links)').on('click', 'a', function(e){

		var $this = $(this),
			$parent = $this.parent(),
			$tabs = $parent.closest('.tabs').find('.tab');

		$tabs.hide();
		$tabs.eq($parent.index()).show();

		$parent.addClass('current').siblings().removeClass('current');

		e.preventDefault();

	});

	var numbers = function(event) {
	    if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
	        (event.keyCode == 65 && event.ctrlKey === true) || 
	        (event.keyCode >= 35 && event.keyCode <= 39)) {
	             return;
	    }
	    else {
	        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
	            event.preventDefault(); 
	        }   
	    }
	}

	function getWindowWidth() {
		return (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
	}

	function getWindowHeight() {
		return (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
	}
});


