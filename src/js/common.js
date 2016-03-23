// loader
$(window).on('load', function () {
    $('#loader-wrapper').fadeOut('slow');
    $('#loader-wrapper .loader__in').fadeOut('slow');
});

head.ready(function(){

// Fancybox
	$('.portfolio-fancybox').fancybox({
		theme: 'light',
		padding: 5,
		openEffect	: 'drop',
		closeEffect	: 'drop',
		prevEffect: 'none',
		nextEffect: 'none',
		locked: true,
		locale: 'ru',
		locales: {
			'ru': {
				CLOSE: 'закрыть',
				EXPAND: 'показать в полном размере'
			}
		},
		afterShow: function(){
			$.fn.fullpage.setMouseWheelScrolling(false);
		},
		afterClose: function(){
			$.fn.fullpage.setMouseWheelScrolling(true);
		}
	});

// Signature Animation
	// stroke-dashoffset
	function SignatureDashOffset() {
		for (var i = 0; i < $('#signature path').size(); i++) {
			var _this = $('#signature path').eq(i);
			var _thisSnap = Snap('#signature path:nth-child('+(i+1)+')');
			var _thisLength = _thisSnap.getTotalLength();
			_this.attr('stroke-dashoffset', _thisLength + 7);
			_this.attr('stroke-dasharray', _thisLength + 5);
		}
	}
	SignatureDashOffset();

	// get SVG attributes for animation
	var svgState = false;
	var currentAnimation;
	var animationDelay = [];
	var currentAnimationDelay = 0;
	function SignatureSVG() {
		currentAnimationDelay = 0;
		$('#signature').find('path').each(function(){
			var dashSVG = parseInt($(this).attr('stroke-dashoffset'));
			var speedSVG = parseInt($(this).attr('data-svg-speed'));
			var delaySVG = parseInt($(this).attr('data-svg-delay'));
			if (delaySVG == null) {
				delaySVG = 0;
			}
			var tempSVG = $(this);
			animationDelay[currentAnimationDelay] = setTimeout(function(){
				currentAnimation = Snap.animate(dashSVG, 0, function (val) {
					tempSVG.attr({
				        'stroke-dashoffset': val
				    });
				}, speedSVG);
			}, delaySVG);
			currentAnimationDelay++;
		});
	}
// FullPage
	var tooltipsCustom = ['Главная', 'Портфолио', 'О себе', 'Контакты'];
	$('#fullpage').fullpage({
		navigation: true,
		afterRender: function(){
			var tooltipsCustomIndex = 0;
        	$('#fp-nav li').each(function(){
        		$(this).children('a').append('<div class="fp-tooltip-custom">'+tooltipsCustom[tooltipsCustomIndex]+'</div>');
        		tooltipsCustomIndex++;
        	});
		}
	});

// Main Slider
	$('.slider-main').slick({
		dots: true,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 20000,
		pauseOnHover: false,
		touchMove: false,
		swipe: false,
		initialSlide: 1
	});
	// IE fix
	setTimeout(function(){
		$('.slider-main').slick('slickGoTo', '0', true);
	},1);
	

// Cover image
	$(window).load(function(){
		$('.cover-img').backgroundCover();
		ResizeImg();
	});

// Portfolio
	function resizeHeight(){
		var pfWidth = $('.portfolio li:first-child')[0].getBoundingClientRect().width;
		$('.portfolio li').css('height', Math.floor(pfWidth));
	}
	function ResizeImg(){
		$('.cover-img').each(function(){
			$(this).css('left', ($(window).width() - $(this).width())/2);
		});
	}
	resizeHeight();
	$(window).resize(function(){
		resizeHeight();
		ResizeImg();
	});

// Clear placeholder
	(function() {
		$('input,textarea').focus(function(){
				$(this).data('placeholder',$(this).attr('placeholder'))
				$(this).attr('placeholder','');
		});
		$('input,textarea').blur(function(){
			$(this).attr('placeholder',$(this).data('placeholder'));
		});
	}());

// Ajax Form
	(function () {
		var inner = $('.contacts-form'),
			result = $('.form-success'),
			load = $('.form-loading'),
			newForm = $('.form-new');
		$.validate({
			borderColorOnError: '',
			onSuccess : function() {
				load.fadeIn();
				post_data = $('#contacts_form').serialize();
				
				//Ajax post data to server
				$.post('send.php', post_data, function(response){  
				    if (response.type == 'error'){ //load json data from server and output message     
				        output = '<div class="error">'+response.text+'</div>';
				    }
				    else {
				        output = '<div class="success">'+response.text+'</div>';
				        // reset values in all input fields
				        inner.hide();
				        load.hide();
				        result.fadeIn();
				        newForm.fadeIn();
				    }
				}, 'json');
				return false;
			}
		});
	}());

// New Message
	$('.btn-new').on('click', function(){
		$('.form-new').hide();
		$('.form-success').hide();
		$('.contacts-form').find("input[type=text], textarea").val("");
		$('.contacts-form').fadeIn();
	});

// New Message
	$('.btn-new').on('click', function(){
		$('.form-new').fadeOut();
		$('.form-success').fadeOut();
		$('.contact-form').find("input[type=text], textarea").val("");
		$('.contact-form').fadeIn();
	});

// js-inview
	$('.js-inview').bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
		if (isInView) {
				if (visiblePartY == 'top') {
				// top part of element is visible
			} else if (visiblePartY == 'bottom') {
				// bottom part of element is visible
			} else {
				// whole part of element is visible
				$(this).addClass('animated');
			}
		} else {
			// element has gone out of viewport
			$(this).removeClass('animated');
		}
	});

// svg-inview
	$('.svg-inview').bind('inview', function(event, isInView, visiblePartX, visiblePartY) {
		if (isInView) {
				if (visiblePartY == 'top') {
				// top part of element is visible
			} else if (visiblePartY == 'bottom') {
				// bottom part of element is visible
			} else {
				// whole part of element is visible
				SignatureSVG();
			}
		} else {
			// element has gone out of viewport
			for (var i = 0; i < animationDelay.length; i++) {
				clearTimeout(animationDelay[i]);
			}
			if (currentAnimation) {
				currentAnimation.stop();
			}
			SignatureDashOffset();
		}
	});

// Clipboard
	new Clipboard('.clipboard-btn');
	
});