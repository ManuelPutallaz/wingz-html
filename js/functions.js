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
		asideTimeOut;

	$doc.ready(function(){
		$(window).on('scroll', function(){
			var scroll_top = $(window).scrollTop();
			scroll_top > 95 ? $('.page-header, .top-bar').addClass('minimized') : $('.page-header, .top-bar').removeClass('minimized');
		})
		$('.filler').each(function(){
			var percentFilled = $(this).data('percent'),
				$counter = $(this).parents('.progress-bar').find('.counter');
			$(this).css('width', percentFilled + '%');
			$counter.html( percentFilled + '%<i></i>').css('left', percentFilled + '%')
		})

		var asideTimer,
			asideIsOpen = false;
		
		$('.select-multiple > select').selecter();
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
			asideIsOpen = true;
			$container.animate({'left': '-200px'}); 
			$header.animate({'left': '-200px'});
			$latestNews.animate({'left': '-200px'});
			$userInfo.animate({'left': '-120px'});
			$asideMenu.animate({'right': '0px'}).show();
			event.stopPropagation();
			$container.append('<div class="container-overlay"></div>');
		});

		$('.btn-aside-show').on('click', function(event) {
			event.preventDefault();
			asideIsOpen = true;
			
			var $asideContent = $($(this).attr('href')),
				$latestNewsMinimized = $('.minimized .latest-news'),
				$userInfoMinimized = $('.minimized .user-info');
			var animateOpts = {'left': '-100%', 'margin-left': 234 };

			if( $asideContent.length ) {
				$container.animate( animateOpts ); 
				$header.animate( animateOpts ); 
				$latestNewsMinimized.animate( animateOpts );
				$userInfoMinimized.animate({'left': '-100%', 'margin-left': 80 });

				$asideContent.show().animate({'left': 234, 'right': '0'});

				event.stopPropagation();
				$container.find('.container-overlay').remove();
				$container.append('<div class="container-overlay"></div>');
			}
		});

		

		var asideClose = function(event) {
			event.preventDefault()
			var resetOpts = {'left': '0px', 'margin-left': 0 };
			if(asideIsOpen) {
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
				clearTimeout(asideTimeOut)
				$('.container-overlay').remove();

				
				asideIsOpen = false;
			}
		}

		$container.on('click', '.container-overlay', asideClose );
		$asideContent.on('click', '.btn-back, .btn-cancel, .btn-close', asideClose );

		$doc.on('mouseleave', '.aside-menu', function() {
			var resetOpts = {'left': '0px', 'margin-left': 0 };
			asideTimeOut = setTimeout(function(){
				$('.container-overlay').remove();
				$('.aside-menu').hide();
				$('.aside-content').hide();
				$container.animate( resetOpts );
				$header.animate(resetOpts);
				$latestNews.animate(resetOpts);
				$userInfo.animate({'left': '80px', 'margin-left': 0});
				$asideMenu.animate({'right': '-200px'}); 
				
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
					$points.css('opacity', 1)
				},
				stop: function( event, ui) {
					$points.css('opacity', 0)	
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