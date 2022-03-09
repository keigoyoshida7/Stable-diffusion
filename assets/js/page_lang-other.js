
var swipeObject;

if (PJAX.maincontents.isTransition() === false) {
	document.addEventListener("DOMContentLoaded", GAS_pjaxDOMContentLoaded, false);
}

function GAS_pjaxDOMContentLoaded() {
	var body = document.getElementsByTagName("body")[0];
	var kv = document.getElementById("kv");
	Keyvisual.slideshow.target = document.getElementsByClassName("slideshow")[0];
	Keyvisual.slideshow.reel = Keyvisual.slideshow.target.getElementsByClassName("img-reel")[0];
	Keyvisual.slideshow.items = Keyvisual.slideshow.reel.getElementsByClassName("img-reel__item");
	Keyvisual.slideshow.init();
	
	ModalWindow._container = document.getElementById("pushstate-target");
	ModalWindow.init();
	
	if (UA.os === "ios") {
		kv.style.height = window.innerHeight + "px";
	}
}

function GAS_pjaxOnLoadComplete() {
	swipeObject = new SwipeObject();
	swipeObject.init();
	swipeObject.build();
	
	decisionVerticalImage(document.getElementsByClassName("alternate-block"), "alternate-block__img");
	Keyvisual.slideshow.start();
	Blog.init();
}

function GAS_pjaxDestroyJS() {
	
	if (swipeObject) {
		swipeObject.destroy(swipeObject);
		swipeObject = null;
	}
	
	Blog.destroy();
	Blog = null;
	
	Keyvisual.destroy();
	Keyvisual = null;
	
	ModalWindow.destroy();
	
	GAS_pjaxOnLoadComplete = null;
	GAS_pjaxDOMContentLoaded = null;
	GAS_pjaxDestroyJS = null;
}


var Keyvisual = {
	
	slideshow: {
		
		target: "",
		option: "",
		reel: "",
		length: 0,
		items: "",
		current: 0,
		timeoutId: 0,
		startTimeoutId: 0,
		duration: 0,
		
		init: function (option) {
			var t = this;
			var l = this.length;
			var comp = window.getComputedStyle(this.items[0]);
			var ad = parseInt(comp.getPropertyValue('animation-duration')) * 1000;
			var td = parseInt(comp.getPropertyValue('transition-duration')) * 1000;
			
			this.length = this.items.length;
			this.duration = option ? option.delay : Math.max(ad, td);
			
			for (var i = 0; i < this.length; i++) {
				var img = this.items[i].getElementsByClassName("img-reel__item-bg")[0];
				var inner;
				if (img.tagName === "IMG") {
					var url = img.getAttribute("src");
					inner = this.items[i].getElementsByClassName("img-reel__item-inner")[0];
					inner.style.backgroundImage = "url(" + url +")";
				}
			}
		},
		
		start: function() {
			var num = 0;
			var first = this.items[num];
			first.classList.add("current");
			this.current = num;
			this.play(num);
			
			this.startTimeoutId = setTimeout(function() {
				first.getElementsByClassName("img-reel__item-bg")[0].classList.remove("animation");
			}, this.duration);
		},
		
		play: function(n) {
			var i, l;
			var t = this;
			var n = n ? n : 0;
			
			this.current = n;
			this.timeoutId = setTimeout(function() {
				var n = t.current === t.length - 1 ? 0 : t.current + 1;
				t.next(n);
				t.play(n);
			}, this.duration);
		},
		
		next: function (n) {
			
			var prevNum = n - 1;
			
			if (prevNum < 0) {
				prevNum = this.length - 1;
			}
			
			for (var i = 0; i < this.length; i++) {
				var target = this.reel.getElementsByClassName("img-reel__item")[i];
				target.classList.remove("current");
				target.classList.remove("prev");
				
				if (i === n) {
					target.classList.add("current");
				} else if (i === prevNum) {
					target.classList.add("prev");
				}
			}
			
			this.current = n;
		},
		
		destroy: function(t) {
			clearTimeout(t.timeoutId);
			clearTimeout(t.startTimeoutId);
		}
	},
	
	destroy: function() {
		window.removeEventListener("scroll", Keyvisual.onScroll);
		Keyvisual.slideshow.destroy(Keyvisual.slideshow);
	}
}

var Blog = {
	
	event_resize: undefined,
	gutter: 50,
	
	init: function() {
		
		this.event_resize = function(e) {
			Blog.resize(e);
		}
		Blog.set(this);
		window.addEventListener("resize", this.event_resize, false);
	},
	
	set: function(t) {
		if (window.matchMedia('(min-width:768px)').matches) {
			$('.js-grid').masonry({
				itemSelector: '.article-index__item',
				percentPosition: true,
				gutter: t.gutter,
				transitionDuration: 0
			});
		} else {
			if ($('.js-grid').masonry()) {
				$('.js-grid').masonry('destroy');
			}
		}
		InViewElement.manage.reset(InViewElement.manage);
	},
	
	resize: function(e) {
		Blog.set(Blog);
	},
	
	destroy: function() {
		window.removeEventListener("resize", this.event_resize, false);
		if ($('.js-grid').masonry()) {
			$('.js-grid').masonry('destroy');
		}
	}
}

