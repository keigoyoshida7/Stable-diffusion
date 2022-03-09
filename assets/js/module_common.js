
var DIRECTORY_LEVEL = 1; // Default : 1

if (location.pathname.indexOf("/en/") > -1) {
	DIRECTORY_LEVEL = 2;
}

////////////////////////////////////////////////////////////////////////////////

/*
 * Copyright (C) 2013-2018 GLIDE ARTS STUDIO.
 */

var UserAgent = function(userAgent) {
	ua: userAgent
}
UserAgent.prototype.ua = navigator.userAgent.toLowerCase();
UserAgent.prototype = {
	
	os: (function(a) {
		var o;
		
		if (a.ua.indexOf("win") > -1) {
			o = "win";
		} else if (a.ua.indexOf("mac") > -1) {
			if (a.ua.indexOf("iphone") > -1 || a.ua.indexOf("ipod") > -1 || a.ua.indexOf("ipad") > -1) {
				o = "ios";
			} else {
				o = "mac";
			}
		} else if (a.ua.indexOf("android") > -1) {
			o = "android";
		} else if (a.ua.indexOf("linux") > -1) {
			o = "linux";
		} else {
			o = "other";
		}
		return o;
	})(UserAgent.prototype),
	
	browser: (function(a) {
		var b;
		if (a.ua.indexOf("msie") > -1 || a.ua.indexOf("trident") > -1) {
			b = "msie";
		} else if (a.ua.indexOf("edge") > -1) {
			b = "edge";
		} else if (a.ua.indexOf("firefox") > -1) {
			b = "firefox";
		} else if (a.ua.indexOf("safari") > -1 && a.ua.indexOf("chrome") == -1) {
			b = "safari";
		} else if (a.ua.indexOf("chrome") > -1) {
			b = "chrome";
		} else {
			b = "other";
		}
		return b;
	})(UserAgent.prototype),
	
	version: (function(a) {
		var v;
		if (a.ua.indexOf("msie") > -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("msie") + 5));
		} else if (a.ua.indexOf("trident") > -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("rv") + 3));
		} else if (a.ua.indexOf("firefox") > -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("firefox") + 8));
		} else if (a.ua.indexOf("safari") > -1 && a.ua.indexOf("chrome") == -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("version") + 8));
		} else if (a.ua.indexOf("chrome") > -1) {
			v = parseInt(a.ua.substring(a.ua.indexOf("chrome") + 7));
		} else {
			v = undefined;
		}
		return v;
	})(UserAgent.prototype),
	
	device: (function(a) {
		var d;
		if (a.ua.indexOf("iphone") > -1) {
			d = "iphone";
		} else if (a.ua.indexOf("ipod") > -1) {
			d = "ipod";
		} else if (a.ua.indexOf("ipad") > -1) {
			d = "ipad";
		} else if (a.ua.indexOf("android") > -1) {
			d = a.ua.indexOf("mobile") > -1 ? "android_mobile" : "android_tablet";
		} else {
			d = "other";
		}
		return d;
	})(UserAgent.prototype)
}
var UA = new UserAgent(navigator.userAgent.toLowerCase());

function setPriorityLanguage() {
	var h = document.getElementsByTagName("html")[0];
	var lang = window.navigator.languages && window.navigator.languages[0];
	
	// get browser language.
	if (lang.indexOf("ja") > -1) {
		h.classList.add("lang--ja");
	} else {
		h.classList.add("lang--no-ja");
	}
	
	// get geolocation in country.
	if ("geolocation" in navigator) {
		/* geolocation is available */
	} else {
		/* geolocation IS NOT available */
	}
}

function addShareElement(container, url, title) {
	
	function build(arg) {
		var li = document.createElement("li");
		var a = document.createElement("a");
		container.appendChild(li);
		li.appendChild(a);
		li.setAttribute("class", arg.className);
		a.setAttribute("href", arg.url);
		a.setAttribute("target", "_blank");
		a.setAttribute("aria-label", arg.label);
		a.innerHTML = arg.html;
		
		if (arg.customData) {
			for (var i = 0; i < arg.customData.length; i++) {
				a.setAttribute(arg.customData[i].label, arg.customData[i].value);
			}
		}
	}
	
	var url = encodeURIComponent(url);
	var title = encodeURIComponent(title);
	
	// Facebook
	build({
		url: "https://www.facebook.com/sharer/sharer.php?u=" + url + "&t=" + title,
		html: '<i class="i-svg icon" title="Facebook" data-icon="icon_sns_facebook"></i>',
		className: "share-item facebook",
		label: ""
	});
	
	// Twitter
	build({
		url:"https://twitter.com/share?text=" + title + "&url=" + url,
		html: '<i class="i-svg icon" title="Twitter" data-icon="icon_sns_twitter"></i>',
		className: "share-item twitter",
		label: ""
	});
	
	// Mail
	build({
		url: "mailto:?subject=" + title + "&body=" + url,
		html: '<i class="i-svg icon" title="Mail" data-icon="icon_share_mail"></i>',
		className: "share-item mail",
		label: "Email"
	});
	
	Icon.set(document);
}

function createTopOfPage() {
	
	var btn = document.getElementById("top-of-page");
	
	btn.addEventListener("click", function(e) {
		e.preventDefault();
		var y = window.pageYOffset || document.documentElement.scrollTop;
		var diff = (y * 0.15);
		var time = diff < 700 ? 700 : diff;
		var easing = diff < 700 ? "easeInOutQuart" : "easeInOutExpo";
		
		anime({
			targets: "html, body",
			scrollTop: 0,
			duration: time,
			easing: easing,
			complete: function(anim) {
				history.replaceState('', document.title, window.location.pathname);
			}
		});
		
		return false;
	}, false);
	
}

function setMailformElementValue(formName) {
	// メールフォームでのページ遷移用
	
	var fn = formName || "form";
	
	// チェックボックス再入力用の要素があった場合は
	// その要素に対応するチェックボックスにcheckedを入れなおす
	(function() {
		var elems = document.getElementById(fn).elements;
		var cboxd = document.getElementsByClassName("checkboxElementData");
		var l = cboxd.length;
		
		for (var i = 0; i < l; i++) {
			var n = cboxd[i].getAttribute("data-checkbox-name");
			var v = cboxd[i].getAttribute("data-checkbox-value");
			resetCheckbox(elems, n, v);
		}
		
		function resetCheckbox(elems, name, val) {
			for (var i = 0; i < elems.length; i++) {
				if (elems[i].name.match("^" + name)) {
					if (elems[i].value == val) {
						elems[i].checked = true;
					}
				}
			}
		}
	})();
	
	// 入力エラーのメッセージがあった場合は対応するフィールドに設置を行う
	(function() {
		var error = document.getElementsByClassName("error-message");
		var l = error.length;
		
		for (var i = 0; i < l; i++) {
			var attr = error[i].getAttribute("data-error-field");
			var f = document.getElementById("fs_" + attr);
			var t = document.getElementById("fs_error__" + attr);
			var p = t.parentNode;
			var e = document.createElement("span");
			
			f.classList.add("error");
			t.classList.add("error");
			e.classList.add("error-message");
			e.innerHTML = error[i].getAttribute("data-error-message");
			t.appendChild(e);
		}
	})();
}

function wrapInnerText(elm, delay, random, offset, child) {
	
	/*
	 * @ elm : parent element
	 * @ delay : number
	 * @ random : boolian
	 * @ offset : number
	 * @ child : target element
	 */
	
	var is_random = random || false;
	var delay  = delay || 20;
	var offset  = offset || 0;
	var targetGroup = elm || document.getElementsByClassName("js-wrap-g");
	var target = child || elm.getElementsByClassName("js-wrap");
	var strings = [];
	var count = 0;
	
	if (target.length) {
		for (var i = 0; i < target.length; i++) {
			strings[i] = wrap(target[i], i + 1);
		}
	} else {
		strings[0] = wrap(target);
	}
	
	if (is_random) {
		for (var i = 0; i < strings.length; i++) {
			for (var j = 0; j < strings[i].length; j++) {
				strings[i][j].style.transitionDelay = ((delay * 0.2) * j) + Math.round(Math.random() * (delay * 3)) + offset + "ms";
			}
		}
		
	} else {
		for (var i = 0; i < strings.length; i++) {
			for (var j = 0; j < strings[i].length; j++) {
				var line = parseInt(strings[i][j].getAttribute("data-line-index"));
				var index = parseInt(strings[i][j].getAttribute("data-text-index"));
				strings[i][j].style.transitionDelay = offset + (delay * (index)) + "ms";
			}
		}
	}
	
	function wrap(target, num) {
		var children = target.childNodes;
		var span = "";
		var elm = "";
		var spiltWords = "";
		var word = "";
		
		if (!children) {
			return false;
		}
		
		// 1.split words
		for (var i = 0; i < children.length; i++) {
			var cld = children[i];
			if (cld.nodeType === 3) { // TEXT_NODE
				spiltWords = cld.textContent.split(/(\S+)/);
				cld.textContent = "";
			}
		}
		
		// 2.wrap charactor
		for (var i = 0; i < spiltWords.length; i++) {
			var wraped = "";
			for (var j = 0; j < spiltWords[i].length; j++) {
				var str = spiltWords[i][j];
				if (spiltWords[i] !== " ") {
					wraped += '<span class="char" data-line-index="' + num + '">' + str + '</span>';
				} else {
					wraped = " ";
				}
			}
			spiltWords[i] = wraped;
		}
		
		// 3.wrap words
		for (var i = 0; i < spiltWords.length; i++) {
			var cls = spiltWords[i] === " " ? "word-space" : "";
			word += '<span class="word ' + cls + '" data-line-index="' + num + '" data-word-index="' + i + '">' + spiltWords[i] + '</span>';
		}
		
		target.insertAdjacentHTML("beforeend", word);
		span = target.getElementsByClassName("char");
		
		for (var i = 0; i < span.length; i++) {
			count += 1;
			span[i].setAttribute("data-text-index", count);
		}
		
		return span;
	}
	
	setTimeout(function() {
		document.body.classList.add("text-wraped");
	}, 800);
}

function SwipeObject() {
	
	return {
		
		target: undefined,
		event_resize: undefined,
		obj: [],
		
		init: function() {
			var t = this;
			t.target = document.getElementsByClassName("carousel-images");
			
			if (!t.target) {
				return false;
			}
			
			for (var i = 0; i < t.target.length; i++) {
				t.obj[i] = new t.Obj(t.target[i], i);
				t.obj[i].init();
			}
			t.event_resize = function(e) {
				t.resize(t);
			}
			window.addEventListener("resize", t.event_resize);
		},
		
		build: function() {
			var t = this;
			
			if (!t.target) {
				return false;
			}
			
			for (var i = 0; i < t.target.length; i++) {
				t.obj[i].build();
			}
		},
		
		resize: function(t) {
			for (var i = 0; i < t.target.length; i++) {
				var obj = t.obj[i];
				obj.resize(obj);
			}
		},
		
		Obj: function(targetElement, index) {
			
			return {
				index: undefined,
				
				target: undefined,
				target_images: undefined,
				target_ui: undefined,
				target_nav: undefined,
				target_nav_next: undefined,
				target_nav_prev: undefined,
				target_caption: undefined,
				
				li: undefined,
				
				event_next: undefined,
				event_prev: undefined,
				event_change: undefined,
				event_settle: undefined,
				event_scroll: undefined,
				
				flickObj: undefined,
				flickObjData: undefined,
				waypoint: undefined,
				
				init: function() {
					var t = this;
					t.t = t;
					t.index = index;
					t.target = targetElement;
					t.target_ui = targetElement.nextElementSibling || "";
					t.li = t.target.getElementsByClassName("carousel-cell");
					
					if (t.target_ui) {
						t.target_nav = t.target_ui.getElementsByClassName("carousel-nav")[0] || "";
						t.target_caption = t.target_ui.getElementsByClassName("carousel-caption")[0] || "";
					}
				},
				
				build: function() {
					var flickObj;
					var images;
					var flkty;
					var is_addDefaultButtnos = true;
					var t = this;
					
					t.event_next = function(e) {
						t.next(e, t);
					}
					
					t.event_prev = function(e) {
						t.prev(e, t);
					}
					
					t.event_change = function(e, index) {
						t.change(e, t, index);
					}
					
					t.event_settle = function(e, index) {
						t.settle(e, t, index);
					}
					
					t.event_scroll = function(e, index) {
						t.scroll(e, t, index);
					}
					
					if (t.target_nav) {
						t.target_nav_next = t.target_nav.getElementsByClassName("next")[0];
						t.target_nav_prev = t.target_nav.getElementsByClassName("prev")[0];
						t.target_nav_next.addEventListener("click", t.event_next, false);
						t.target_nav_prev.addEventListener("click", t.event_prev, false);
						is_addDefaultButtnos = false;
					}
					
					if (t.li.length > 1) {
						
						t.flickObj = flickObj = $(t.target).flickity({
							contain: true,
							wrapAround: true,
							prevNextButtons: is_addDefaultButtnos,
							pageDots: true,
							draggable: true,
							autoPlay: 5000,
							percentPosition: false,
							arrowShape: 'M95,51.5H12L35,66l-2,3L4,50l29-19l2,3L12,48.5h83'
						});
						
						t.target_images = t.flickObj.find(".carousel-cell img");
						t.flickObjData = t.flickObj.data("flickity");
						//t.flickObj.on("scroll.flickity", t.event_scroll);
						t.flickObj.on("change.flickity", t.event_change);
						t.flickObj.on("settle.flickity", t.event_settle);
						
						// play and resume
						t.waypoint = new Waypoint.Inview({
							element: targetElement,
							enter: function(direction) {
								flickObj.flickity('playPlayer');
							},
							exited: function(direction) {
								flickObj.flickity('stopPlayer');
							}
						});
					} else {
						return false;
					}
					t.resize(t);
					t.settle("", t, 0);
				},
				
				resize: function(t) {
					var img, rect;
					for (var i = 0; i < t.li.length; i++) {
						img = t.li[i].getElementsByTagName("img")[0];
						rect = img.getBoundingClientRect();
						t.li[i].style.height = rect.height + "px";
					}
					t.flickObj.flickity("resize");
				},
				
				change: function(e, t, i) {
					t.target.classList.remove("-settle");
					t.target.classList.add("-change");
					
				},
				
				settle: function(e, t, i) {
					var shibling = t.target_images[i].nextElementSibling || "";
					t.target.classList.add("-settle");
					t.target.classList.remove("-change");
					if (t.target_caption && shibling) {
						t.target_caption.innerText = shibling.innerText;
					}
				},
				
				scroll: function(e, t, i) {
					var flkty = t.flickObjData;
					flkty.slides.forEach(function(slide, i) {
						var img = t.target_images[i];
						var fx = flkty.x;
						var fsw= flkty.slidesWidth;
						var tar = slide.target;
						var x = 0;
						
						if(0 === i) {
							if (Math.abs(fx) > fsw) {
								x = fsw + fx + flkty.slides[flkty.slides.length - 1 ].outerWidth + tar;
							} else {
								x = tar + fx;
							}
							
						} else if( i === flkty.slides.length - 1 ) {
							if (Math.abs(fx) + flkty.slides[i].outerWidth < fsw) {
								x = tar - fsw + fx - flkty.slides[i].outerWidth
							} else {
								x = tar + fx
							}
						} else {
							x = tar + fx;
						}
						
						//img.style.transform = "translateX(" + x * (-1 / 1.5) + "px)";
					});
				},
				
				next: function(e, t) {
					t.flickObj.flickity("next", true);
					t.flickObj.flickity('stopPlayer');
				},
				
				prev: function(e, t) {
					t.flickObj.flickity("previous", true);
					t.flickObj.flickity('stopPlayer');
				},
				
				remove: function() {
					if (!this.flickObj) {
						return false;
					}
					
					if (this.target_nav) {
						this.target_nav_next.removeEventListener("click", this.event_next, false);
						this.target_nav_prev.removeEventListener("click", this.event_prev, false);
					}
					
					this.flickObj.off("change.flickity", this.event_change);
					this.flickObj.off("settle.flickity", this.event_settle);
					this.flickObj.off("scroll.flickity", this.event_scroll);
					this.flickObj = null;
					this.waypoint.destroy();
					this.waypoint = null;
				}
			}
		},
		
		destroy: function(t) {
			for (var i = 0; i < t.target.length; i++) {
				t.obj[i].remove(t.obj[i]);
			}
			window.removeEventListener("resize", t.resize);
		}
	}
}

function decisionVerticalImage(container, className) {
	var imgs, img;
	
	for (var i = 0; i < container.length; i++) {
		if (!className) {
			imgs = container[i].getElementsByTagName("img");
		} else {
			imgs = container[i].getElementsByClassName(className)[0].getElementsByTagName("img");
		}
		for (var j = 0; j < imgs.length; j++) {
			img = imgs[j];
			if (img.naturalWidth < img.naturalHeight) {
				container[i].classList.add("has-vertical-img");
				img.classList.add("vertical-img");
			}
		}
	}
}

var currentPageHighlight = function(id, level) {
	
	var len = 0;
	var dirLv = level || 1;
	var URL = document.URL;
	var dirAry = URL.split("/");
	dirAry.shift();
	dirAry.shift();
	len = dirAry.length;
	
	var dirName = dirAry[dirLv];
	var dirDep = len - 2;
	var t = document.getElementById(id);
	
	if (t) {
		set(t);
	} else {
		t = document.getElementsByClassName(id);
		for (var i = 0; i < t.length; i++) set(t[i]);
	}
	
	function set(t) {
		//var a = t.getElementsByTagName("a");
		var a = t.querySelectorAll("a[href]");
		var aLen = a.length;
		
		for (var i = 0; i < aLen; i++) {
			var b = a[i].getAttribute("href") || "";
			var c = b.split("/");
			var d = c[c.length - 2] || "";
			
			if (d === dirName) {
				a[i].parentNode.classList.add("current");
			} else {
				a[i].parentNode.classList.remove("current");
			}
		}
	}
}

var Indicator = function(id, parent) {
	
	return {
		that: null,
		id: id,
		ap: parent,
		indctr: null,
		
		init: function() {
			var _t = this;
			var d = document
			var c = d.createElement("div");
			var indicator = d.createElement("span");
			c.id = _t.id;
			c.appendChild(indicator);
			c.setAttribute("class", "indicator");
			
			
			c.addEventListener("transitionend", function(e) {
				if (e.propertyName === "opacity" && parseInt(_t.getPropVal(_t.indctr, "opacity")) === 0) {
					_t.indctr.classList.remove("show");
					_t.indctr.classList.add("hide");
				}
			}, false);
			
			if (_t.ap.indexOf("#") > -1) {
				d.getElementById(_t.ap.substring(1)).appendChild(c);
			} else {
				d.getElementsByTagName(_t.ap)[0].appendChild(c);
			}
			_t.indctr = c;
			_t.indctr.classList.add("hide");
		},
		
		show: function() {
			var t = this;
			this.indctr.classList.remove("hide");
			setTimeout(function(){
				t.indctr.classList.add("show");
			}, 10);
		},
		
		hide: function() {
			this.indctr.classList.remove("show");
		},
		
		getPropVal: function(t, p) {
			return document.defaultView.getComputedStyle(t, "").getPropertyValue(p);
		}
	}
}

var CarouselGallery = function(targetId) {
	return {
		parent: {
			element: targetId, // element or string (id)
			width: 0,
			height: 0,
			child: {
				element: "CG-layer", // string (class)
				width: 0,
				height: 0,
			}
		},
		
		layers: [],
		scrollTop: 0,
		currentScrollX: 0,
		currentScrollY: 0,
		defaultPositionX: 0,
		defaultPositionY: 0,
		autoplay: true,
		is_mobile: false,
		requestId: undefined,
		lastTime: performance.now(),
		
		init: function() {
			var that = this;
			var layers;
			var lastframe = 0;
			var childClassname = this.parent.child.element;
			var childElement = document.getElementsByClassName(childClassname)[0];
			that.is_mobile = that.isMobile();
			that.lastTime = performance.now();
			
			if (!that.is_mobile) {
				window.addEventListener("scroll", function(e) {
					that.scroll(e, that);
				}, {passive: true});
			}
			
			window.addEventListener("resize", function(e) {
				that.resize(e, that);
			}, false);
			
			if (typeof(this.parent.element) == "string") {
				this.parent.element = document.getElementById(this.parent.element);
			}
			
			this.parent.child.element = childElement;
			
			layers = this.parent.element.getElementsByClassName(childClassname);
			
			// set layer objects
			for (var i = 0; i < layers.length; i++) {
				this.layers[i] = {
					element: layers[i],
					width: 0,
					height: 0,
					x:0,
					children: buildChildrenObjectArray(layers[i].getElementsByClassName("CG-layer-inner"))
				};
			}
			
			function buildChildrenObjectArray(elements) {
				var array = [];
				for (var i = 0; i < elements.length; i++) {
					array[i] = {
						element: elements[i],
						img: elements[i].getElementsByTagName("img")[0],
						rect: elements[i].getBoundingClientRect(),
						x: 0
					}
				}
				return array;
			}
			// Load Image Element
			(function(that) {
				var imgs = that.parent.element.getElementsByClassName("js-lazy");
				var completeImgs = [];
				var src = "";
				for (var i = 0; i < imgs.length; i++) {
					src = imgs[i].getAttribute("data-src");
					if (src.indexOf("gif") > -1) {
						src += "?" + new Date().getTime(); // no chache
					}
					imgs[i].src = src;
					imgs[i].parentNode.style.animationDelay = (i * 200) + 100 + "ms";
					imgs[i].addEventListener("load", complete, false);
				}
				
				function complete(e) {
					completeImgs.push(e.currentTarget);
					e.currentTarget.removeEventListener("load", complete, false);
					
					if (completeImgs.length === imgs.length) {
						// show function
						that.parent.element.classList.add("-ready");
						that.resize(undefined, that);
						if (that.autoplay) {
							that.play(that);
						}
					}
				}
			})(this);
		},
		
		play: function(target) {
			var that = target;
			var nowTime = performance.now();
			var time = nowTime - that.lastTime;
			that.lastTime = nowTime;
			that.setLayerPosition(that);
			that.requestId = window.requestAnimationFrame(function() {
				that.play(that);
			});
		},
		
		stop: function(target) {
			window.cancelAnimationFrame(target.requestId);
		},
		
		scroll: function(event, target) {
			var that = target;
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			that.scrollTop = scrollTop / 10;
			that.currentScrollY = that.scrollTop * (that.layers.length - 1);
		},
		
		setLayerPosition: function(target) {
			var that = target;
			var y = that.currentScrollY;
			var layers = that.layers;
			var l = layers.length;
			var is_mobile = that.is_mobile;
			that.parent.element.style.translate3d = "translate3d(0, " + y + "px, 0)";
			
			for (var i = 0; i < l; i++) {
				
				// x
				for (var j = 0; j < layers[i].children.length; j++) {
					
					var children = layers[i].children; // current children
					var current = layers[i].children[j]; // current layer
					var prev; // prev layer
					var currentElm = current.element;
					
					if (!j) { // 0
						current.x += -(l / 3);
						
					} else {
						prev = layers[i].children[j - 1];
						current.x = prev.x + prev.img.width;
					}
					
					if (current.x < -current.img.width) {
						current.x = children[children.length - 1].img.width;
						children.push(current);
						children.shift();
					}
					
					if (current.x > that.parent.width) {
						currentElm.style.display = "none";
						currentElm.classList.add("-hide");
						currentElm.classList.remove("-show");
					} else {
						currentElm.style.display = "flex";
						currentElm.classList.remove("-hide");
						currentElm.classList.add("-show");
					}
					
					currentElm.style.transform = "translate3d(" + current.x + "px, 0, 0)";
				}
				
			}
		},
		
		resize: function(event, target) {
			var layerRect;
			var parentRect = target.parent.element.getBoundingClientRect();
			var childRect = target.parent.child.element.getBoundingClientRect();
			target.parent.width = parentRect.width;
			target.parent.height = parentRect.height;
			target.parent.child.height = childRect.height;
			target.parent.child.width = childRect.width;
			
			target.defaultPositionX = window.pageXOffset + parentRect.left;
			target.defaultPositionY = window.pageYOffset + parentRect.top;
			
			for (var i = 0; i < target.layers.length; i++) {
				layerRect = target.layers[i].element.getBoundingClientRect();
				target.layers[i].width = layerRect.width;
				target.layers[i].height = layerRect.width;
			}
		},
		
		isMobile: function() {
			if (UA.device !== "other") {
				return true;
			} else {
				return false;
			}
		}
	}
}

var TransitionAsync = function () {
	
	"use strict";
	
	return {
		
		_t: "",
		contentID: "",
		containerID: "",
		content: "",
		container: "",
		
		stateObj: new Object(),
		onloadCallbackFunc: "",
		DOMCallbackFunc: "",
		onloadAjaxContentCallbackFunc: "",
		popstateCallbackFunc: "",
		cancelCallbackFunc: "",
		httpReq: "",
		
		ismoved: false,
		isloading: false,
		isquit: false,
		
		init: function (container, target, onloadCallback, DOMcontentLoadedCallback, onloadAjaxContentCallback, popstateCallback, cancelCallback) {
			
			var _t = this;
			
			_t.contentID = target;
			_t.containerID = container;
			_t.onloadCallbackFunc = onloadCallback;
			_t.DOMCallbackFunc = DOMcontentLoadedCallback;
			_t.onloadAjaxContentCallbackFunc = onloadAjaxContentCallback;
			_t.popstateCallbackFunc = popstateCallback;
			_t.cancelCallbackFunc = cancelCallback;
			_t.content = document.getElementById(_t.contentID);
			_t.container = document.getElementById(_t.containerID);
			
			function popStateHandler(e) {
				if (!e || !e.state) return;
				
				var path = e.state ? e.state.path : "";
				
				if (_t.popstateCallbackFunc) {
					_t.popstateCallbackFunc(path, e);
				} else {
					_t.update(window.location, 0);
				}
			}
			window.addEventListener("popstate", popStateHandler, false);
			
		},
		
		move: function (title, url, pushstate, count) {
			var _t = this;
			_t.ismoved = true;
			this.update(url, 0, {t: title, u: url, p: pushstate, c: count});
		},
		
		push: function (arg) {
			
			var _t = this;
			var title = arg.t;
			var url = arg.u;
			var pushstate = arg.p;
			var count = arg.c;
			
			if (pushstate && !_t.isquit) {
				// Google Analytics
				
				// old
				/*if (_gaq) {
					_gaq.push(["_trackPageview", url]); 
				}*/
				
				// analytics.js
				if (typeof ga === "function") {
					ga("send", "pageview", url);
				}
				
				// gtag.js
				if (typeof gtag === "function") {
					gtag("config", GA_TRACKING_ID, {"page_path": url});
				}
				
				_t.stateObj = {path: url, count:count};
				history.pushState(_t.stateObj, title, url);
			}
		},
		
		update: function (url, retry, pushstateArguments) {
			
			var _t = this;
			var charset = "";
			
			_t.isquit = false;
			_t.isloading = true;
			
			// ページ固有のscriptを初期化
			if (typeof GAS_pjaxDestroyJS === "function") {
				GAS_pjaxDestroyJS();
			}
			
			if (window.XMLHttpRequest) {
				_t.httpReq = new XMLHttpRequest();
				if (UA.browser === "msie") {
					charset = ";charset=utf-8";
				}
				if (_t.httpReq.overrideMimeType) {
					_t.httpReq.overrideMimeType("text/html" + charset);
				}
			}
			
			_t.httpReq.open("GET", url, true);
			_t.httpReq.responseType = "document";
			_t.httpReq.send(null);
			_t.httpReq.onreadystatechange = function () {
				var status = _t.httpReq.status;
				var state = _t.httpReq.readyState;
				
				if (_t.isquit) {
					if (_t.cancelCallbackFunc) {
						_t.cancelCallbackFunc();
					}
					return false;
				}
				
				if (state === 4) {
					// OK
					if (status === 200) {
						_t.push(pushstateArguments);
						if (document.getElementById(_t.contentID) && document.getElementById(_t.containerID)) {
							var c = document.getElementById(_t.contentID);
							if (c) {
								document.getElementById(_t.containerID).removeChild(c);
							} else {
								// console.log("error 'c' is undefined");
								return ;
							}
						}
						onloadAjaxContent(_t.httpReq.response);
						
					// ERROR
					} else {
						if (status === 403 || status === 404 || status === 500) {
							onError(status)
							return false;
						}
						
						_t.httpReq.abort();
						
						if (retry < 5) { // retry;
							retry += 1
							setTimeout(function() {
								_t.update(url, retry, pushstateArguments);
							}, 100);
						} else {
							location.reload();
						}
					}
				}
			}
			
			function onError(status) {
				var msg;
				
				_t.cancel();
				
				if (_t.cancelCallbackFunc) {
					if (status === 403) {
						msg = "403 Forbidden.";
						
					} else if (status === 404) {
						msg = "404 Not found.";
						
					} else if (status === 500) {
						msg = "500 Internal Server error.";
						
					} else {
						msg = "[Error] HTTP Status code: " + status;
					}
					_t.cancelCallbackFunc(msg);
				}
				console.error(msg);
				return false;
			}
			
			function onloadAjaxContent(data) {
				
				var container = document.getElementById(_t.containerID);
				var clone;
				var doc = data;
				var head = doc.getElementsByTagName("head")[0];
				var title = doc.getElementsByTagName("title")[0].innerText;
				var body = doc.getElementsByTagName("body")[0];
				var newCSSElements = new Array();
				var newCSSLoadedElements = new Array();
				var newScriptElements = new Array();
				var newScriptLoadedElements = new Array();
				var query = "";
				
				if (_t.onloadAjaxContentCallbackFunc) {
					_t.onloadAjaxContentCallbackFunc(_t.httpReq.response);
				}
				
				if (_t.isquit) {
					if (_t.cancelCallbackFunc) {
						_t.cancelCallbackFunc();
					}
					return false;
				}
				
				function deleteElement(tagName) {
					if (_t.isquit) {
						if (_t.cancelCallbackFunc) {
							_t.cancelCallbackFunc();
						}
						return false;
					}
					
					var elements = document.getElementsByTagName(tagName);
					var l = elements.length;
					for (var i = l; i > 0; i--) {
						var e = elements[i-1];
						var parent = e.parentNode;
						var data = e.getAttribute("data-type");
						
						if(data === "unique") {
							parent.removeChild(e);
						}
					}
				}
				
				deleteElement("link");
				deleteElement("script");
				
				(function() {
					if (_t.isquit) {
						_t.cancel();
						if (_t.cancelCallbackFunc) {
							_t.cancelCallbackFunc();
						}
						return false;
					}
					
					var elm = head.querySelectorAll("link[data-type='unique']");
					var l = elm.length;
					
					for(var i = 0; i < l; i++) {
						var c = elm[i].getAttribute("href");
						var q = "";
						
						if (navigator.userAgent.toLowerCase().indexOf("msie") > 0 === "msie") {
							q = "?date=" + new Date().getTime();
						}
						
						try {
							document.getElementsByTagName("head")[0].appendChild(elm[i]);
							newCSSElements[newCSSElements.length] = elm[i];
							var dummy = document.createElement("img");
							dummy.onerror = function (e) {
								CSSElementOnloadComplete(e);
							}
							dummy.src = c + q;
							
						} catch (e) {
							alert(e);
						}
						
					}
					
					// Next
					if (newCSSElements.length === 0) {
						addScriptElements();
					}
					
					function CSSElementOnloadComplete(e) {
						newCSSLoadedElements.push(e);
						if (newCSSElements.length === newCSSLoadedElements.length) {
							addScriptElements();
						}
					}
				})();
				
				
				function addScriptElements() {
					
					if (_t.isquit) {
						if (_t.cancelCallbackFunc) {
							_t.cancelCallbackFunc();
						}
						return false;
					}
					
					var elm = head.querySelectorAll("script[data-type='unique']");
					var l = elm.length;
					var q = "";
					
					if (navigator.userAgent.toLowerCase().indexOf("msie") > 0 === "msie") {
						q = "?date=" + new Date().getTime();
					}
					
					for(var i = 0; i < l; i++) {
						
						var script = elm[i];
						var c = script.getAttribute("src");
						
						var s = document.createElement("script");
						s.setAttribute("src", c + q);
						s.addEventListener("load", onloadScriptElement, false);
						s.addEventListener("error", onErrorScriptElement, false);
						document.getElementsByTagName("head")[0].appendChild(s);
						newScriptElements[newScriptElements.length] = s;
					}
					
					// Next
					if (newScriptElements.length === 0) {
						end();
					}
					
					function onloadScriptElement(e) {
						ScriptElementOnloadComplete(e);
					}
					
					function onErrorScriptElement(e) {
						ScriptElementOnloadComplete(e);
					}
					
					function ScriptElementOnloadComplete(e) {
						e.target.removeEventListener("load", onloadScriptElement, false);
						e.target.removeEventListener("error", onloadScriptElement, false);
						newScriptLoadedElements.push(e);
						if (newScriptElements.length === newScriptLoadedElements.length) {
							end();
						}
					}
				}
				
				function end() {
					
					if (_t.isquit) {
						if (_t.cancelCallbackFunc) {
							_t.cancelCallbackFunc();
						}
						return false;
					}
					
					var meta = document.getElementsByTagName("meta");
					
					for (var i = 0; i < meta.length; i++) {
						if (meta[i].getAttribute("property")) {
							var prop = meta[i].getAttribute("property");
							
							if(prop.indexOf("og:title") > -1){
								meta[i].setAttribute("content", title);
							}
							if(prop.indexOf("og:url") > -1){
								meta[i].setAttribute("content", location.href);
							}
						}
					}
					
					_t.container.appendChild(body);
					clone = document.getElementById(_t.contentID).cloneNode(true);
					document.getElementById(_t.containerID).innerHTML = "";
					document.getElementsByTagName("title")[0].innerHTML = title;
					_t.container.appendChild(clone);
					
					if (_t.DOMCallbackFunc) {
						_t.DOMCallbackFunc(data);
					}
					
					if (typeof GAS_pjaxDOMContentLoaded === "function") {
						GAS_pjaxDOMContentLoaded();
					}
					
					PreloadImages(_t.contentID, finish);
				}
				
				function PreloadImages(targetNode, callback) {
					
					if (_t.isquit) {
						if (_t.cancelCallbackFunc) {
							_t.cancelCallbackFunc();
						}
						return false;
					}
					
					var id;
					var imgSrcs      = new Array();
					var loadedImages = new Array();
					var loadedCount  = 0;
					var area         = typeof targetNode === "string" ? document.getElementById(targetNode) : targetNode;
					var images       = area.getElementsByTagName("img");
					var l            = images.length;
					
					if (l === 0) {
						callback();
					}
					
					for (var i = 0; i < l; i++) {
						var date = new Date();
						var img = new Image();
						var query = "";
						imgSrcs[i] = images[i].getAttribute("src");
						if (navigator.userAgent.toLowerCase().indexOf("msie") > 0 === "msie") {
							query = "?date=" + date.getTime();
						}
						img.onload = img.onerror = function () {onloadItem(this.number);}
						img.src = imgSrcs[i] + query;
						img.number = i;
					}
					
					function onloadItem(num) {
						if (_t.isquit) {
							if (_t.cancelCallbackFunc) {
								_t.cancelCallbackFunc();
							}
							return false;
						}
						
						loadedCount++;
						loadedImages[num] = num;
						
						if (loadedCount === l && callback) callback();
					}
					
					function getChildNodes(element) {
						var childNodes;
						for (var i = 0; i < 10; i++) {
							if (element.childNodes[i].tagName != undefined) {
								childNodes = element.childNodes[i];
								break;
							}
						}
						return childNodes;
					}
				}
				
				function finish() {
					// 10. onload
					_t.isloading = false;
					
					if (typeof GAS_pjaxOnLoadComplete === "function") {
						GAS_pjaxOnLoadComplete();
					}
					
					if (_t.onloadCallbackFunc) {
						_t.onloadCallbackFunc();
					}
				}
			}
		},
		
		cancel: function () {
			this.isquit = true;
			this.httpReq.abort();
		},
		
		isLoading: function () {
			return this.isloading;
		},
		
		isTransition: function () {
			return this.ismoved;
		}
	}
}

String.prototype.replaceAll = function (org, dest) {
	return this.split(org).join(dest);
}

var ScrollDirection = {
	
	target: undefined,
	currentX: window.pageXOffset || document.documentElement.scrollLeft,
	currentY: window.pageYOffset || document.documentElement.scrollTop,
	is_hashchange: false,
	kvh: 0,
	
	init: function(target) {
		var t = this;
		t.target = target || document.getElementsByTagName("body")[0];
		
		t.event_hashchange = function (e) {
			t.onHashchange(e, t);
		}
		
		t.event_scroll = function (e) {
			t.onScroll(e);
		}
		
		t.event_resize = function (e) {
			t.onResize(e, t);
		}
		
		window.addEventListener("hashchange", t.event_hashchange, false);
		window.addEventListener("scroll", t.event_scroll, false);
		window.addEventListener("resize", t.event_resize, false);
		t.onResize("");
		t.onScroll("");
	},
	
	onScroll: function(e) {
		var t = this;
		var w = window;
		var d = document.documentElement;
		var y = w.pageYOffset || d.scrollTop;
		var currentY = t.currentY;
		var target = t.target;
		
		if (y > currentY) {
			// move down
			if (!target.classList.contains("scroll-down")) {
				target.classList.remove("scroll-up");
				target.classList.add("scroll-down");
			}
			
			if (document.documentElement.scrollHeight - window.innerHeight === y) {
				target.classList.add("scroll-y-end");
			}
			
		} else if(y === currentY) {
			// nothing here
			
		} else {
			// move up
			if (!target.classList.contains("scroll-up")) {
				target.classList.remove("scroll-down");
				target.classList.remove("scroll-y-end");
				target.classList.add("scroll-up");
			}
		}
		
		if (160 > currentY) {
			target.classList.remove("scroll-down");
			target.classList.remove("scroll-y-end");
			target.classList.add("scroll-up");
			target.classList.add("scroll-y-start");
			
		} else {
			target.classList.remove("scroll-y-start");
		}
		
		if (t.is_hashchange) {
			target.classList.add("scroll-y-hashchange");
		} else {
			target.classList.remove("scroll-y-hashchange");
		}
		
		//currentX = x;
		t.currentY = y;
		t.is_hashchange = false;
	},
	
	onHashchange : function(e, t) {
		t.is_hashchange = true;
	},
	
	onResize : function(e, t) {
		
	}
}

var InViewElement = {
	t: "",
	
	init: function() {
		var that = this;
		this.t = that;
		
		// In View Element
		that.manage.init();
	},
	
	set: function(t) {
		t.manage.removeEvent(t.manage.t);
	},
	
	destroy: function(t) {
		t.manage.removeEvent(t.manage.t);
	},
	
	manage: {
		
		t: "",
		ww: 0,
		wh: 0,
		InViewDOMElements: undefined,
		items: undefined,
		event_scroll: undefined,
		event_resize: undefined,
		
		init: function(random) {
			
			/*
			 * @ random : boolian
			 */
			
			var that = this;
			var length = 0;
			var sum;
			that.t = this;
			that.InViewDOMElements = document.getElementsByClassName("inview");
			length = that.InViewDOMElements.length;
			that.items = new Array(length);
			
			for (var i = 0; i < length; i++) {
				that.items[i] = {
					t: that.InViewDOMElements[i],
					dy: 0, // default Y
					cy: 0, // current Y
					delayY: parseFloat(that.InViewDOMElements[i].getAttribute("data-delay-y")) || 0,
					childlen: that.InViewDOMElements[i].getElementsByClassName("inview__item"),
					ww: window.innerWidth,
					wh: window.innerHeight,
					video: undefined,
					videoEvent: undefined
				};
				
				for (var j = 0; j < that.items[i].childlen.length; j++) {
					
					if (random) {
						sum = 0.2 + (Math.random() * 1);
					} else {
						sum = 0.2;
					}
					that.items[i].childlen[j].style.transitionDelay = sum + (0.1 * j) + "s";
				}
			}
			
			that.event_scroll = function(e) {
				that.scroll(e, that);
			}
			
			that.event_resize = function(e) {
				that.reset(that);
			}
			
			that.reset(that);
			window.addEventListener("scroll", that.event_scroll, {passive: true});
			window.addEventListener("resize", that.event_resize, false);
			
		},
		
		scroll: function(event, that) {
			var d = document;
			var sy = d.documentElement.scrollTop || d.body.scrollTop;
			var l = that.items.length;
			var item = "";
			
			for (var i = 0; i < l; i++) {
				
				item = that.items[i];
				
				if (!item.t.classList.contains("-show")) {
					if (sy + item.wh - item.delayY > item.dy) {
						item.t.classList.add("-show");
					}
				}
			}
		},
		
		reset: function(that) {
			var rect;
			var l = that.items.length;
			
			for (var i = 0; i < l; i++) {
				rect = that.items[i].t.getBoundingClientRect();
				that.items[i].dy = rect.top + window.pageYOffset;
			}
			
			that.scroll("", that, that.items);
		},
		
		removeEvent: function(that) {
			window.removeEventListener("scroll", that.event_scroll, {passive: true});
			window.removeEventListener("resize", that.event_resize, false);
		}
	}
}

var PopupMenu = {
	
	te: "popup",
	tt: "popup__trigger",
	tg: "popup__target",
	na: null,
	b: null,
	time: 100,
	isSwipe: false,
	current: null,
	
	init: function() {
		var that = this;
		var d = document;
		that.b = d.getElementsByTagName("body")[0];
		
		that.b.addEventListener("click",  function(e) {that.onClick(e, that);}, false);
		that.b.addEventListener("mouseenter", function(e) {that.onClick(e, that);}, false);
		that.b.addEventListener("mouseleave", function(e) {that.onClick(e, that);}, false);
	},
	
	onClick: function(e, t) {
		var a = t.f.getParentAnchorElement(e, t);
		var b = t.f.getParentHasClass(e.target, e, t.tg);
		var p = t.f.getParentHasClass(a, e, t.te);
		var f = p ? p.classList.contains("animation-end") : false;
		var isActive =  p ? p.classList.contains("active") : false;
		var isHover =  p ? p.classList.contains("popup--hover") : false;
		var notElm = !f ? p : "";
		
		// クリックでもhover対象の場合
		if (e.type === "click" && isHover) {
			if (a.getAttribute("href")) {
				return true;
			}
			e.preventDefault();
			return false;
		}
		
		if (e.type === "mouseenter") {
			if (!isHover) return;
			if (t.current === p) {
				return;
			} else {
				t.show(e, t, p, f);
			}
			t.current = p;
			return false;
			
		} else if (e.type === "mouseleave") {
			if (t.current === p) return;
			if (!p && t.current == e.target) {
				t.hide(e, t, e.target, f);
				t.current = null;
				return;
			}
			if (!isHover) return;
		}
		
		if (!f) {
			if (!b) {
				t.clearAll(a, e, t, notElm);
			}
			if (!p) return false;
		}
		
		if (e.type === "touchend") {
			f = false;
		}
		
		if (e.target.getAttribute("href")) {
			return false;
		}
		
		if (e.type === "click") {
			e.preventDefault();
		}
		
		t.toggle(e, t, p, f);
		
		return false;
	},
	
	toggle: function(e, t, p, f) {
		var c = p.getElementsByClassName(t.tg)[0];
		if (f) {
			p.classList.remove("animation-end", "active");
			c.style.display = "none";
		} else {
			p.classList.add("active");
			t.f.setPosition(c, p);
			c.style.display = "block";
			p.classList.add("animation-end");
		}
	},
	
	show: function(e, t, p, f) {
		var c = p.getElementsByClassName(t.tg)[0];
		p.classList.add("active");
		t.f.setPosition(c, p);
		$(c).stop().fadeIn(t.time, function() { p.classList.add("animation-end") });
	},
	
	hide: function(e, t, p, f) {
		var c = p.getElementsByClassName(t.tg)[0];
		p.classList.remove("animation-end", "active");
		$(c).stop().fadeOut(t.time);
	},
	
	clearAll: function(a, e, t, notElm) {
		var elm = document.getElementsByClassName(t.te);
		$(elm).removeClass("animation-end active");
		$(elm).find("." + t.tg).stop().fadeOut(t.time);
	},
	
	f: {
		setPosition: function(c /* target */, p /* parent */) {
			var tr, tl, tw, tw, ax, arrow, aw, center;
			var ww = window.innerWidth;
			var scrollbarWidth = ww - document.body.clientWidth;
			var displayIni = this.getPropVal(c, "display");
			var pr = p.getBoundingClientRect();
			var pw = pr.width; // parentWidth
			var pl = pr.left;
			var padding = 20;
			
			if (!p.getElementsByClassName("popup-target__arrow")[0]) {
				arrow = document.createElement("div");
				arrow.classList.add("popup-target__arrow");
				c.appendChild(arrow);
				
			} else {
				arrow = p.getElementsByClassName("popup-target__arrow")[0];
			}
			
			c.style.display = "block";
			c.style.left = "auto";
			c.style.right = "auto";
			tr = c.getBoundingClientRect();
			tl = tr.left;
			tw = tr.width;
			
			center = (pw / 2) - (tw / 2);
			c.style.left = center + "px";
			
			aw = parseInt(document.defaultView.getComputedStyle(arrow).getPropertyValue("width")) / 2; // arrow width
			
			// right
			if (ww < tl + tw) {
				tw = pl + (pw / 2) + (tw / 2); // total Width
				ax = ww - tw - scrollbarWidth; // ajust X
				c.style.left = "auto";
				c.style.right = (center - ax + padding) + "px";
				c.classList.add("arrow--r");
				
				if (arrow) {
					arrow.style.left = pl + (pw / 2) - c.getBoundingClientRect().left - aw + "px";
				}
				
			// left
			} else if(tl < tw / 2) {
				tw = pl + (pw / 2) + (tw / 2);
				ax = tw - tw;
				
				c.style.left = (center - ax + padding) + "px";
				c.style.right = "auto";
				c.classList.add("arrow--l");
				
				if (arrow) {
					arrow.style.left = pl + (pw / 2) - padding - aw + "px";
				}
			} else {
				if (arrow) {
					arrow.style.left = (tw / 2) - aw + "px";
				}
			}
			
			c.style.display = displayIni;
		},
		
		getParentHasClass: function(t, e, className) {
			var l = this.getElementDepth(e.currentTarget, e.target);
			var pn = t;
			
			if (UA.browser === "msie") {
				
			}
			
			if (t.tagName === "svg") {
				if (UA.browser === "msie") {
					pn = t.parentNode;
				} else {
					pn = t.parentElement;
				}
				
			}
			
			for (var i = 0; i < l; i++) {
				if (!pn || !pn.classList) {
					return;
				}
				if (pn.classList.contains(className)) {
					return pn;
				} else {
					pn = pn.parentNode;
				}
			}
			return false;
		},
		
		getParentAnchorElement: function(e, t) {
			var l = this.getElementDepth(e.currentTarget, e.target);
			var pn = e.target;
			
			if (UA.browser !== "msie") {
				if (e.target.classList.contains(t.tt)) {
					return pn;
				}
			}
			
			for (var i = 0; i < l; i++) {
				if (!pn) {
					return;
				}
				
				if (pn.tagName === ("A" || "a")) {
					return pn;
				} else {
					pn = pn.parentNode;
				}
			}
			return false;
		},
		
		getElementDepth: function(parent, child) {
			var depth = 0;
			var p = parent;
			var c = child;
			
			while (c != p) {
				depth++;
				if (c.parentNode) {
					c = c.parentNode;
				}
			}
			return depth;
		},
		
		// スタイルを取得
		getPropVal: function(t, p) {
			return document.defaultView.getComputedStyle(t, "").getPropertyValue(p);
		}
	}
}

var PJAX = {
	
	name: "pjax",
	require: "/assets/require.html",
	script: undefined,
	maincontents: new TransitionAsync(),
	contentIndicator: null,
	
	init: function() {
		var that = this;
		var d = document;
		var b = d.getElementsByTagName("body")[0];
		
		var pjRoot = "pushstate-root";
		var pjContainer = "pushstate-container";
		var pjContents = "pushstate-target";
		var nextPageURL = "";
		var pjaxPush = false;
		var isPopstate = false;
		var isCtrlKey = false;
		var indicatorId = "indMC";
		
		// 最初のアクセスの場合stateオブジェクトが無いので最初のアドレスを登録
		if (!history.state && history.replaceState) {
			history.replaceState({
				path: location.pathname + location.search + location.hash,
				count: 0
			}, "", location.pathname + location.search + location.hash);
		}
		
		////////////////////////////////////////////////////////////////////////////////////////////////
		// TransitionAsync callback
		////////////////////////////////////////////////////////////////////////////////////////////////
		
		var historycount = history.state ? history.state.count : 0;
		var mcContentHTML;
		
		if (historycount == undefined) {
			historycount = 0;
			history.state.count = 0;
		}
		
		var onloadStart = function() {
			var b = d.getElementsByTagName("body")[0];
			var t = d.getElementById(pjRoot);
			var p = isPopstate ? " popstate" : "";
			var g = d.getElementById("gh");
			
			if (nextPageURL == undefined) {
				nextPageURL = location.pathname + location.search + location.hash;
			}
			
			if (!p) {
				b.classList.remove("popstate-forward");
				historycount++; // popstate
			}
			
			t.setAttribute("class", "onloadstart" + p);
			that.maincontents.move("", nextPageURL, pjaxPush, historycount);
		}
		
		var onloadAjaxContent = function(data) {
			var b = d.getElementsByTagName("body")[0];
			
			if (!b.classList.contains("onPopstate")) {
				window.scrollTo(0, 0);
			}
			addClass_to_parentcontainer(pjRoot, "onloadajaxcontent");
			currentPageHighlight("gh-menu", DIRECTORY_LEVEL);
		}
		
		var onReady = function(data) {
			addClass_to_parentcontainer(pjRoot, "onready");
			d.getElementById(indicatorId).classList.remove("show");
			d.getElementById(indicatorId).classList.add("hide");
			MAIN.Progress.init({
				background: false // 背景画像も監視対象に含める場合はtrue デフォルトはfalse
			});
			
			
			//FONTPLUS.start();
			FONTPLUS.reload(false);
			Icon.set(d.getElementById(pjRoot));
			pjaxPush = false;
			ResetPages();
		}
		
		var onloadComplete = function() {
			addClass_to_parentcontainer(pjRoot, "onloadcomplete");
			InViewElement.manage.reset(InViewElement.manage);
			that.contentIndicator.hide();
		}
		
		var onPopstate = function(url, event) {
			
			var t = d.getElementById(pjRoot);
			var b = d.getElementsByTagName("body")[0];
			var gh = d.getElementById("gh");
			var pc = d.getElementById(pjRoot);
			
			setTimeout(function() {
			
				if (check_back_or_forward(event) === "forward") {
					b.classList.add("popstate-forward");
					
				} else {
					b.classList.remove("popstate-forward");
				}
				currentPageHighlight("gh-menu", DIRECTORY_LEVEL);
				t.setAttribute("class", "");
				
				isPopstate = true;
				pjaxPush = false;
				nextPageURL = url;
				
				pc.style.height = pc.offsetHeight + "px";
				
				if (that.maincontents.isLoading()) {
					that.maincontents.cancel();
				}
				
				onloadStart();
				
			}, 20);
		}
		
		var onCancel = function(message) {
			//that.alertBox.show("&#9785; Error : " + message);
			that.contentIndicator.hide();
		}
		
		
		
		////////////////////////////////////////////////////////////////////////////////////////////////
		// TransitionAsync trigger
		////////////////////////////////////////////////////////////////////////////////////////////////
		
		function onClickHandler(e, a) {
			
			var href = a.getAttribute("href");
			var target = a.getAttribute("target");
			var b = d.getElementsByTagName("body")[0];
			var as = d.getElementById("gh-menu");
			var gf = d.getElementById("gf");
			var gfRect = gf.getBoundingClientRect() ;
			
			if (target === "_blank") {
				return false;
			}
			
			if (that.maincontents.isLoading()) {
				that.maincontents.cancel();
				return false;
			}
			
			if (!href) {
				return false;
			}
			
			if (a.classList.contains("js-scroll")) {
				as.classList.remove("-show");
				return false;
			}
			
			if (href.indexOf("#") > -1 || href.indexOf("tel:") > -1 || href.indexOf("mailto:") > -1) {
				return false;
			}
			
			if (href.indexOf("http:") > -1 || href.indexOf("https:") > -1) {
				
				// ref innternal file
				if (href.toLowerCase().indexOf(".jpg") > -1 || 
				    href.toLowerCase().indexOf(".jpeg") > -1 || 
				    href.toLowerCase().indexOf(".gif") > -1 || 
				    href.toLowerCase().indexOf(".png") > -1 || 
				    href.indexOf(".pdf") > -1 || 
				    href.indexOf(".cvs") > -1 || 
				    href.indexOf(".xls") > -1 || 
				    href.indexOf(".xlsx") > -1 ||  
				    href.indexOf(".xlsm") > -1 || 
				    href.indexOf(".doc") > -1 || 
				    href.indexOf(".xml") > -1 || 
				    href.indexOf(".txt") > -1 ) {
					return false;
				}
				
				// external website link
				if (href.indexOf(document.domain) === -1) {
					return false;
				}
			}
			
			if (a.classList.contains("no-pjax")) {
				return false;
			}
			
			/*if (a.getAttribute("download")) {
				return false;
			}*/
			
			if (isCtrlKey) {
				return false;
			}
			
			if (e.preventDefault) {
				e.preventDefault();
			}
			
			isPopstate = false;
			
			
			d.getElementById(pjRoot).classList.remove("onloadstart", "onloadajaxcontent", "onready", "onloadcomplete");
			d.getElementById(pjRoot).style.height = (gfRect.top + window.pageYOffset) + "px";
			as.classList.remove("-show");
			nextPageURL = convertAbsoluteURL(a.getAttribute("href"));
			addClass_to_parentcontainer(pjRoot, "eraseStart");
			that.contentIndicator.show();
		}
		
		var TransitionEndObject = function() {
			return {
				callBack: null,
				targetElement: null,
				addEvent: function(tg, cb) {
					var that = this;
					that.callBack = cb;
					that.targetElement = tg;
					that.targetElement.addEventListener("transitionend", function(e) {
						return that.callBack(e);
					}, false);
				},
				eventlistener: null,
				destroy: function() {
					//console.log("called destroy");
				}
			}
		}
		
		var transitionEndObject = new TransitionEndObject();
		transitionEndObject.addEvent(document.getElementById(pjContainer), TransitionEndFinish);
		
		function TransitionEndFinish(e) {
			var m = getPropVal(e.currentTarget, "opacity");
			
			if (that.maincontents.isLoading()) {
				return false;
			}
			
			if (e.propertyName === "opacity") {
				if (m < 0.01 && !pjaxPush) {
					pjaxPush = true;
					onloadStart();
				}
			}
		}
		
		
		
		////////////////////////////////////////////////////////////////////////////////////////////////
		// TransitionAsync Init
		////////////////////////////////////////////////////////////////////////////////////////////////
		
		if (history.pushState) {
			
			this.contentIndicator = new Indicator(indicatorId, "#" + pjRoot);
			this.contentIndicator.init();
			that.contentIndicator.show();
			
			// MAIN CONTENTS / INIT
			this.maincontents.init(
				pjContainer,
				pjContents,
				onloadComplete,
				onReady,
				onloadAjaxContent,
				onPopstate,
				onCancel
			);
			
			// Body要素にクリックイベントを設定しクリック時の発生元を調べる
			b.addEventListener("click", function(e) {
				var a = getAnchorElement(e);
				if (typeof GAS_pjaxOnClickHandler === "function") {
					GAS_pjaxOnClickHandler(e, a);
				}
				if (a) {
					onClickHandler(e, a);
				}
			}, false);
		}
		
		window.addEventListener("resize", onResize, false);
		
		window.addEventListener("load", function(){
			that.contentIndicator.hide();
			addClass_to_parentcontainer(pjRoot, "onloadcomplete");
		}, false);
		
		document.addEventListener("keydown", function(e) {
			var keyEvent = e || window.event;
			isCtrlKey = keyEvent.ctrlKey;
		}, false);
		
		////////////////////////////////////////////////////////////////////////////////////////////////
		// TransitionAsync Page Reset
		////////////////////////////////////////////////////////////////////////////////////////////////
		
		function ResetPages() {
			// Accordion
			// URLにスクロール先が含まれていた場合
			var hash = location.hash;
			
			$(".accordion").each(function(){
				var index = false;
				
				if (hash) {
					var elm = $(this).find(hash);
					if(elm.length){
						index = $(".accordion > *").index(elm);
						$(window).load(function() {
							setTimeout(function() {
								var st = $(elm).offset().top - parseInt($("#gh").height()) - 10;
								window.scrollTo(0, st);
							}, 500)
						})
					}
				}
				
				UIkit.accordion(this, {
					multiple: true,
					duration: "300",
					transition: UA.browser !== "msie" ? "cubic-bezier(0.65,0.05,0.36,1)" : "ease-out",
					active: index
				});
			});
			
			// Parallax
			ParallaxKeyvisual.init();
			
			// Inview
			InViewElement.init();
			
			// Wrap text
			var pr = document.getElementById("pushstate-root");
			var wg = pr.getElementsByClassName("js-wrap-g");
			for (var i = 0; i < wg.length; i++) {
				var wc = wg[i].getElementsByClassName("js-wrap");
				wrapInnerText(wg[i], 100, true, 200, wc);
			}
			
			// Wrap text(kv)
			if (document.getElementById("kv") && document.getElementsByClassName("kv__ttl")) {
				wrapInnerText(document.getElementById("kv"), 60, false, 200, document.getElementsByClassName("kv__ttl")[0]);
			}
			
			// Scroll state
			if (UA.browser !== "msie") {
				ScrollDirection.onScroll();
			}
			
			// Replace svg icon (IE)
			if (UA.browser === "msie") {
				$(".accordion, .uk-modal").on("shown", function() {
					$(this).find("use").each(function(i, elm) {
						$(elm).attr("xlink:href", $(elm).attr("xlink:href"));
					});
				});
			}
		}
		
		ResetPages();
		
		////////////////////////////////////////////////////////////////////////////////////////////////
		// CHECK IN METHODS
		////////////////////////////////////////////////////////////////////////////////////////////////
		
		// popstateで進んだか戻ったかを判別
		function check_back_or_forward(event) {
			
			var ca = event.state ? event.state.count : 0;
			var cb = event.state ? event.state.count : 0;
			var result;
			
			that.maincontents.stateObj.count = ca;
			
			if (ca > historycount) {
				result = "forward";
			} else {
				result = "back";
			}
			
			historycount = ca;
			return result;
		}
		
		function addClass_to_parentcontainer(target, className) {
			var t = d.getElementById(target);
			t.classList.add(className);
		}
		
		function convertAbsoluteURL(src) {
			var a = d.createElement("div");
			a.innerHTML = "<a href='" + src + "'>";
			return a.firstChild.href;
		}
		
		// スタイルを調べる
		function getPropVal(t, p) {
			return d.defaultView.getComputedStyle(t, "").getPropertyValue(p);
		}
		
		// 子から見た親要素を調べる。
		function getAnchorElement(e) {
			var l = getElementDepth(e.currentTarget, e.target);
			var pn = e.target;
			
			// クリック元がSVGの場合
			if (e.target.tagName == "svg") {
				pn = e.target.parentElement;
				l += 1;
			}
			
			for (var i = 0; i < l; i++) {
				
				if (!pn) {
					return;
				}
				if (pn.tagName === ("A" || "a")) {
					return pn;
				} else {
					pn = pn.parentNode;
				}
			}
			return false;
		}
		
		// 子から見た特定のクラスを持った親要素を調べる。
		function getHasClassParentNode(t, e, className) {
			var l = getElementDepth(e.currentTarget, e.target);
			var pn = t;
			
			// クリック元がSVGの場合
			if (t.tagName == "svg" || t.tagName == "use") {
				pn = t.parentElement;
			}
			
			for (var i = 0; i < l; i++) {
				if (!pn || !pn.classList) {
					return;
				}
				
				if (pn.classList.contains(className)) {
					return pn;
					
				} else {
					pn = pn.parentNode;
				}
			}
			return false;
		}
		
		// 子から見た親要素の総数を返す
		function getElementDepth(parent, child) {
			var depth = 0;
			var p = parent;
			var c = child;
			
			while (c != p) {
				depth++;
				c = c.parentNode;
			}
			
			return depth;
		}
		
		// Smooth Scroll
		function smoothScroll(e, a) {
			e.preventDefault();
			
			var target = document.querySelector(a.hash);
			var sy = window.pageYOffset || document.documentElement.scrollTop;
			var ty = target.getBoundingClientRect().top + sy;
			var abs = Math.abs(sy - ty);
			var time = (abs * 0.2) < 700 ? 700 : abs * 0.2;
			var easing = (abs * 0.2) < 700 ? "easeInOutQuad" : "easeInOutExpo";
			
			anime({
				targets: "html, body",
				scrollTop: ty,
				duration: time,
				easing: easing,
				complete: function(anim) {
					location.hash = a.hash;
				}
			});
			
			return false;
		}
		
		function onResize(e) {
			var wh = d.documentElement.clientHeight || d.body.clientHeight;
		}
	}
}

var MAIN = {
	
	name: "main",
	require: "/assets/require.html",
	script: undefined,
	key: undefined,
	
	func: {
		getPropVal: function(t, p) {
			return document.defaultView.getComputedStyle(t, "").getPropertyValue(p);
		}
	},
	
	////////////////////////////////////////////////////////////////////////////////////////////////
	// Progress
	////////////////////////////////////////////////////////////////////////////////////////////////
	
	// ページ全体のプログレスバー
	Progress: {
		
		prog: undefined, // .progress
		progInner: undefined, // progress inner wrapper
		progBar: undefined, // progress bar
		monitorContainer: undefined, // Monitoring Target Container
		monitorElm: [], // IMG elements
		monitorElmDummy: [],
		requestId: 0,
		isComplete: false,
		
		option: {
			background: false,
			target: "div, span, header, footer, section, article"
		},
		
		status: {
			value: 0,
			loaded: 0,
			total: 0
		},
		
		init: function(opt) {
			var d = document;
			var data;
			var that = this;
			var outerClass = "progress";
			var innerClass = "progress--inner";
			var barClass = "progress--bar";
			var appendContainer = "document-start";
			var monitoringTarget = "pushstate-root";
			var m = MAIN;
			
			// init
			if (this.prog && m.require.getBool(m)) {
				this.monitorElm = [];
				this.monitorElmDummy = [];
				this.requestId = 0;
				this.isComplete = false;
				this.status = {
					value: 0,
					loaded: 0,
					total: 0
				};
				this.prog.setAttribute("class", "");
			}
			
			if (!d.getElementsByClassName(outerClass)[0]) {
				if (!this.prog) {
					this.prog = d.createElement("div"); // .progress
					this.progInner = d.createElement("span"); // progress inner (bar wrapper)
					this.progBar = d.createElement("div"); // progress bar
					this.prog.appendChild(this.progInner);
					this.progInner.appendChild(this.progBar);
				}
				this.prog.setAttribute("data-monitoring-container", monitoringTarget);
				this.prog.classList.add(outerClass);
				this.progInner.classList.add(innerClass);
				this.progBar.classList.add(barClass);
				document.getElementById(appendContainer).appendChild(this.prog);
				
			} else {
				this.prog = d.getElementsByClassName(outerClass)[0];
				this.progBar = d.getElementsByClassName(barClass)[0];
				this.progInner = d.getElementsByClassName(innerClass)[0];
			}
			
			data = this.prog.getAttribute("data-monitoring-container") || "";
			document.getElementById(monitoringTarget).classList.remove("progress-complete");
			
			if (opt) {
				for (var prop in opt) {
					this.option[prop] = opt[prop];
				}
			}
			
			if (data) {
				this.monitorContainer = d.getElementById(data);
				
			} else {
				this.monitorContainer = d.getElementByTagName("body")[0];
			}
			
			if (this.option.background) {
				var elm = document.querySelectorAll(this.option.target); // 背景画像が設定されていそうな要素を取得
				
				for (var i = 0; i < elm.length; i++) {
					var style = window.getComputedStyle(elm[i], null).getPropertyValue("background-image");
					
					if (style !== "none") {
						this.monitorElm.push(style.substring(5, style.length - 2));
					}
				}
			}
			
			var imgs = this.monitorContainer.getElementsByTagName("img"); // ページ内のIMG要素
			for (var i = 0; i < imgs.length; i++) {
				this.monitorElm.push(imgs[i].getAttribute("src"));
			}
			
			for (var i = 0; i < this.monitorElm.length; i++) {
				that.monitorElmDummy[i] = new Image();
				that.monitorElmDummy[i].src = that.monitorElm[i];
				that.monitorElmDummy[i].addEventListener("load", that.loaded, false);
				that.monitorElmDummy[i].addEventListener("error", that.error, false);
			}
			
			if (imgs.length > 0) {
				this.status.total = this.monitorElm.length;
				this.update(this);
			} else {
				// 画像が一枚もない場合はスキップ
				this.complete(this);
			}
		},
		
		loaded : function(e) {
			MAIN.Progress.status.loaded += 1;
		},
		
		error : function(e) {
			MAIN.Progress.status.loaded += 1;
		},
		
		update: function(t) {
			t.status.value = t.status.loaded / t.status.total * 100;
			t.progBar.style.width = t.status.value + "%";
			
			// complete
			if (t.status.value >= 100) {
				var duration = document.defaultView.getComputedStyle(t.progBar, "").getPropertyValue("transition-duration");
				duration = duration.indexOf("ms") > -1 ? parseFloat(duration) : parseFloat(duration) * 1000;
				
				setTimeout(function() {
					t.complete(t);
				}, duration);
				
			} else {
				t.requestId = window.requestAnimationFrame(function(){
					t.update(t);
				});
			}
		},
		
		complete: function(t) {
			t.isComplete = true;
			t.prog.classList.add("progress-complete");
			document.getElementById("pushstate-root").classList.add("progress-complete");
			document.getElementById("pushstate-root").classList.add("onloadcomplete");
			document.getElementById("pushstate-root").style.height = "auto";
			t.remove(t);
		},
		
		remove: function(t) {
			window.cancelAnimationFrame(t.requestId);
			for (var i = 0; i < t.monitorElm.length; i++) {
				t.monitorElmDummy[i].removeEventListener("load", t.loadedImage, false);
			}
		}
	},
	
	////////////////////////////////////////////////////////////////////////////////////////////////
	// GlobalNavigation
	////////////////////////////////////////////////////////////////////////////////////////////////
	
	GlobalNavigation: {
		
		an: null,
		gh: null,
		gn: null,
		gw: null,
		ma: null,
		fh: null,
		ol: null,
		ol_bk: null,
		na: null,
		ni: null,
		niobj: [],
		
		init: function() {
			var d = document;
			var that = this;
			
			that.gh = d.getElementById("gh");
			that.gn = d.getElementById("gh-menu");
			that.gw = d.querySelector(".gh-menu-inner");
			that.an = d.querySelectorAll(".gh-menu-inner .anm");
			that.an2 = that.gh.getElementsByClassName("anm");
			that.ma = d.querySelectorAll(".js-menu a");
			that.ni = d.querySelectorAll(".nav-item");
			that.ol = d.createElement("div");
			that.ol.classList.add("overlay");
			that.ol_bk = d.createElement("div");
			that.ol_bk.classList.add("overlay_bk");
			that.gn.appendChild(that.ol);
			that.gn.appendChild(that.ol_bk);
			that.fh = d.querySelector(".js-ios-fixed-height");
			
			for (var i = 0; i < that.ma.length; i++) {
				that.ma[i].addEventListener("click", function(e) {that.onClick(e, that)}, false);
			}
			
			window.addEventListener("resize", function(e) {that.changeInnerHeight(e, that)}, false);
			
			that.ol.addEventListener("transitionend", function(e) {
				var n = that.gh;
				var o = that.gn;
				var m = MAIN.func.getPropVal(e.currentTarget, "opacity");
				
				if (e.propertyName === "opacity") {
					if (m === "0"){
						n.classList.add("-hide");
						o.classList.add("-hide");
						that.gh.classList.remove("-show");
						that.gw.scrollTop = 0;
					}
				}
			}, false);
			
			that.gh.classList.add("-hide");
			that.gn.classList.add("-hide");
		},
		
		onClick: function(e, t) {
			if (e.preventDefault) {
				e.preventDefault();
			}
			t.toggle(e, t);
			return false;
		},
		
		toggle: function(e, t) {
			var time = 0.5;
			var delay = 0.05;
			
			if (t.gh.classList.contains("-show")) {
				if (e.type === "mouseenter") {
					return;
				}
				time = 0;
				delay = 0;
				t.gh.classList.remove("-show");
				t.gn.classList.remove("-show");
				
			} else {
				t.gh.classList.remove("-hide");
				t.gh.classList.add("-show");
				t.gn.classList.remove("-hide");
				t.gn.classList.add("-show");
				
				
			}
			
			for (var i = 0; i < t.an.length; i++) {
				t.an[i].style.transitionDelay = time + (delay * i) + "s";
			}
			
			for (var i = 0; i < t.an2.length; i++) {
				t.an2[i].style.transitionDelay = (delay * i) + "s";
			}
			
			t.changeInnerHeight("", t);
		},
		
		changeInnerHeight: function(e, t) {
			if (UA.os === "ios") {
				t.gw.style.height = window.innerHeight + "px";
			}
		}
	},
	
	init: function() {
		var that = this;
		var d = document;
		
		PopupMenu.init();
		MAIN.GlobalNavigation.init();
		currentPageHighlight("gh-menu");
		
		var ghm = document.getElementById("gh-menu");
		var ghmgroup = document.getElementsByClassName("js-wrap-g");
		var delay = 24;
		if (document.getElementsByTagName("html")[0].getAttribute("lang") == "en") {
			delay = delay / 2;
		}
		for (var i = 0; i < ghmgroup.length; i++) {
			wrapInnerText(ghmgroup[i], delay, false, 200);
		}
		
		that.Progress.init({
			background: false // 背景画像も監視対象に含める場合はtrue デフォルトはfalse
		});
	}
}

var ParallaxKeyvisual = {
	
	kvh: 0,
	
	init: function () {
		var kv = document.getElementById("kv");
		var body = document.getElementsByTagName("body")[0];
		
		if (kv) {
			if (UA.os === "ios") {
				kv.style.height = window.innerHeight + "px";
			}
			ParallaxKeyvisual.parallax();
			
		} else {
			body.classList.add("scroll-outside-kv");
			body.classList.remove("scroll-inside-kv");
			ParallaxKeyvisual.kvh = 0;
		}
	},
	
	parallax: function() {
		var w = window;
		var d = document.documentElement;
		var kvinner = document.getElementById("kv__img");
		var n = 0;
		var b = 0;
		var body = document.getElementsByTagName("body")[0];
		var kv = document.getElementsByClassName("kv")[0];
		ParallaxKeyvisual.kvh = kv.getBoundingClientRect().height;
		
		this.onScroll = function(e) {
			var d = document;
			var y = d.documentElement.scrollTop || d.body.scrollTop;
			n = y / 3;
			
			if (ParallaxKeyvisual.kvh > y) {
				body.classList.add("scroll-inside-kv");
				body.classList.remove("scroll-outside-kv");
				
			} else {
				body.classList.remove("scroll-inside-kv");
				body.classList.add("scroll-outside-kv");
			}
		}
		
		this.onResize = function(e) {
			ParallaxKeyvisual.kvh = kv.getBoundingClientRect().height;
			ParallaxKeyvisual.onScroll();
		}
		
		var move = (function () {
			if (UA.browser === "msie") {
				return false;
			}
			kvinner.style.transform = "translate3d(0," + n + "px,0)";
			kvinner.style.transformOrigin = "0 0";
			window.requestAnimationFrame(arguments.callee);
		})();
		
		this.onScroll();
		this.onResize();
		window.addEventListener("scroll", this.onScroll, false);
		window.addEventListener("resize", this.onResize, false);
	},
	
	destroy: function() {
		window.removeEventListener("scroll", ParallaxKeyvisual.onScroll);
		window.removeEventListener("resize", ParallaxKeyvisual.onResize);
	}
}

var _Require_ = {
	bool: undefined,
	key: undefined,
	src: "data:text/javascript;base64,Y29uc29sZS5sb2coImhvZ2VmdWdhIik7",
	
	set: function (b, k, h, v, o) {
		var hiddenElm = document.getElementById(h);
		var that = this;
		var t = b
		var r = new XMLHttpRequest();
		r.overrideMimeType("text/html");
		r.open("POST", b, true);
		r.responseType = "text";
		r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		r.send(encodeURIComponent(k) + "=" + encodeURIComponent(v));
		r.onreadystatechange = function () {
			if (r.readyState === 4 && r.status === 200) {
				var s = document.createElement("script");
				s.id = "require_" + o.name;
				if (r.responseText) {
					that.bool = 1;
					o.key = r.responseText;
					o.require = that;
					o.script = s;
					o.init();
					hiddenElm.style.visibility = "visible";
					hiddenElm.classList.remove("require");
				} else {
					document.head.appendChild(s);
					that.true(that, s);
				}
			} else {
				that.bool = undefined;
			}
		}
		hiddenElm.style.visibility = "hidden";
		hiddenElm.classList.add("require");
	},
	
	getBool: function (s) {
		return this.bool ? this.bool : this.true(this, s);
	},
	
	true: function(t, s) {
		s.src = t.src;
		return true;
	}
}

document.addEventListener("DOMContentLoaded", function() {
	
	const p = "pushstate-root";
	const k = "m";
	
	if (UA.browser !== "msie") {
		ScrollDirection.init();
		setPriorityLanguage();
	}
	
	document.getElementsByTagName("body")[0].classList.add("domContentLoaded");
	
	_Require_.set(MAIN.require, k, p, document.domain, MAIN);
	_Require_.set(PJAX.require, k, p, document.domain, PJAX);
	_Require_.set(Icon.require, k, p, document.domain, Icon);
	
	createTopOfPage();
	tripla();
	
}, false);

window.addEventListener("load", function() {
	FONTPLUS.reload(true);
	document.getElementsByTagName("body")[0].classList.add("load");
	
	if (typeof GAS_pjaxOnLoadComplete === "function") {
		GAS_pjaxOnLoadComplete();
	}
	
}, false);

(function() {
	var d = document
	var h = d.getElementsByTagName("html")[0];
	var w = window;
	
	if (UA.os === "win") {
		h.classList.add("windows");
	}
	if (UA.browser === "msie") {
		h.classList.add("msie");
	}
	if (UA.browser == "edge") {
		h.classList.add("edge");
	}
	if (UA.browser === "msie") {
		if (UA.version === 11) {
			h.classList.add("ie11");
		}
		if (UA.version < 11) {
			h.classList.add("under-ie11");
		}
	}
	
	if (UA.browser === "msie" && UA.version < 9) {
		h.classList.add("under-ie9");
	}
	
	h.classList.add("js");
	
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
	// requestAnimationFrame polyfill by Erik Moller. fixes from Paul Irish and Tino Zijdel
	
	w.requestAnimationFrame = (function() {
		return w.requestAnimationFrame || w.webkitRequestAnimationFrame;
	})();
	
	w.cancelAnimationFrame = (function() {
		return w.cancelAnimationFrame || w.webkitCancelAnimationFrame;
	})();
	
	if (!w.requestAnimationFrame) {
		w.requestAnimationFrame = function(cb) {
			var id = window.setTimeout(cb, 1000 / 60);
			return id;
		};
	}
	
	if (!w.cancelAnimationFrame) {
		w.cancelAnimationFrame = function(id) {
			w.clearTimeout(id);
		}
	}
	
	FONTPLUS.async();
})();



////////////////////////////////////////////////////////////////////////////////////////////////
// tripla

function tripla() {
	
	var parent;
	var iframe;
	var btn;
	var btnInner;
	var btnImg;
	var message; // tripla default : iframe
	var messageContainer; // append : div
	var timeout = 0;
	window.addEventListener("DOMContentLoaded", checkAppended, false);
	
	function checkAppended() {
		window.removeEventListener("DOMContentLoaded", checkAppended, false);
		
		var lang = document.getElementsByTagName("html")[0].getAttribute("lang");
		var txt = "AI･人工知能がご用件をお伺い致します。";
		
		if (lang === "en") {
			txt = "Welcome to use AI chatbot! Feel free to ask any questions.";
			
		} else if (lang === "ko") {
			txt = "AI･인공지능이 문의에 답해드립니다.";
			
		} else if (lang === "zh-cn") {
			txt = "如有問題請在此詢問 AI・人工智能為您解答。";
			
		} else if (lang === "zh-tw") {
			txt = "欢迎使用在线对话服务 AI・人工智能为您解答问题";
		}
		
		if (document.getElementById("tripla-chat-window")) {
			iframe = document.getElementById("tripla-chat-window");
			iframe.classList.add("tripla-chat-window");
			
			if (iframe.parentNode) {
				parent = iframe.parentNode;
				parent.classList.add("tripla");
			}
			
			if (iframe.nextElementSibling) {
				btn = iframe.nextElementSibling;
				btn.classList.add("tripla-btn");
				btn.style.bottom = "25px";
				btn.style.right = "15px";
				btn.style.height = "40px";
				btn.style.width = "40px";
				
				if (UA.device === "other") {
					btn.style.right = "35px";
					btn.style.bottom = "35px";
				}
			}
			
			if (btn.getElementsByTagName("div")[0]) {
				btnInner = btn.getElementsByTagName("div")[0];
				btnInner.classList.add("tripla-btn-inner"); // triplabot-icon-container にクラス名が変更されたため独自データ属性でスタイルを指定
				btnInner.setAttribute("data-tripla-okunoyu-class","tripla-btn-inner");
				btnInner.setAttribute("title", txt);
			}
			
			if (btn.getElementsByTagName("img")[0]) {
				btnImg = btn.getElementsByTagName("img")[0];
				/*btnImg.style.display = "none";*/
			}
			
			// has message
			if (btn.nextElementSibling) {
				message = btn.nextElementSibling;
				message.classList.add("tripla-message");
			}
			
			// animation message
			if (document.getElementsByClassName("tripla-message")[0]) {
				var tm = document.getElementsByClassName("tripla-message")[0];
				tm.style.display = "none";
				tm.parentNode.removeChild(tm);
				var messageContainer = document.createElement("div");
				messageContainer.classList.add("tripla-message-2");
				messageContainer.innerText = txt;
				btn.appendChild(messageContainer);
				
				setTimeout(function() {
					messageContainer.classList.add("hide-txt");
				}, 7000);
				
				if (UA.device === "other") {
					messageContainer.style.right = "60px";
				} else {
					messageContainer.style.right = "35px";
				}
			}
			
			// icon (white)
			var img = document.createElement("img");
			img.src = "/assets/img/global/icon_chat_2_wt.png";
			img.classList.add("icon-img-extra");
			img.classList.add("icon-img-wt");
			img.style.maxWidth = "100%";
			btnInner.appendChild(img);
			
			// icon (black)
			var img_bk = document.createElement("img");
			img_bk.src = "/assets/img/global/icon_chat_2.png";
			img_bk.classList.add("icon-img-extra");
			img_bk.classList.add("icon-img-bk");
			img_bk.style.maxWidth = "100%";
			btnInner.appendChild(img_bk);
			
			btnInner.style.border = "none";
			
			
		} else {
			if (timeout < 5000) {
				setTimeout(checkAppended, 24);
			} else {
				timeout += 24;
			}
		}
	}
}



////////////////////////////////////////////////////////////////////////////////////////////////

var Icon = {
	
	name: "icon",
	require: "/assets/require.html",
	script: undefined,
	
	init: function() {
		Icon.set(document);
	},
	
	set: function(target) {
		var target = target;
		var elms = target.querySelectorAll("[data-icon]");
		for (var i = 0; i < elms.length; i++) {
			var id = elms[i].getAttribute("data-icon");
			elms[i].innerHTML = Icon.data[id] || "";
		}
	},
	
	data: {
		"icon_wedge-arrow-r" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M13.5,12 M7.7,4.9l9.1,7.1l-9.1,7.1"/></svg>',
		"icon_wedge-arrow-l" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M10.5,12 M16.3,19.1L7.3,12l9.1-7.1"/></svg>',
		"icon_wedge-arrow-u" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M12,10.5 M4.9,16.3L12,7.3l7.1,9.1"/></svg>',
		"icon_wedge-arrow-d" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M12,13.5 M19.1,7.7L12,16.7L4.9,7.7"/></svg>',
		
		"icon_wedge-arrow-r-c" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle class="inline-svg--line-round" cx="12" cy="12" r="7.6"/><polyline class="inline-svg--line-round" points="10.7,9.3 13.7,12 10.7,14.7 "/></svg>',
		"icon_wedge-arrow-l-c" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle class="inline-svg--line-round" cx="12" cy="12" r="7.6"/><polyline class="inline-svg--line-round" points="13.3,14.7 10.3,12 13.3,9.3 "/></svg>',
		"icon_wedge-arrow-u-c" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle class="inline-svg--line-round" cx="12" cy="12" r="7.6"/><polyline class="inline-svg--line-round" points="8.8,13.6 12,10 15.2,13.6 "/></svg>',
		"icon_wedge-arrow-d-c" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle class="inline-svg--line-round" cx="12" cy="12" r="7.6"/><polyline class="inline-svg--line-round" points="15.2,10.4 12,14 8.8,10.4 "/></svg>',
		
		"icon_arrow-r" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M13.5,12 M14.9,7l6.9,5l-6.9,5"/><line class="inline-svg--line-round" x1="21.9" y1="12" x2="2.1" y2="12"/></svg>',
		"icon_arrow-l" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M10.5,12 M9.1,17l-6.9-5l6.9-5"/><line class="inline-svg--line-round" x1="2.1" y1="12" x2="21.9" y2="12"/></svg>',
		"icon_arrow-u" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M12,10.5 M7,9.1l5-6.9l5,6.9"/><line class="inline-svg--line-round" x1="12" y1="2.1" x2="12" y2="21.9"/></svg>',
		"icon_arrow-d" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M12,13.5 M17,14.9l-5,6.9l-5-6.9"/><line class="inline-svg--line-round" x1="12" y1="21.9" x2="12" y2="2.1"/></svg>',
		
		"icon_phone" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M6.6,10.8c1.4,2.8,3.8,5.1,6.6,6.6l2.2-2.2c0.3-0.3,0.7-0.4,1-0.2c1.1,0.4,2.3,0.6,3.6,0.6c0.5,0,1,0.4,1,1V20c0,0.5-0.5,1-1,1C10.6,21,3,13.4,3,4c0-0.5,0.5-1,1-1h3.5c0.6,0,1,0.5,1,1c0,1.3,0.2,2.4,0.6,3.6c0.1,0.3,0,0.7-0.3,1L6.6,10.8z"/></svg>',
		"icon_mail" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line" d="M18.2,17.3H5.8c-0.6,0-1-0.4-1-1V7.6c0-0.6,0.4-1,1-1h12.5c0.6,0,1,0.4,1,1v8.8C19.2,16.9,18.8,17.3,18.2,17.3z"/><polyline class="inline-svg--line" points="4.8,8.4 11.9,12 19.2,8.4 "/></svg>',
		"icon_blank" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line" d="M17.9,11.9v4.6c0,0.6-0.4,1-1,1H7.1c-0.6,0-1-0.4-1-1V7.4c0-0.6,0.4-1,1-1h4.7"/><line class="inline-svg--line" x1="11.9" y1="12" x2="18.4" y2="5.5"/><polyline class="inline-svg--line" points="18.4,9.3 18.4,5.5 14.6,5.5 "/></svg>',
		"icon_star-rate" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M12.2,15.7l4,2.9c0.3,0.2,0.7-0.1,0.6-0.4l-1.5-4.7c-0.1-0.2,0-0.3,0.1-0.4l3.9-2.8c0.3-0.2,0.2-0.7-0.2-0.7h-4.8c-0.2,0-0.3-0.1-0.4-0.3l-1.6-4.8c-0.1-0.4-0.6-0.4-0.8,0l-1.6,4.8C10,9.4,9.9,9.5,9.7,9.5H4.9c-0.4,0-0.5,0.5-0.2,0.7l3.9,2.8c0.1,0.1,0.2,0.3,0.1,0.4l-1.5,4.7c-0.1,0.4,0.3,0.7,0.6,0.4l4-2.9C11.9,15.6,12.1,15.6,12.2,15.7z"/></svg>',
		"icon_device-desktop" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M19.1,17.1H4.9c-0.4,0-0.8-0.4-0.8-0.8V6.3c0-0.4,0.4-0.8,0.8-0.8h14.2c0.4,0,0.8,0.4,0.8,0.8v9.9C19.9,16.7,19.6,17.1,19.1,17.1z"/><path class="inline-svg--line-round" d="M10.2,17.1l-0.7,2.5c-0.1,0.2,0.1,0.4,0.3,0.4h4.6c0.2,0,0.3-0.2,0.3-0.4l-0.7-2.5"/><line class="inline-svg--line-round" x1="19.9" y1="15.7" x2="4.1" y2="15.7"/><line class="inline-svg--line-round" x1="4.1" y1="6.9" x2="19.9" y2="6.9"/></svg>',
		"icon_device-mobile" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M16.9,5.3c0-0.8-0.6-1.4-1.4-1.4h-7c-0.8,0-1.4,0.6-1.4,1.4V19c0,0.8,0.6,1.4,1.4,1.4h7c0.8,0,1.4-0.6,1.4-1.4V5.3z"/><circle class="inline-svg--line-round" cx="12" cy="18.4" r="0.7"/><line class="inline-svg--line-round" x1="16.9" y1="16.4" x2="7.1" y2="16.4"/><line class="inline-svg--line-round" x1="7.1" y1="5.7" x2="16.9" y2="5.7"/></svg>',
		"icon_device" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g><path class="inline-svg--line" d="M14.1,17.1H3.6c-0.4,0-0.8-0.4-0.8-0.8V5.3c0-0.4,0.4-0.8,0.8-0.8h14.6c0.4,0,0.8,0.4,0.8,0.8v3.3"/><path class="inline-svg--line" d="M9.1,17.1l-0.7,2.5c-0.1,0.2,0.1,0.4,0.3,0.4h4.6c0.2,0,0.3-0.2,0.3-0.4l-0.7-2.5"/><line class="inline-svg--line" x1="14.1" y1="15.1" x2="2.8" y2="15.1"/><line class="inline-svg--line" x1="2.8" y1="5.9" x2="19" y2="5.9"/></g><g><line class="inline-svg--line" x1="20.9" y1="17.9" x2="15.1" y2="17.9"/><line class="inline-svg--line" x1="15.1" y1="11.1" x2="20.9" y2="11.1"/><path class="inline-svg--line" d="M20.3,20.2h-4.7c-0.3,0-0.6-0.3-0.6-0.6v-9.4c0-0.3,0.3-0.6,0.6-0.6h4.7c0.3,0,0.6,0.3,0.6,0.6v9.4C20.9,20,20.7,20.2,20.3,20.2z"/><circle cx="18" cy="19" r="0.4"/></g></svg>',
		"icon_place" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
		
		"icon_unlock" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line" d="M17,18.8H7c-0.4,0-0.8-0.4-0.8-0.8v-7.8c0-0.4,0.4-0.8,0.8-0.8h10c0.4,0,0.8,0.4,0.8,0.8V18C17.8,18.4,17.4,18.8,17,18.8z"/><circle class="inline-svg--line-fill" cx="12" cy="14.1" r="1.1"/><path class="inline-svg--line" d="M9,6.5c0.4-1.2,1.6-2.1,3-2.1h0c1.8,0,3.2,1.4,3.2,3.2v2"/></svg>',
		"icon_lock" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line" d="M17,18.8H7c-0.4,0-0.8-0.4-0.8-0.8v-7.8c0-0.4,0.4-0.8,0.8-0.8h10c0.4,0,0.8,0.4,0.8,0.8V18C17.8,18.4,17.4,18.8,17,18.8z"/><circle class="inline-svg--line-fill" cx="12" cy="14.1" r="1.1"/><path class="inline-svg--line" d="M8.8,9.1V7.6c0-1.8,1.4-3.2,3.2-3.2h0c1.8,0,3.2,1.4,3.2,3.2v2"/></svg>',
		"icon_calendar" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line" d="M17,17.7H7c-0.4,0-0.8-0.4-0.8-0.8V7.1c0-0.4,0.4-0.8,0.8-0.8h10c0.4,0,0.8,0.4,0.8,0.8v9.9C17.8,17.4,17.4,17.7,17,17.7z"/><line class="inline-svg--line" x1="8.8" y1="4.9" x2="8.8" y2="6.5"/><path class="inline-svg--fill-only" d="M6.2,9.9V7.1c0-0.4,0.4-0.8,0.8-0.8h10c0.4,0,0.8,0.4,0.8,0.8v2.9H6.2z"/><line class="inline-svg--line" x1="15.1" y1="4.9" x2="15.1" y2="6.5"/><circle class="inline-svg--line-fill" cx="10.3" cy="11.8" r="0.1"/><circle class="inline-svg--line-fill" cx="8.6" cy="11.8" r="0.1"/><circle class="inline-svg--line-fill" cx="12" cy="11.8" r="0.1"/><circle class="inline-svg--line-fill" cx="13.7" cy="11.8" r="0.1"/><circle class="inline-svg--line-fill" cx="15.4" cy="11.8" r="0.1"/><circle class="inline-svg--line-fill" cx="10.3" cy="13.7" r="0.1"/><circle class="inline-svg--line-fill" cx="8.6" cy="13.7" r="0.1"/><circle class="inline-svg--line-fill" cx="12" cy="13.7" r="0.1"/><circle class="inline-svg--line-fill" cx="13.7" cy="13.7" r="0.1"/><circle class="inline-svg--line-fill" cx="15.4" cy="13.7" r="0.1"/><circle class="inline-svg--line-fill" cx="10.3" cy="15.6" r="0.1"/><circle class="inline-svg--line-fill" cx="8.6" cy="15.6" r="0.1"/></svg>',
		"icon_close" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M13.5,12 M18,6.1L6,18 M18,18L6,6.1"/></svg>',
		"icon_done" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline class="inline-svg--line-round" points="18.8,7.2 7.6,18.7 4.5,15.6 "/></svg>',
		"icon_done-circle" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline class="inline-svg--line-round" points="16.4,9 10,15.5 7.7,13.1 "/><circle class="inline-svg--line-round" cx="12" cy="12" r="7.6"/></svg>',
		"icon_list" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect class="inline-svg--fill-only" x="3" y="11" width="18" height="2"/><rect class="inline-svg--fill-only" x="3" y="17" width="13" height="2"/><rect class="inline-svg--fill-only" x="3" y="5" width="18" height="2"/></svg>',
		"icon_plus" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M12,5.1V19 M18.9,12H5.1"/></svg>',
		"icon_minus" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M18.9,12H5.1"/></svg>',
		"icon_add" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M12,7.3v9.6 M16.7,12H7.3"/><circle class="inline-svg--line-round" cx="12" cy="12" r="7.6"/></svg>',
		"icon_info" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle class="inline-svg--line-round" cx="12" cy="12" r="7.6"/><line class="inline-svg--line" x1="12" y1="16.3" x2="12" y2="9.9"/><circle class="inline-svg--line" cx="12" cy="7.5" r="0.2"/></svg>',
		"icon_feed" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle class="inline-svg--fill-only" cx="6.2" cy="17.8" r="2.2"/><path class="inline-svg--fill-only" d="M4,4.4v2.8c7,0,12.7,5.7,12.7,12.7h2.8C19.6,11.4,12.6,4.4,4,4.4z M4,10.1v2.8c3.9,0,7.1,3.2,7.1,7.1h2.8C13.9,14.5,9.5,10.1,4,10.1z"/></svg>',
		"icon_help" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle class="inline-svg--line-round" cx="12" cy="12" r="7.6"/><circle class="inline-svg--line" cx="12" cy="16.5" r="0.2"/><path class="inline-svg--line" d="M9.4,9.7L9.4,9.7c0-1.3,1-2.3,2.3-2.3h0.7c1.3,0,2.3,1,2.3,2.3v0c0,1.3-1.2,1.7-1.9,2.3c-0.6,0.6-0.8,0.8-0.8,1.9"/></svg>',
		"icon_search" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
		"icon_replace" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--line-round" d="M19.3,11c-0.5-3.6-3.6-6.4-7.3-6.4S5.2,7.4,4.7,11"/><path class="inline-svg--line-round" d="M4.7,13c0.5,3.6,3.6,6.4,7.3,6.4s6.8-2.8,7.3-6.4"/><polyline class="inline-svg--line-round" points="21.1,8.1 19.3,11 16.4,9.3 "/><polyline class="inline-svg--line-round" points="2.9,15.9 4.7,13 7.6,14.7 	"/></svg>',
		"icon_refresh" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline class="inline-svg--line-round" points="15.2,8.8 19.5,8.8 19.5,4.5 "/><path class="inline-svg--line" d="M19,14.8c-1.1,2.8-3.8,4.7-7,4.7c-4.1,0-7.5-3.4-7.5-7.5S7.9,4.5,12,4.5c2.1,0,3.9,0.8,5.3,2.2l2.2,2.1"/></svg>',
		"icon_directions" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z"/></svg>',
		"icon_directions_car" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M18.9,6c-0.2-0.6-0.8-1-1.4-1h-11C5.8,5,5.3,5.4,5.1,6L3,12v8c0,0.5,0.5,1,1,1h1c0.6,0,1-0.5,1-1v-1h12v1c0,0.5,0.5,1,1,1h1c0.5,0,1-0.5,1-1v-8L18.9,6z M6.5,16C5.7,16,5,15.3,5,14.5S5.7,13,6.5,13S8,13.7,8,14.5S7.3,16,6.5,16z M17.5,16c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S18.3,16,17.5,16z M5,11l1.5-4.5h11L19,11H5z"/></svg>',
		"icon_directions_bus" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M4,16.9c0,0.9,0.4,1.7,1,2.2v1.8c0,0.5,0.4,1,1,1h1c0.6,0,1-0.5,1-1v-1h8v1c0,0.5,0.5,1,1,1h1c0.5,0,1-0.5,1-1v-1.8c0.6-0.5,1-1.3,1-2.2v-10c0-3.5-3.6-4-8-4s-8,0.5-8,4V16.9z M7.5,17.9c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5S9,15.5,9,16.4S8.3,17.9,7.5,17.9z M16.5,17.9c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S17.3,17.9,16.5,17.9z M18,11.9H6v-5h12V11.9z"/></svg>',
		"icon_directions_railway" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M12,2C7.6,2,4,2.5,4,6v9.5C4,17.4,5.6,19,7.5,19L6,20.5V21h12v-0.5L16.5,19c1.9,0,3.5-1.6,3.5-3.5V6C20,2.5,16.4,2,12,2z M7.5,17C6.7,17,6,16.3,6,15.5S6.7,14,7.5,14S9,14.7,9,15.5S8.3,17,7.5,17z M11,11H6V6h5V11z M16.5,17c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S17.3,17,16.5,17z M18,11h-5V6h5V11z"/></svg>',
		"icon_directions_flight" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>',
		"icon_more_horiz" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
		"icon_more_vert" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
		"icon_share" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>',
		"icon_zoom_in" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm.5-7H9v2H7v1h2v2h1v-2h2V9h-2z"/></svg>',
		"icon_zoom_out" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7V9z"/></svg>',
		
		// External service
		"icon_sns_twitter" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M23,5.1c-0.8,0.4-1.7,0.6-2.6,0.7c0.9-0.6,1.6-1.4,2-2.5c-0.9,0.5-1.8,0.9-2.9,1.1c-0.8-0.9-2-1.4-3.3-1.4c-2.5,0-4.5,2-4.5,4.5c0,0.4,0,0.7,0.1,1c-3.8-0.2-7.1-2-9.3-4.7C2.1,4.5,1.9,5.3,1.9,6.1c0,1.6,0.8,2.9,2,3.8c-0.7,0-1.4-0.2-2-0.6c0,0,0,0,0,0.1c0,2.2,1.6,4,3.6,4.4c-0.4,0.1-0.8,0.2-1.2,0.2c-0.3,0-0.6,0-0.8-0.1C4,15.6,5.7,16.9,7.7,17c-1.5,1.2-3.5,1.9-5.6,1.9c-0.4,0-0.7,0-1.1-0.1c2,1.3,4.4,2,6.9,2c8.3,0,12.8-6.9,12.8-12.8c0-0.2,0-0.4,0-0.6C21.6,6.8,22.4,6,23,5.1z"/></svg>',
		"icon_sns_facebook" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M21.8,1H2.2C1.5,1,1,1.5,1,2.2v19.6C1,22.5,1.5,23,2.2,23h10.5v-8.5H9.9v-3.3h2.9V8.7c0-2.8,1.7-4.4,4.3-4.4c1.2,0,2.3,0.1,2.6,0.1v3l-1.8,0c-1.4,0-1.6,0.7-1.6,1.6v2.1h3.3L19,14.5h-2.9V23h5.6c0.7,0,1.2-0.5,1.2-1.2V2.2C23,1.5,22.5,1,21.8,1z"/></svg>',
		"icon_sns_instagram" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M12,3c2.9,0,3.3,0,4.4,0.1c1.1,0,1.7,0.2,2,0.4c0.5,0.2,0.9,0.4,1.3,0.8c0.4,0.4,0.6,0.8,0.8,1.3c0.2,0.4,0.3,1,0.4,2C21,8.7,21,9.1,21,12s0,3.3-0.1,4.4c0,1.1-0.2,1.7-0.4,2c-0.2,0.5-0.4,0.9-0.8,1.3c-0.4,0.4-0.8,0.6-1.3,0.8c-0.4,0.2-1,0.3-2,0.4C15.3,21,14.9,21,12,21S8.7,21,7.6,21c-1.1,0-1.7-0.2-2-0.4c-0.5-0.2-0.9-0.4-1.3-0.8c-0.4-0.4-0.6-0.8-0.8-1.3c-0.2-0.4-0.3-1-0.4-2C3,15.3,3,14.9,3,12S3,8.7,3,7.6c0-1.1,0.2-1.7,0.4-2C3.6,5,3.9,4.6,4.2,4.2C4.6,3.9,5,3.6,5.5,3.4c0.4-0.2,1-0.3,2-0.4C8.7,3,9.1,3,12,3 M12,1C9,1,8.6,1,7.5,1.1c-1.2,0.1-2,0.2-2.7,0.5C4.1,1.9,3.5,2.2,2.8,2.8c-0.6,0.6-1,1.2-1.3,1.9C1.3,5.5,1.1,6.3,1.1,7.5C1,8.6,1,9,1,12c0,3,0,3.4,0.1,4.5c0.1,1.2,0.2,2,0.5,2.7c0.3,0.7,0.7,1.3,1.3,1.9c0.6,0.6,1.2,1,1.9,1.3c0.7,0.3,1.5,0.5,2.7,0.5C8.6,23,9,23,12,23s3.4,0,4.5-0.1c1.2-0.1,2-0.2,2.7-0.5c0.7-0.3,1.3-0.7,1.9-1.3c0.6-0.6,1-1.2,1.3-1.9c0.3-0.7,0.5-1.5,0.5-2.7C23,15.4,23,15,23,12s0-3.4-0.1-4.5c-0.1-1.2-0.2-2-0.5-2.7c-0.3-0.7-0.7-1.3-1.3-1.9c-0.6-0.6-1.2-1-1.9-1.3c-0.7-0.3-1.5-0.5-2.7-0.5C15.4,1,15,1,12,1L12,1z"/><path class="inline-svg--fill-only" d="M12,6.4c-3.1,0-5.6,2.5-5.6,5.6s2.5,5.6,5.6,5.6s5.6-2.5,5.6-5.6S15.1,6.4,12,6.4z M12,15.7c-2,0-3.7-1.6-3.7-3.7c0-2,1.6-3.7,3.7-3.7c2,0,3.7,1.6,3.7,3.7C15.7,14,14,15.7,12,15.7z"/><circle class="inline-svg--fill-only" cx="17.9" cy="6.1" r="1.3"/></svg>',
		"icon_sns_google-plus" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M8,11.3v2.4h4c-0.2,1-1.2,3-4,3c-2.4,0-4.3-2-4.3-4.4s2-4.4,4.3-4.4c1.4,0,2.3,0.6,2.8,1.1l1.9-1.8C11.5,6,9.9,5.3,8,5.3c-3.9,0-7,3.1-7,7s3.1,7,7,7c4,0,6.7-2.8,6.7-6.8c0-0.5-0.1-0.8-0.1-1.2H8L8,11.3z"/><path class="inline-svg--fill-only" d="M23,11.3h-2v-2h-2v2h-2v2h2v2h2v-2h2V11.3z"/></svg>',
		"icon_sns_youtube" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M22.8,7.3c0,0-0.2-1.5-0.9-2.2c-0.8-0.9-1.8-0.9-2.2-0.9C16.6,4,12,4,12,4h0c0,0-4.6,0-7.7,0.2C3.9,4.3,2.9,4.3,2.1,5.2C1.4,5.8,1.2,7.3,1.2,7.3S1,9.1,1,10.9v1.7c0,1.8,0.2,3.6,0.2,3.6s0.2,1.5,0.9,2.2c0.8,0.9,1.9,0.8,2.4,0.9c1.8,0.2,7.5,0.2,7.5,0.2s4.6,0,7.7-0.2c0.4-0.1,1.4-0.1,2.2-0.9c0.7-0.7,0.9-2.2,0.9-2.2s0.2-1.8,0.2-3.6v-1.7C23,9.1,22.8,7.3,22.8,7.3z M9.7,14.6l0-6.2l5.9,3.1L9.7,14.6z"/></svg>',
		"icon_sns_pinterest" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M12,1.1C6,1.1,1.1,6,1.1,12c0,4.6,2.9,8.5,6.9,10.1c-0.1-0.9-0.2-2.2,0-3.1c0.2-0.8,1.3-5.4,1.3-5.4S9,12.9,9,12c0-1.5,0.9-2.6,2-2.6c0.9,0,1.4,0.7,1.4,1.5c0,0.9-0.6,2.3-0.9,3.6c-0.3,1.1,0.5,2,1.6,2c1.9,0,3.4-2,3.4-5c0-2.6-1.9-4.4-4.5-4.4C8.8,7.1,7,9.4,7,11.8c0,0.9,0.4,1.9,0.8,2.5c0.1,0.1,0.1,0.2,0.1,0.3c-0.1,0.3-0.3,1.1-0.3,1.2c0,0.2-0.2,0.2-0.4,0.1C5.9,15.3,5,13.3,5,11.7c0-3.4,2.5-6.6,7.2-6.6c3.8,0,6.7,2.7,6.7,6.3c0,3.7-2.4,6.8-5.6,6.8c-1.1,0-2.1-0.6-2.5-1.2c0,0-0.5,2.1-0.7,2.6c-0.2,0.9-0.9,2.1-1.4,2.9c1,0.3,2.1,0.5,3.2,0.5c6,0,10.9-4.9,10.9-10.9C22.9,6,18,1.1,12,1.1z"/></svg>',
		"icon_sns_line" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path class="inline-svg--fill-only" d="M23,10.3c0-4.9-4.9-8.9-10.9-8.9c-6,0-10.9,4-10.9,8.9c0,4.4,3.9,8.1,9.1,8.8c0.4,0.1,0.8,0.2,1,0.5c0.1,0.3,0.1,0.7,0,1c0,0-0.1,0.8-0.2,0.9c0,0.3-0.2,1.1,0.9,0.6c1.2-0.5,6.3-3.7,8.6-6.4h0C22.3,14.1,23,12.3,23,10.3z M7.8,13.3H5.6C5.3,13.3,5,13,5,12.7V8.3C5,8,5.3,7.8,5.6,7.8c0.3,0,0.6,0.3,0.6,0.6v3.8h1.6c0.3,0,0.6,0.3,0.6,0.6C8.4,13,8.1,13.3,7.8,13.3z M10,12.7c0,0.3-0.3,0.6-0.6,0.6S8.9,13,8.9,12.7V8.3c0-0.3,0.3-0.6,0.6-0.6S10,8,10,8.3V12.7z M15.3,12.7c0,0.2-0.2,0.5-0.4,0.5c-0.1,0-0.1,0-0.2,0c-0.2,0-0.4-0.1-0.5-0.2L12,10v2.7c0,0.3-0.3,0.6-0.6,0.6c-0.3,0-0.6-0.3-0.6-0.6V8.3c0-0.2,0.2-0.5,0.4-0.5c0.1,0,0.1,0,0.2,0c0.2,0,0.4,0.1,0.5,0.2l2.2,3V8.3c0-0.3,0.3-0.6,0.6-0.6c0.3,0,0.6,0.3,0.6,0.6V12.7z M18.8,9.9c0.3,0,0.6,0.3,0.6,0.6c0,0.3-0.3,0.6-0.6,0.6h-1.6v1h1.6c0.3,0,0.6,0.3,0.6,0.6c0,0.3-0.3,0.6-0.6,0.6h-2.2c-0.3,0-0.6-0.3-0.6-0.6v-2.2c0,0,0,0,0,0c0,0,0,0,0,0V8.3c0,0,0,0,0,0c0-0.3,0.3-0.6,0.6-0.6h2.2c0.3,0,0.6,0.3,0.6,0.6c0,0.3-0.3,0.6-0.6,0.6h-1.6v1H18.8z"/></svg>',
		"icon_share_mail" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path class="inline-svg--fill-only" d="M100,25.2v-5.5c0-1.9-1.3-3.2-3.2-3.2H3.2c-1.9,0-3.2,1.3-3.2,3.2v5.8l49,22.2L100,25.2z"/><path class="inline-svg--fill-only" d="M49,54.9L0,32.7v49.5c0,1.9,1.3,3.2,3.2,3.2h92.9c1.9,0,3.2-1.3,3.9-2.6V32.4L49,54.9z"/></svg>',
		
		// animation arrow
		"animation_arrow" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 10"><line class="arrow-anm-path" x1="0" y1="9.5" x2="59.5" y2="9.5"/><line class="arrow-anm-path arrow-anm-path--short" x1="50" y1="4.5" x2="59.5" y2="9.5"/><polyline class="arrow-base-path" points="0,9.5 59.5,9.5 50,4.5 "/></svg>',
		"animation_arrow-s" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 10"><line class="arrow-anm-path" x1="0" y1="8.5" x2="40" y2="8.5"/><line class="arrow-anm-path arrow-anm-path--short" x1="30.62" y1="3.5" x2="40" y2="8.5"/><polyline class="arrow-base-path" points="30.62,3.5 40,8.5 0,8.5 "/></svg>',
		
		// logo
		"logo_h" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 100"><path class="inline-svg--fill-only" d="M35.15,12.67c-0.06,0.05-0.12,0.1-0.16,0.13c0.28,0.14,0.58,0.29,0.87,0.44c0,0.51,0.24,0.9,0.69,1.16c0.53,0.05,1.45,0.31,2.06,0.31c0.71,0.93,2.36,0.6,2.79,1.91c0.44,0.1,0.88,0.48,1.29,0.5c0.02,0.07,0.02,0.12,0.03,0.17c0.25,0,0.78,0.46,0.95,0.38c0.69,0.77,1.23,0.39,1.56,1.52c0.02,0,0.03-0.01,0.05-0.01c0,1.11,0.36,1.38,0.36,2.29c0.17,0.2,0.22,0.44,0.2,0.67c0.08,0.08,0.13,0.13,0.19,0.19c0.12,0.59,0.05,1.15-0.21,1.68c0.51,0.5,0.7,1.08,0.57,1.75c-0.05,0.05-0.11,0.11-0.17,0.17c0,0.52-0.23,1.25-0.18,1.75c-0.06,0.06-0.11,0.11-0.18,0.18c0,0.09-0.01,0.19-0.02,0.31c-0.04,0.01-0.09,0.02-0.11,0.03c-0.15,0.3-0.29,0.59-0.44,0.88c-0.32,0.14-0.49,0.44-0.77,0.67c-0.1,0-0.24,0-0.38,0c-0.29,1.31-1.2,0.83-1.78,1.58c0,0,0,0.06,0,0.14c-0.69,0.01-1.72,1.64-2.43,1.34c-0.13,0.2-0.79,0.34-0.98,0.41c0.02,0.09-1.57,1.56-1.57,2.4c0.28,0.16,0.5,0.39,0.65,0.69c0.45,0.06,0.91-0.07,1.37,0.12c0.64-0.41,1.23-0.71,1.96-0.32c0.82-0.83,2.42-0.53,3.5-0.8c0.53-0.13,3.34-0.55,3.59-0.8c4.1-0.58,8.5,0.12,12.49-0.41c0.04,0.07,0.09,0.14,0.13,0.19c0.14,0,0.23,0,0.33,0c0.06-0.06,0.12-0.12,0.19-0.18c1.06-0.01,2.07,0.06,3.03,0.4c0.06-0.08,0.11-0.16,0.15-0.21c1.56,0,3.4,0.35,4.86,0.03c0.72,0.59,3.02,0.34,3.67,0.34c0.06,0.06,0.12,0.12,0.19,0.19c0.12,0,0.25,0,0.37,0c0.07,0.07,0.13,0.12,0.18,0.18c0.61,0.01,1.34,0.16,1.89,0.42c0,0.03,0,0.06,0.01,0.11c0.13,0,0.26,0,0.4,0c0.06,0.07,0.1,0.13,0.16,0.19c0.11,0,0.21,0,0.31,0c0.08,0.43,1.06,1.42,0.23,1.9c-0.13,0.19-0.2,0.4-0.19,0.62c-0.24,0.29-0.46,0.55-0.68,0.81c-0.17,0-0.32,0-0.48,0c-0.52,1.01-0.94,3.26-1.07,4.39c-0.04,0.01-0.09,0.03-0.17,0.05c0.11,0.68-0.9,1.89-1.08,2.59c-0.35,1.35-0.08,2.93-0.49,4.26c0.06,0.07-0.09,1.07-0.09,1.2c-0.07,0.07-0.12,0.12-0.18,0.18c0,1.03-0.2,1.94-0.2,2.97c-0.05,0.05-0.1,0.1-0.16,0.16c0,0.12,0,0.24,0,0.36c-0.26,0.28-0.32,2.24-0.4,2.61c-0.02,0.01-0.07,0.02-0.13,0.04c-0.11,0.36-0.32,0.71-0.2,1.08c-0.43,0.96-1.38,0.72-2.03,0.27c0-0.07,0-0.14,0-0.21c-0.2-0.05-0.22-0.27-0.38-0.36c0-0.12,0-0.24,0-0.38c-0.06-0.05-0.14-0.1-0.19-0.14c0-0.16,0-0.28,0-0.41c-0.05-0.05-0.11-0.1-0.17-0.16c0-0.16,0-0.33,0-0.5c0.52-0.39,0.17-1.76,0.17-2.3c0.72-0.68-0.13-2.19,0.55-2.86c0-0.66-0.18-1.13-0.18-1.73c-0.31-0.35-0.14-0.79-0.19-1.22c0.05-0.04,0.12-0.08,0.19-0.14c0-0.12,0-0.23,0-0.34c0.07-0.02,0.12-0.03,0.17-0.05c0-0.1,0-0.2,0-0.29c0.55-0.55,1.09-2.89,1.14-3.54c0.22,0.05,0.46,0.34,0.71,0.02c0-0.14,0-0.29,0-0.49c-0.34-0.13-0.58-0.35-0.74-0.66c0.26-1.18,0.93-1.91,0.93-3.18c0.8-0.67-0.07-2.34-1.07-2.36c-0.04-0.05-0.09-0.13-0.12-0.18c-0.14,0-0.23,0-0.32,0c-0.07-0.06-0.13-0.13-0.2-0.19c-0.48,0-2.71-0.28-2.83-0.72c-0.13,0-0.26,0-0.4,0c-0.12,0.12-0.24,0.24-0.36,0.36c-1.66,0-4.54,0.26-6.02-0.48c-0.18,0.13-0.34,0.25-0.49,0.37c-0.41,0.2-0.73,0.17-0.96-0.08c-0.04,0.06-0.09,0.12-0.13,0.18c-0.15,0-0.29,0-0.41,0c-0.05,0.05-0.08,0.08-0.11,0.11c0.02,0.17,0.05,0.33,0.07,0.52c0.52,0.33,0.79,0.8,0.82,1.42c-0.12,0.12-0.24,0.27-0.19,0.49c-0.49,0.21-1.42,2.26-1.98,2.81c-0.15,0-0.31,0-0.48,0c-0.5,0.75-3.43,2.82-1.93,4.24c0.33,0.12,0.65,0.27,0.95,0.45c0.16-0.26,2.94-0.5,3.44-0.43c-0.31,0.2,1.11-0.62,1.25-0.57c0.86-0.62,5.23,0.24,6.16,0.65c0.76,0.34,1.75,0.87,1.8,1.75c0.03,0.49-0.79,1.97-1.5,1.67c-0.15,0.11-0.31,0.23-0.49,0.37c-2.11-0.18-5.04,1.63-6.9,0.85c-0.31,0.32-0.83,0.25-1.15,0.54c-0.15-0.05-0.28-0.09-0.45-0.14c-0.02,0.29,0,0.54-0.01,0.81c0.11,0.09,0.22,0.19,0.38,0.33c0.22,0,1.77,0.5,1.98,0.74c0.67-0.12,1.44,0.55,2.16,0.55c0.39,0.64,1.03,1.16,1.57,1.71c0,0.06,0,0.12,0,0.19c0.4,0.38-0.04,1.09-0.01,1.56c-0.41,0.3-0.65,0.84-1.24,0.8c-0.01,0.18-0.2,0.18-0.29,0.27c-0.82-0.26-1.72-0.46-2.58-0.46c-0.03-0.05-0.07-0.13-0.1-0.18c-0.57,0-2.02-0.43-2.26-1.1c-0.15,0-0.3,0-0.48,0c-0.03-0.05-0.07-0.12-0.11-0.17c-0.36-0.29-0.75-0.42-1.18-0.39c-0.07-0.07-0.12-0.12-0.18-0.18c-0.12,0-0.24,0-0.38,0c-0.02-0.05-0.04-0.1-0.05-0.15c-0.41-0.14-0.74-0.4-1.06-0.68c-0.29-0.04-0.55,0.07-0.76,0.33c-0.1-0.09-0.18-0.16-0.25-0.23c-0.4,0-0.8,0-1.18,0c-0.42,0.29-0.65,0.71-0.7,1.25c-0.67,0.31-0.39,0.09-0.27,1.2c-0.07,0.04-0.14,0.09-0.19,0.13c0,0.17,0,0.29,0,0.46c0.84,0.68,1,1.84,2.18,2.15c0.18,0.41,0.37,0.8,0.83,0.98c0.02-0.01,0.05-0.04,0.08-0.07c0.34,0.36,1.16,0.1,1.68,0.21c0.02,0.03,0.07,0.11,0.11,0.17c0.53-0.08,2.22,0.3,2.54-0.01c4.17,0,8.53-0.54,12.63-0.54c0.11,0.12,0.23,0.25,0.36,0.4c0.21-0.15,0.39-0.27,0.6-0.41c0.84,0.12,1.63,0.1,2.45-0.02c0.05,0.08,0.1,0.15,0.14,0.2c0.32,0,0.59,0,0.88,0c0.06-0.06,0.13-0.12,0.19-0.18c0.28,0,0.56,0,0.83,0c0.31,0.28,0.54,0.22,0.69-0.19c0.78,0,1.76-0.19,2.43-0.57c0.21,0.06,0.47,0.14,0.75,0.23c0.05-0.09,0.1-0.18,0.12-0.22c0.28,0,0.5,0,0.73,0c0.25-0.31,0.61-0.48,1.06-0.49c0.1,0.15,0.2,0.29,0.32,0.47c0,0-0.04,0.07-0.1,0.21c0.15-0.04,0.23-0.06,0.37-0.1c0.33,0.29,0.83,0.45,0.98,0.94c0.46,0.2,0.71,0.57,0.76,1.09c-1.48,1.41-1.96,3.41-4.51,3.41c-0.12,0.12-0.24,0.24-0.36,0.36c-0.43-0.02-0.83,0.33-1.31,0.13c-0.49,0.44-1.14,0.34-1.74,0.24c-0.06,0.06-0.12,0.12-0.18,0.18c-0.11,0-0.23,0-0.38,0c-0.05,0.06-0.1,0.14-0.14,0.19c-1.61,0-3.2,0.18-4.75,0.18c-0.05,0.06-0.1,0.14-0.14,0.19c-1.03,0.07-2.02-0.48-3.07-0.27c-0.16-0.18-0.38-0.03-0.53-0.1c-0.3,0.24-1.93,0.3-2.29,0.2c-1.84,1.17-6.3,0-8.53,0.21c-0.06-0.08-0.11-0.16-0.14-0.21c-0.86,0-2.53,0.11-3.34-0.28c-0.23,0.45-0.55,0.67-0.96,0.65c-1.37,2.51-2.44,5.11-4.19,7.48c0,0.37-0.55,0.43-0.66,0.79c-1.08,0.64-1.45,2.31-2.57,3.05c0,0.02-1.28,0.97-0.91,0.68c-0.06,0-0.15,0-0.24,0c-0.62,0.63-0.62,0.63-1.02,0.65c-0.07,0.08-0.15,0.15-0.23,0.23c0.02,0.02,0.04,0.04,0.07,0.08c-0.1,0.21-0.25,0.38-0.44,0.51c-0.02,0-0.11,0-0.24,0c-0.02,0.07-0.06,0.16-0.07,0.19c-0.21,0-0.33,0-0.43,0c-0.23,0.42-0.58,0.63-1.04,0.64c-0.68-0.35-1.98,0.48-2.7,0.48c-0.05-0.05-0.1-0.11-0.16-0.17c-0.45,0.1-0.83-0.04-1.14-0.42c-0.09-0.29-0.17-0.57-0.28-0.91c-2.21-0.86-0.39-2.01,0.95-2.01c0.03,0.05,0.08,0.13,0.12,0.19c0.37-0.06,0.54,0.2,0.79,0.34c0.31-0.16,1.21-0.37,1.57-0.34c0.53-0.97,1.98-0.67,1.98-1.89c0.43-0.41,0.27-0.45,1.29-0.82c0-0.05,0.01-0.11,0.01-0.21c0.44-0.07,0.38-0.61,0.73-0.85c0-0.06,0-0.16,0-0.22c0.15-0.11,0.26-0.2,0.37-0.28c0.01-0.32,0.58-1.35,0.91-1.48c0.03-0.23,0.13-0.43,0.35-0.54c-0.03-0.18,0.4-1.15,0.59-1.22c0-0.13,0-0.26,0-0.38c0.19-0.05,0.21-0.26,0.36-0.35c0.34-1.43,0.07-2.17-0.95-3.19c-0.27,0-0.54,0-0.84,0c-0.05-0.06-0.1-0.14-0.14-0.19c-0.95,0-2.96-1.04-3.73-0.19c-1.79,0-8.57,1.64-9.68,0.23c-1.69,0.89-3.53,0.79-5.41,0.69c-0.15,0.11-0.32,0.23-0.53,0.37c-0.85-0.1-1.2,0.18-1.81,0.18c-0.68,0.68-1.94-0.36-2.66,0.36c-0.73,0-1.46,0-2.23,0c-0.08-0.08-0.19-0.18-0.33-0.33c-0.16,0.33-0.42,0.5-0.75,0.62c-0.61-0.23-1.85-0.27-2.54-0.07c-0.01,0.02-0.06,0.1-0.09,0.15c-1.16,0.11-2.73,0.17-3.81-0.21c-0.71-0.24-1.31-1.24-2.08-1.28c-0.47-0.84-2.12-1.5-2.79-2.34c0-0.29,0-0.6,0-0.91c1.31-1.41,3.66-0.68,5.48-0.44c0.09,0.17,0.16,0.31,0.26,0.49c0.2-0.04,0.39-0.08,0.59-0.12c0.01-0.29,0.41-0.1,0.42-0.37c0.3,0.05,0.58,0.09,0.89,0.13c0.27,0.3,0.72,0.36,1.09,0.06c0.91,0,1.65,0.34,2.59,0.17c0.04,0.07,0.08,0.15,0.12,0.22c0.33-0.07,0.58-0.17,0.8-0.39c0.82,0,1.58-0.14,2.4-0.19c0.3,0.36,3.89-0.04,4.16-0.26c0.2,0.19,2.52-0.12,2.86-0.22c0.09-0.17,0.21-0.31,0.36-0.43c0.68,0.09,1.35,0.04,2-0.16c0.75,0,0.8-0.38,1.62-0.04c0.2-0.14,0.43-0.29,0.68-0.46c0.09,0.03,0.2,0.07,0.33,0.11c0.61-0.92-0.54-2.06-0.41-3.2c0.24-0.19,0.36-0.47,0.35-0.82c-0.66-0.7,0.06-1.35-0.54-2.03c0-0.24,0-0.49,0-0.73c0.07-0.07,0.12-0.12,0.19-0.19c-0.07-0.84,0.41-1.12-0.19-1.86c0-1.32,0.18-2.62,0.18-3.95c-0.06-0.06-0.11-0.11-0.18-0.18c0-0.12,0-0.25,0-0.37c-0.07-0.07-0.12-0.12-0.19-0.19c0.11-0.74,0-1.26-0.23-1.96c-0.02-0.01-0.07-0.03-0.13-0.05c0-0.12,0-0.24,0-0.36c-0.89-0.62-1.84-2.68-2.72-3.56c-0.73-0.03-0.99-0.58-1.32-1.09c-0.31-0.06-0.56-0.1-0.83-0.15c-0.15-0.43-0.43-0.68-0.85-0.74c0.13-0.62-0.83-1.07-0.83-1.82c-0.65-0.42-0.97-1-0.96-1.73c-0.05-0.03-0.13-0.08-0.24-0.15c0-0.08,0-0.18,0-0.29c-0.06-0.01-0.1-0.02-0.16-0.03c0.07-0.26-0.33-0.38-0.19-0.67c-0.07-0.07-0.12-0.12-0.19-0.19c0-0.11,0-0.23,0-0.38c-0.05-0.03-0.12-0.06-0.17-0.09c0-0.15,0-0.25,0-0.34c-0.08-0.08-0.14-0.15-0.21-0.22c0.1-0.54-0.23-0.91-0.55-1.29c0-0.36,0-0.73,0-1.1c-0.5-0.58-0.7-1.65-0.74-2.41c-0.06-0.03-0.14-0.08-0.18-0.1c0-1.09,0.37-2.12,0.37-3.3c0.24-0.24,0.17-0.53,0.19-0.84c0.05-0.04,0.13-0.09,0.2-0.15c-0.22-0.78,1.09-1.88,1.58-2.47c0.08,0,0.14,0,0.22,0c1.05-1.73,1.66-3.08,3.42-4.3c0-0.09,0-0.22,0-0.36c0.14-0.17,0.26-0.33,0.37-0.46c0.24-0.06,0.43-0.1,0.63-0.15c0.02-0.05,0.04-0.11,0.06-0.16c0.1,0,0.19,0,0.28,0c0.31-0.28,1.08-0.9,1.2-1.29c1.12-0.1,3-2.96,3.68-3.69c0.2,0.07,0.38-0.25,0.57,0c0.05-0.05,0.09-0.09,0.14-0.14c0-0.15,0-0.3,0-0.49c0.42-0.13,0.86-0.23,1.29-0.29c-0.08-0.21-0.33,0.04-0.37-0.19C34.41,12.67,34.78,12.67,35.15,12.67z M39.58,52.99c-0.44-0.16-0.61-0.13-1.03,0.08c-0.64-0.46-1.64-0.19-2.36-0.19c-0.12,0.11-0.24,0.22-0.39,0.35c-0.2-0.04-0.33,0.34-0.59,0.19c-0.65,0.67-1.16,1.9-1.17,2.83c-0.07,0.07-0.12,0.12-0.21,0.21c0.16,0.52-0.22,1.01-0.17,1.55c-0.56,0.48-0.1,2.34-0.43,2.99c0.16,0.76,0.27,1.15,0.71,1.83c0.54,0.04,0.94,0.2,1.48,0.2c0.04,0.06,0.09,0.13,0.12,0.17c0.21,0.06,0.29-0.07,0.39-0.17c0.09,0,0.18,0,0.27,0c0.07-0.06,0.13-0.13,0.19-0.18c0.7,0,1.4,0.03,2.09,0.09c0.63-0.8,5.23-0.33,5.9-0.22c0.16-0.22,0.36-0.48,0.55-0.74c-0.02-0.43,0.04-0.84,0.18-1.25c0.1-0.11,0.17-0.19,0.25-0.28c0.04,0,0.1,0,0.19,0c0.05-0.17,0.1-0.35,0.15-0.52c1.98-0.78,1.06-1.47,2.18-2.48c0-0.53-0.18-0.97-0.18-1.48c-0.06-0.06-0.12-0.12-0.19-0.19c0-0.21,0-0.44,0-0.65c-0.07-0.07-0.12-0.12-0.18-0.18c0.13-0.47,0.01-0.86-0.34-1.18c-0.05-0.15-0.11-0.3-0.14-0.4c-0.16-0.06-0.26-0.09-0.39-0.14c-0.46,0.42-1.34,0.27-1.9,0.6c0,0.03,0,0.06,0,0.09c-0.5,0.18-0.89,0.6-1.38,0.61c-1.31,1.06-3.39,3.45-5.08,2.65c0-0.25,0-0.47,0-0.68c0.73-0.45,1.02-2.22,1.84-2.39c0-0.06,0-0.12,0-0.18c0.15-0.09,0.15-0.09,0.27-0.32C40,53.41,39.8,53.21,39.58,52.99z M39.03,48.79c0.79,0.22,0.88,0.17,1.71-0.15c0.28,0.12,0.56,0.24,0.83,0.36c0.17-0.12,0.34-0.21,0.55-0.17c0.12-0.21,0.36-0.18,0.48-0.25c0.36,0.07,1.43,0.35,1.78,0.25c0.66,0.35,1.2,0.22,1.65-0.38c0.14,0,0.29,0,0.43,0c0.36-0.3,1.25-0.37,1.25-0.98c0.04-0.01,0.09-0.02,0.13-0.03c0.35-0.87,0.14-1.64,0.32-2.53c-1.85-1.99-4.15,0.39-5.68,1.7c-0.56,0.07-1.1,0.02-1.62-0.16c-0.24,0.03-0.34-0.21-0.47-0.25c-1.08-1.96,0.22-5.21,0.22-7.41c-0.53-0.31-2.02-1.59-2.73-0.85c-0.42-0.07-0.76,0.07-1.04,0.44c0.01,0.07-0.13,0.16-0.03,0.25c-0.23,0.51-0.39,0.97-0.79,1.37c0.06,0.5,0.07,2.15,0.45,2.5c0,0.13,0,0.25,0,0.37c0.2,0.18,0.19,0.42,0.18,0.7c0.06,0.04,0.14,0.08,0.19,0.11c0,0.96,0.18,1.82,0.18,2.78c0.55,0.55,0.68,1.19,0.87,1.91C38.13,48.46,38.83,48.58,39.03,48.79z M49.4,38.13c0.21-0.2,0.37-0.4,0.3-0.75c-0.19-0.13-0.4-0.28-0.63-0.44c0-0.03,0-0.09,0-0.15c-0.59-0.36-2.16,0.06-2.84-0.05c-0.16,0.23-0.3,0.44-0.43,0.62c-0.22,0.05-0.41,0.1-0.55,0.14c-0.42,0.9,0.44,1.1,0.91,1.74c0.43,0,0.71,0.18,1.13,0.16c0.17-0.36,0.79-0.42,0.91-0.74c0.21,0.04,0.39,0.08,0.57,0.12C48.81,38.27,49.02,38.05,49.4,38.13z"/><path class="inline-svg--fill-only" d="M315.51,43.75c-0.53,1.26-1.82,1.23-2.99,1.1c-0.08,0.1-0.16,0.19-0.21,0.26c-0.2,0.04-0.56,0.07-0.61,0.05c-0.6,0.31-1.69-0.28-2.14,0.07c-0.21-0.05-0.42-0.1-0.63-0.17c-0.21,0.08-0.43,0.11-0.66,0.08c-0.73,0.83-2.2-0.42-2.89,0.2c-0.19-0.14-0.35-0.27-0.52-0.39c-0.13,0-0.25,0-0.38,0c-0.22,0.31-0.53,0.5-0.92,0.56c-0.38-0.28-0.8-0.59-1.26-0.93c-0.07,0.02-0.2,0.06-0.34,0.11c0.07,1.05-1.88,0.18-2.35,0.64c-0.27-0.01-1.16-0.02-1.38-0.37c-0.43,0-0.88,0-1.32,0c-0.06,0.06-0.11,0.11-0.17,0.17c-2.61,0-5.81,0.47-8.4,0.18c-0.05-0.05-0.1-0.1-0.18-0.18c-0.88,0.14-1.87,0-2.76,0c-0.06,0.06-0.13,0.12-0.2,0.19c-0.46,0-0.92,0-1.38,0c-0.6,0.66-4.27,0.18-4.98,0.18c-0.07,0.07-0.12,0.12-0.18,0.18c-1.21,0-7.31-0.51-8.11,0.37c-0.24,0-0.49,0-0.74,0c-0.05,0.05-0.1,0.11-0.15,0.18c-0.13,0-0.27,0-0.38,0c-0.25,0.21-0.48,0.4-0.7,0.58c0,0.45,0,0.88,0,1.32c0.06,0.06,0.12,0.13,0.18,0.19c0,0.06,0,0.12,0,0.17c0.78,0.29,2.89,0.5,3.48,1.09c0.25-0.05,0.52-0.1,0.86-0.17c0.16,0.1,0.39,0.25,0.62,0.39c0,0,0.02-0.02,0.02-0.02c0.09,0.09,0.18,0.18,0.23,0.23c0.21,0,0.33,0,0.47,0c0.22-0.16,0.35-0.37,0.41-0.63c0.14,0,0.24,0,0.34,0c0.11,0.15,0.22,0.3,0.33,0.46c0.48-0.15,0.68-0.08,1.11,0.1c0.74-0.7,3.94-0.12,5.04-0.11c1.86,0.02,3.75,0.41,5.63,0.19c0.51,0.38,1.78-0.14,2.28,0.28c0.21,0,0.42,0,0.64,0c0.33-0.15,0.68-0.24,1.04-0.28c0.62,0.49,1.76-0.11,2.39,0.47c0.75-0.33,1.5-0.01,2.29-0.01c0.84-0.92,2.48,0.32,3.28,0.18c1.21,0.84,1.56,0.93,1.56,2.38c-0.13,0.09-0.27,0.2-0.41,0.3c-0.13,0-0.25,0-0.39,0c-0.39,0.59-0.97,0.21-1.37,0.65c-2.2,0-5.36-0.65-7.33-0.36c-0.09,0.1-0.2,0.25-0.3,0.37c-0.66-0.06-2.83-0.13-3.3-0.37c-0.51,0.1-1.28-0.43-1.69-0.01c-0.11,0-0.23,0-0.38,0c-0.07-0.08-0.16-0.19-0.22-0.27c-2.32,0-1.53,3.97-2.03,5.35c0.17,0.27,0.05,0.58,0.09,0.87c-1.49,1.49,0.36,4.98-1.1,6.56c0,0.1,0,0.22,0,0.37c-0.06,0.04-0.14,0.1-0.19,0.13c-0.02,0.43-0.19,0.76-0.19,1.17c-0.04,0.01-0.09,0.03-0.13,0.04c-0.18,0.21-0.26,0.45-0.25,0.71c-0.05,0.01-0.1,0.02-0.16,0.04c0,0.1,0,0.2,0,0.31c-0.07,0.02-0.12,0.04-0.17,0.06c-0.04,0.27-0.21,0.47-0.39,0.68c0,0.07,0,0.17,0,0.26c-0.06,0.07-0.13,0.13-0.19,0.2c0,0.15,0,0.31,0,0.47c-0.04,0.01-0.08,0.03-0.13,0.05c-1.29,2.45-1.06,5.01-3.05,7c-0.49,0.03-0.78-0.31-1.11-0.65c-0.62-0.08-1.1,0.13-1.45,0.64c-0.42-0.05-0.8,0.06-1.16,0.31c-0.16-0.1-0.33-0.21-0.48-0.31c0-0.28,0-0.52,0-0.79c0.05-0.04,0.1-0.09,0.14-0.12c0.05-0.24,0.19-1.42,0.41-1.62c0-0.49,0.15-0.83,0.2-1.31c0.04-0.04,0.1-0.1,0.16-0.16c0-0.14,0-0.29,0-0.47c0.06-0.04,0.14-0.1,0.21-0.15c-0.16-0.56,0.31-1.12,0.63-1.48c0-0.54-0.09-1.06-0.09-1.6c0.04-0.01,0.08-0.03,0.13-0.05c0.33-0.8,0.23-1.57,0.23-2.44c0.05-0.03,0.12-0.07,0.17-0.1c0.07-0.51,0.14-0.99,0.21-1.47c0.05-0.02,0.1-0.04,0.16-0.06c0.32-2.76,0.94-5.61,0.94-8.31c0.36-0.31,0.4-0.75,0.11-1.31c-0.02-0.27,0.07-0.49,0.26-0.64c0-0.65,0-1.29,0-1.94c-0.06-0.06-0.11-0.11-0.18-0.18c0-0.12,0-0.25,0-0.37c-0.27-0.2-0.56-0.11-0.84-0.14c-0.34,0.39-0.76,0.52-1.27,0.37c-0.08,0.38-0.3,0.67-0.65,0.85c0,0.9-0.74,0.96,0.01,1.91c0.07,0.53-0.04,1.01-0.32,1.43c0.68,1.38-0.07,3.31-0.07,4.81c-0.06,0.04-0.13,0.1-0.18,0.14c0,0.16,0,0.28,0,0.4c-0.34,0.38-0.36,0.79-0.08,1.21c-0.04,0.32-0.08,0.66-0.13,1.02c-0.4,0.31-0.78,0.65-1.12,1.03c-0.07,0.01-0.14,0.02-0.22,0.02c-0.05,0.26-0.09,0.52-0.14,0.76c-0.07,0.06-0.13,0.12-0.25,0.22c-0.69,0.26-1.26,0.17-1.73-0.27c-0.05-0.32-0.33-0.58-0.18-0.98c-0.22-0.14-0.39-0.32-0.5-0.56c0.04-0.2,0.08-0.36,0.11-0.51c-0.08-0.08-0.14-0.14-0.19-0.19c-0.02-0.37-0.04-0.74,0.2-1.07c-0.04-0.06-0.07-0.11-0.1-0.14c0.03-0.05,0.06-0.1,0.09-0.14c-0.17-0.14-0.33-0.27-0.47-0.39c-0.01-0.3-0.01-0.3-0.3-0.79c0.04-0.29,0.08-0.63,0.11-0.91c-0.1-0.13-0.17-0.22-0.25-0.32c-0.06,0.03-0.1,0.05-0.16,0.08c-1.01-0.51-2.13-0.73-2.98-1.36c-0.69,0.19-1.18-0.35-1.61-0.73c-0.22,0-0.41,0-0.59,0c-0.05-0.05-0.11-0.11-0.17-0.17c-0.44,0-1.06-0.23-1.38-0.55c-1.1,0-1.53-0.93-2.42-1.29c-0.12-0.38-0.24-0.73,0.05-1.07c0-0.15,0-0.3,0-0.47c0.05-0.04,0.11-0.09,0.17-0.14c0-0.48,0.39-0.76,0.39-1.26c0.06-0.01,0.1-0.03,0.16-0.04c0-0.13,0-0.26,0-0.39c0.07-0.07,0.13-0.12,0.19-0.18c0-0.16,0-0.32,0-0.45c0.44-0.53,1.02-2.55,0.93-3.16c0.59-0.65,0.38-1.92,0.16-2.7c-0.67-0.44-2.1-0.74-2.6-1.22c-0.46,0-0.93,0-1.38,0c-0.06,0.06-0.11,0.11-0.17,0.17c-0.27,0-0.54,0-0.84,0c-0.04,0.06-0.1,0.14-0.13,0.19c-0.26,0-0.47,0-0.69,0c-0.34,0.68-1.31,1.25-1.14,2.18c0.24,0.21,0.15,0.54,0.17,0.86c0.84,0.32,0.92,1.28,0.92,1.99c-0.06,0.06-0.11,0.11-0.18,0.18c0.01,0.22,0.02,0.46-0.18,0.64c0,0.15,0,0.3,0,0.46c-0.06,0.07-0.13,0.13-0.19,0.2c0,0.08,0,0.16,0,0.27c-0.23,0.26-0.47,0.54-0.74,0.87c-0.02,0.29,0.07,0.53,0.28,0.71c0,0.08,0,0.17,0,0.28c-0.43,0.33-1.16,1.53-1.63,1.7c-0.04,0.39-0.09,0.76-0.13,1.17c-0.32,0.22-0.69,0.48-0.54,0.94c-0.51,0.93-0.71,2.86-1.65,3.44c0,0.81-0.53,4.77-1.09,5.36c-0.02,0.55,0.17,1.7-0.21,2.15c0,0.36,0,0.73,0,1.1c0.01,0,0.03-0.01,0.04-0.01c0.18,0.55,1.33,2.06,2.15,1.9c0.01,0.06,0.03,0.1,0.04,0.16c0.21,0.07,0.4,0.28,0.68,0.22c0.07,0.17,0.14,0.34,0.37,0.27c0.16,0.16,0.31,0.31,0.47,0.47c0.02-0.02,0.04-0.04,0.06-0.06c0.53,0.07,1.53,0.88,1.36,1.58c0.07,0.07,0.13,0.13,0.18,0.18c-0.11,0.46-0.18,0.93-0.19,1.4c-0.04,0.04-0.1,0.1-0.16,0.16c0,0.14,0,0.29,0,0.41c-0.21,0.21-0.41,0.41-0.64,0.64c-0.01,0-0.08,0-0.18,0c-0.19,0.46-0.5,0.82-0.97,1.03c-0.19-0.08-0.38,0.26-0.55,0.02c-0.43,0.12-0.83,0.3-1.21,0.53c-0.06-0.06-0.11-0.11-0.19-0.19c-0.83,0-1.62-0.02-2.41,0.01c-0.05,0.05-0.11,0.11-0.15,0.15c-0.28-0.18-0.56-0.35-0.85-0.54c-0.25,0.04-0.53-0.08-0.77,0.09c-1.04-0.23-2.41-0.53-3.33-1.06c-0.04-0.11-0.08-0.25-0.14-0.42c-0.26-0.04-0.55-0.08-0.87-0.12c-0.09-0.09-0.21-0.21-0.33-0.33c-0.09,0-0.18,0-0.29,0c-0.02-0.05-0.04-0.1-0.06-0.17c-0.1,0-0.2,0-0.24,0c-0.18-0.16-0.31-0.28-0.46-0.41c0-0.73-0.26-0.85-0.97-0.78c-0.1-0.12-0.2-0.23-0.34-0.39c0-0.21-0.19-2.71,0.53-2.69c0.13-0.21,0.18-0.43,0.01-0.63c0.03-0.3,0.25-0.45,0.42-0.63c0.09,0,0.18,0,0.27,0c0.08-0.17,0.16-0.34,0.26-0.53c0.34-0.15,0.7-0.31,1.06-0.47c0.25-0.86,0.21-1.02,0.95-1.62c-0.17-0.82,1.1-1.77,1.31-2.62c0.04-0.01,0.08-0.02,0.14-0.04c0-0.07,0-0.14,0-0.2c0.07-0.07,0.13-0.12,0.2-0.2c-0.24-1,1.16-2.46,1.84-3.01c0-0.12,0-0.22,0-0.28c0.16-0.26,0.36-0.38,0.63-0.36c0.16-0.69,0.7-1.09,0.9-1.75c0.19-0.05,0.04-0.37,0.29-0.38c0.04-0.31,1.67-2.48,1.72-2.59c-0.02-0.02-0.04-0.03-0.06-0.05c0.17-0.15,0.34-0.3,0.53-0.46c-0.04-0.07-0.08-0.12-0.11-0.17c0.4-0.78,1.06-1.45,1.1-2.37c1.2-1.13-0.4-1.38-1.07-2.11c-0.34,0.15-1.11-0.66-1.2-0.73c-0.34,0-0.68,0-1.01,0c-0.06-0.06-0.11-0.11-0.18-0.18c-0.12,0-0.25,0-0.39,0c-0.01-0.06-0.02-0.1-0.03-0.16c-0.09,0-0.19,0-0.31,0c-0.02-0.06-0.04-0.12-0.06-0.18c-0.72-0.14-2.56-1.25-2.56-2.02c-0.05-0.02-0.1-0.04-0.17-0.06c0-0.1,0-0.2,0-0.25c-0.21-0.26-0.39-0.48-0.56-0.7c-0.04-0.94,0.3-1.22,0.82-1.36c0.6-1.37,2.08-0.49,2.88-0.08c0.41-0.09,0.82-0.09,1.24,0c0.16-0.3,0.4-0.45,0.74-0.45c0.2-0.46-0.21-0.74-0.15-1.23c-0.49-0.68-0.12-1.01,0.03-1.61c0.06-0.01,1.13-0.86,1.04-0.76c0.65,0.15,2.13,0.05,2.58,0.56c0.25,0,0.49,0,0.74,0c0.23,0.27,0.55,0.16,0.84,0.19c0.06,0.06,0.11,0.11,0.18,0.18c0.39-0.05,0.83,0.13,1.2-0.19c1.47,0,5.59-0.3,6.91,0.37c0.97-0.97,4.2-0.18,5.44-0.37c0.01-0.2,0.27-0.17,0.33-0.35c0.47,0,0.93,0,1.43,0c0.04-0.06,0.08-0.14,0.1-0.17c0.39-0.13,0.78-0.14,1.17-0.04c0.58-0.47,3.68-0.5,4.28-0.08c2.4-0.75,5.87,1.18,8.15,0c0.62,0.36,3.16-0.09,3.93-0.09c0.01-0.1,0.01-0.2,0.02-0.31c0.12-0.09,0.25-0.17,0.37-0.26c0.32,0.06,0.44,0.36,0.71,0.47c1.68-0.55,3.69-0.09,5.43-0.09c0.04-0.05,0.08-0.11,0.13-0.17c0.14,0,0.28,0,0.43,0c0.3,0.33,2.15,0.37,2.6,0.56c1.24-0.7,6.43,0.45,7.17-0.57c0.22,0.35,1.08-0.03,1.47,0.36c0.45-0.13,0.9-0.26,1.35-0.36c1.02-0.78,3.33,0.56,4.19-0.37c0.67,0,1.23-0.18,1.94-0.18c0.19-0.25,0.46-0.35,0.82-0.3c0.42,0.46,0.83,0.39,1.26,0.85C315.32,42.58,315.51,43.15,315.51,43.75z"/><path class="inline-svg--fill-only" d="M285.36,24.32c-0.05,0.05-0.1,0.1-0.15,0.16c-0.19,0-0.37,0-0.55,0c-0.05,0.05-0.11,0.11-0.18,0.18c-0.3-0.02-0.64,0.08-0.92-0.19c-0.47,0.08-0.9-0.01-1.3-0.27c-0.03,0.06-0.07,0.14-0.1,0.19c-0.56-0.08-1.08-0.08-1.53-0.42c-0.92,0.45-1.1-0.01-1.92-0.27c-0.65,0.55-4.13,0.45-4.75-0.17c-0.12,0.39-0.38,0.69-0.79,0.9c0.1,0.23,0.14,0.47,0.11,0.72c-0.06,0.06-0.11,0.11-0.19,0.19c0.01,0.22,0.02,0.46-0.18,0.64c0,0.72-0.4,1.21-0.37,1.95c0.09,0.07,0.2,0.15,0.27,0.2c0,0.7,1.07,0.94,1.62,0.94c0.04,0.05,0.09,0.11,0.14,0.18c0.17,0,0.34,0,0.49,0c0.07,0.07,0.12,0.12,0.19,0.19c0.54,0.04,1.36,0.02,1.86,0.27c0.81-0.76,2.72,0.54,3.5-0.27c0.55,0.09,2.17-0.31,2.59,0c0.47,0,1.82-0.02,2.21-0.31c0.16,0.1,0.31,0.19,0.49,0.31c0.32-0.04,0.7,0.1,1.06-0.17c0.37,0.2,0.73,0.41,1.07,0.65c-0.23,0.64-0.91,2.27-1.83,2.19c-0.08,0.14-0.16,0.29-0.25,0.46c-0.08,0-0.19,0-0.28,0c-0.06-0.06-0.11-0.11-0.17-0.17c-0.46-0.01-0.46-0.01-0.84,0.36c-0.66-0.02-1.31,0.01-1.97,0.09c-0.53,0.17-1.04,0.11-1.53-0.17c-0.84,0.67-2.67-0.12-3.66,0.17c-0.86-0.66-3.96,0.34-4.75,0.83c-0.22,0.9,0.04,2.07,0.71,2.73c-0.07,0.51,0.11,0.92,0.53,1.25c0.04-0.02,0.09-0.05,0.12-0.06c1.24,0.23,2.24,0.7,3.53,0.52c0.12-0.13,0.23-0.25,0.35-0.37c0.13,0,0.25,0,0.39,0c0.1,0.11,0.21,0.23,0.31,0.35c0.14,0,0.24,0,0.36,0c0.13-0.26,0.34-0.44,0.61-0.54c0.29,0,0.57,0,0.84,0c0.06,0.06,0.11,0.11,0.18,0.18c0.09,0,0.19,0.01,0.29,0.01c0.06,0.06,0.12,0.12,0.18,0.18c2.1,0,5.67-0.68,7.05,1.19c0,0.29,0,0.64,0,0.98c-0.44,0.31-0.88,0.53-1.36,0.78c-0.26-0.1-0.58-0.13-0.8-0.36c-0.09,0-0.18,0-0.3,0c-0.88,1.35-7.68,0.37-9.57,0.37c-0.06-0.06-0.11-0.11-0.18-0.18c-0.95,0-1.8-0.15-2.77-0.19c-0.18-0.18-0.35-0.35-0.54-0.54c-1.48,0-3.06,0.97-4.54,1.1c-0.09,0.09-0.17,0.17-0.29,0.29c-0.5-0.09-1.03-0.19-1.52-0.27c-1.07-1.68-0.54-3.76-1.73-5.36c0-0.46-0.08-2.4,0.37-2.63c0-0.79-0.25-3.13,0.27-3.71c-0.16-0.75,0.13-1.87,0.65-2.4c-0.14-0.43-0.05-0.78,0.25-1.07c0.03,0.01,0.08,0.02,0.19,0.05c0.11-0.06,0.24-0.08,0.37-0.05c0.05-0.26-0.06-0.57,0.2-0.78c-0.02-0.02-0.04-0.05-0.07-0.08c0.16-0.25,0.38-0.5,0.35-0.84c0.13-0.11,0.27-0.21,0.4-0.32c0.06,0.03,0.12,0.07,0.21,0.12c0.13-0.23,0.24-0.45,0.37-0.69c0.13,0.03,0.28,0.07,0.43,0.11c1.79-2.19,1.16-4.35,4.72-3.04c0.18,0.42,0.23,0.83,0.84,0.72c0.1-0.11,0.22-0.23,0.34-0.36c0.29,0.02,0.6-0.07,0.85,0.2c0.37-0.05,0.77,0.08,1.15-0.1c1.09,0.79,2.34-0.11,3.64-0.09c0.15,0.15,0.3,0.3,0.46,0.46c0.31,0.06,0.58-0.04,0.8-0.3c0.19,0.12,0.45,0.08,0.58,0.3c0.13,0,0.25,0,0.37,0c0.05-0.08,0.1-0.17,0.16-0.28c0.66,0,2.07,0.27,2.8,0.18c0.04,0.07,0.09,0.15,0.11,0.18c1.69,0.2,4.03,0.2,5.6,0.2c0.05,0.05,0.11,0.11,0.18,0.18c0.12,0,0.25,0,0.36,0c0.17,0.13,1.19,0.9,1.49,0.93c0.62,0.66,1.45,1.08,1.98,1.82c-0.2,0.82,1.14,1.49,0.93,2.33c0.74,1.41-0.62,2.66-0.21,3.94c-0.3,0.24-0.71,2.82-0.71,3.02c-0.06,0.06-0.11,0.11-0.18,0.18c0,0.12,0,0.25,0,0.37c-0.07,0.07-0.12,0.12-0.18,0.18c0,0.12,0,0.24,0,0.38c-0.05,0.05-0.11,0.09-0.17,0.14c0,0.41-0.44,0.62-0.38,1.04c-0.16,0.3-0.36,0.57-0.61,0.81c-0.12-0.02-0.23-0.04-0.4-0.07c-0.34,0.18-0.54,0.85-0.78,1.16c-0.11,0-0.2,0-0.32,0c-0.1,0.21-0.7,0.74-0.77,0.92c-0.24,0.03-0.47,0-0.69-0.09c-0.47,0.22-0.47,0.22-0.83,0.09c-0.03-0.13-0.1-0.24-0.22-0.31c0-0.27,0-0.55,0-0.84c-0.05-0.05-0.11-0.09-0.17-0.15c-0.08-0.47,0.09-0.87,0.52-1.18c-0.04-0.19,0.3-0.31,0.21-0.58c0.37-0.16,0.24-0.97,0.54-1.21c-0.04-0.24,0.27-0.35,0.21-0.59c0.06-0.02,0.1-0.03,0.14-0.04c0.16-0.45,0.28-0.9,0.21-1.33c0.26-0.5,1.01-1.75,0.39-2.26c0-0.11,0-0.21,0-0.37c0.22-0.16,0.47-0.33,0.72-0.51c-0.1-0.34-0.21-0.68-0.54-0.89c0-0.2,0-0.39,0-0.56c0.74-0.84-0.47-2.43-1.32-2.96c-0.05,0.05-0.09,0.08-0.1,0.09c-0.4-0.2-0.87-0.25-1.22-0.54C287.78,24.84,286.5,24.09,285.36,24.32z"/><path class="inline-svg--fill-only" d="M310.34,65.08c-0.03,1.1,0.15,2.9-0.54,3.82c0.44,1.66-1.38,2.77-1.3,4.35c-0.4,0.24-0.59,0.55-0.56,0.93c-0.23,0.11-0.28,0.4-0.52,0.5c0,0.05-0.43,0.77-0.64,0.73c-0.06,0.16-0.11,0.32-0.19,0.54c-0.16,0.1-0.25,0.38-0.49,0.5c0,0.06,0,0.12,0,0.23c-0.11-0.03-0.21-0.06-0.32-0.09c-0.5,0.76-1.25,1.71-2.13,2.11c-0.02-0.02-0.05-0.05-0.11-0.1c-0.13,0.12-0.28,0.2-0.45,0.23c-0.13,0.59-0.6,0.89-1.11,1.15c0,0-0.03-0.03-0.07-0.07c0.01-0.01-0.87,0.55-0.89,0.64c-0.91,0.02-1.58,0.36-2.47,0.15c-0.01-0.04-0.02-0.08-0.03-0.12c-0.58-0.2-1.18-0.21-1.79-0.21c-0.02-0.05-0.03-0.11-0.05-0.17c-0.7-0.24-0.93-0.39-1.74-0.39c-0.12-0.14-0.27-0.31-0.41-0.48c-0.83,0.52-4.72-1.37-5.72-1.56c-0.23-0.37-0.97-0.61-1.28-0.96c0.04-0.25,0.08-0.51,0.12-0.76c0.3-0.31,0.62-0.59,0.96-0.85c0.2,0,1.54,0.24,1.85,0.18c0.09,0.09,0.18,0.18,0.28,0.28c1.27-0.12,2.75,0.67,3.76-0.37c0.19,0,0.37,0,0.59,0c0.76-1.43,2.19-2.35,2.34-4.12c0.59-0.43,0.02-1.51,0.53-2c0-0.51,0.19-0.75,0.22-1.24c0.05-0.05,0.11-0.11,0.16-0.16c0-1.16,0.25-2.46,0.18-3.6c0.06-0.05,0.13-0.11,0.19-0.15c0-0.28,0-0.52,0-0.77c0.05-0.05,0.11-0.11,0.17-0.17c0-0.17,0-0.35,0-0.57c0.06-0.04,0.14-0.09,0.19-0.12c0-1.62,1.66-3.39,1.66-5.31c0.19-0.18,0.37-0.37,0.55-0.55c-0.02-0.34,0.14-0.6,0.36-0.84c0-0.11,0-0.23,0-0.33c0.56-0.75,1.46-1.07,2.13-1.71c-0.31-0.78,0.91-3.68,1.99-2.61c0.27-0.14,0.4,0.24,0.66,0.19c0.02,0.06,0.03,0.1,0.04,0.16c0.1,0,0.2,0,0.26,0c0.79,0.58,1.65,0.99,1.77,2.03c0.05,0,0.12,0.01,0.18,0.02c0.23,0.23,0.46,0.46,0.72,0.72c0,0.17,0,0.38,0,0.62c0.06,0.04,0.14,0.09,0.18,0.11c0.15,1.39,0.31,2.2-0.16,3.53c0.27,0.42,0.15,0.94,0.19,1.43c0.06,0.02,0.11,0.05,0.13,0.05c0.09,0.43,0.17,0.85,0.25,1.26c0.05,0.01,0.09,0.02,0.13,0.04c0.3,0.82,0.03,1.66,0.03,2.51c-0.17,0.18-0.31,0.36-0.28,0.65c0.09,0.07,0.2,0.15,0.31,0.23c-0.03,0.02-0.05,0.04-0.08,0.06C310.19,64.78,310.25,64.91,310.34,65.08z"/><path class="inline-svg--fill-only" d="M240.02,30.01c0.05,0.05,0.1,0.11,0.16,0.18c0.49-0.04,0.92,0.3,1.39,0.18c0.08,0.08,0.14,0.14,0.19,0.19c2.5,0,5.19,1.41,7.84,1.02c0.72,0.43,1.47,0.02,1.69,1.19c0.5-0.02,0.8,0.28,1.07,0.66c0.48,0.09,0.93,0.27,1.35,0.51c0.01,0.03,0.01,0.07,0.03,0.12c0.11,0,0.21,0.01,0.33,0.01c0.01,0.05,0.02,0.09,0.03,0.14c0.49,0.12,0.88,0.35,1.28,0.66c0,0.07,0,0.16,0,0.26c0.12,0.12,0.24,0.24,0.38,0.38c-0.03,0.12-0.05,0.26-0.09,0.45c0.88,1.35-0.09,1.08-0.88,1.98c-2.65,0-4.99,1.83-7.76,0.96c-0.11,0.05-0.25,0.11-0.38,0.17c-0.34-0.26-0.76-0.32-1.08-0.57c-0.12,0-0.24,0-0.36,0c-0.07-0.06-0.13-0.13-0.2-0.19c-2.42,0-7.54,0.34-9.7-1.16c-0.28-1.46-2.86-2.19-2.69-3.99c-0.1-0.01-0.17-0.02-0.26-0.02c0.03-0.06,0.05-0.12,0.1-0.22c-0.06-0.02-0.14-0.04-0.22-0.06c0.02-0.02,0.05-0.05,0.07-0.07c-0.18,0-0.37,0-0.59,0c-0.42-0.65-1.02-1.27-1.02-2.07c-0.07-0.07-0.12-0.12-0.19-0.19c-0.05-0.92-0.19-1.71-0.19-2.7c0.7-0.77,1.53-1.32,2.25-2.05c0.76,0,1.38,0.69,1.74,1.34c0.56,0.19,0.92,0.24,1.43,0.53c0.07,0.18,0.16,0.38,0.24,0.59c0.41,0.04,1.55,1,1.71,1.12c0.03,0.18,0.08,0.45,0.13,0.74c0.12,0,0.25,0,0.36,0c0.12-0.19,0.24-0.38,0.37-0.58C239.01,29.73,239.5,29.9,240.02,30.01z"/><path class="inline-svg--fill-only" d="M173.83,60.86c0.07-0.07,0.11-0.11,0.17-0.17c0-0.77-0.35-1.26-0.35-2.05c-0.24-0.09-0.13-0.42-0.36-0.53c0.03-0.13-0.57-1.17-0.57-1.16c-0.12,0-0.22,0-0.35,0c0-0.53-0.37-0.37-0.62-0.75c-0.28,0.07-0.57-0.39-0.74-0.55c-0.09,0-0.18,0-0.27,0c-0.1-0.23-0.36-0.28-0.47-0.47c-1,0.4-1.66-0.45-2.59-0.45c-0.05-0.06-0.11-0.13-0.15-0.19c-0.18,0-0.34,0-0.49,0c-0.05-0.05-0.11-0.11-0.18-0.18c-1.17,0-2.26-0.33-3.41-0.37c-0.06-0.06-0.11-0.11-0.19-0.19c-0.92,0.07-3.19,0-3.87-0.73c-0.42,0-0.85,0-1.28,0c-0.89-0.76-2.23-0.47-3.24-0.37c-0.28-0.31-1.53-0.25-1.78,0.02c-0.67-0.25-2.36,0.07-2.94,0.37c-0.39-0.33-0.69-0.34-0.9-0.03c-1.2,0.19-2.8,0.15-3.2-1.28c0.55-0.87,0.99-1.48,1.72-2.22c0.93-0.13,1.52-0.77,2.49-0.73c0.56,0.7,3.84-0.72,4.85,0.09c1.28-0.25,2.66,0.09,3.97,0.09c0.18,0.13,0.33,0.25,0.48,0.37c0.83,0,1.64,0.37,2.5,0.37c0.07,0.07,0.12,0.12,0.18,0.18c0.15,0,0.3,0,0.48,0c0.02,0.05,0.03,0.1,0.05,0.17c0.1,0,0.2,0,0.29,0c0.07,0.07,0.12,0.13,0.2,0.2c0.26-0.01,1.74,0.2,1.95,0.37c1.21,0,2.27,0.37,3.4,0.37c0.44,0.13,0.89,0.27,1.32,0.42c0,0.01,0.01,0.06,0.03,0.12c0.16,0,0.32,0,0.48,0c0.06,0.07,0.11,0.13,0.17,0.19c1.22,0,3.81,1.65,4.87,2.48c-0.31,0.68,1.66,1.05,1.26,1.83c0.07,0.02,0.11,0.03,0.15,0.04c0.2,0.23,0.28,0.5,0.23,0.79c0.05,0.02,0.1,0.03,0.17,0.06c0,0.13,0,0.26,0,0.4c0.56,0.36,0.81,0.82,0.75,1.37c0.3,0.3,0.27,0.63,0.18,1.02c-0.17,0.07-0.36,0.15-0.53,0.23c0,0.17,0,0.3,0,0.43c0.06,0.06,0.12,0.12,0.18,0.18c0,1.06,0.1,2.91-1.3,2.91c0.26,0.4,0.19,1.17,0.19,1.61c-0.05,0.05-0.11,0.11-0.17,0.17c0,0.08,0,0.17,0,0.26c-0.37,0.5-1.05,1.17-1.14,1.81c-0.41,0.26-0.85,0.44-1.31,0.56c-0.03-0.03-0.06-0.06-0.1-0.09c-0.15,0.11-0.3,0.23-0.48,0.37c-0.3,0-0.63,0-0.99,0c-0.43-0.81-1.52-0.4-1.52-1.61c0.05-0.05,0.11-0.1,0.17-0.17c0-0.33,0-0.66,0-0.97c0.13-0.12,0.24-0.22,0.4-0.38c-0.01,0,0.06-0.01,0.13-0.02c0.21-0.51,1.92-2.31,1.72-2.83C173.87,61.87,173.83,61.34,173.83,60.86z"/><path class="inline-svg--fill-only" d="M150.4,68.57c-0.09,0-0.21,0-0.35,0c-0.01,0.04-0.02,0.08-0.04,0.16c-0.18,0.03-0.69,0.21-0.76,0.39c-0.16,0-0.32,0-0.47,0c-0.06,0.06-0.11,0.11-0.17,0.17c-0.08,0-0.17,0-0.29,0c-0.04,0.06-0.09,0.14-0.13,0.18c-0.15,0.01-0.25,0.01-0.35,0.02c-0.02,0.06-0.03,0.1-0.04,0.16c-0.13,0-0.26,0-0.38,0c-0.07,0.07-0.12,0.13-0.18,0.19c-1.14,0-2.04,0.35-3.08,0.71c-0.95-0.49-2.19,0.22-3.12,0.22c-0.04-0.05-0.09-0.11-0.12-0.15c-0.37-0.08-0.7-0.17-1.02-0.01c-0.15-0.16-0.28-0.29-0.41-0.42c-0.01,0.02-0.03,0.04-0.04,0.06c-1.02-0.54-1.17-0.52-2.14-1.26c0.08-0.58-0.42-0.73-0.73-1.03c0-0.22,0-0.43,0-0.67c0.04-0.01,0.09-0.03,0.15-0.04c0.21-0.89,1.09-1.57,1.16-2.54c0.03-0.01,0.09-0.03,0.17-0.06c0-0.1,0-0.22,0-0.38c0.11,0.05,0.17,0.08,0.22,0.11c0.35-0.2,0.72-0.41,1.12-0.64c0.32,0.29,0.68,0.39,1.1,0.28c0.07-0.21,0.14-0.42,0.2-0.62c0.23,0,0.42,0,0.61,0c0.73-0.81,2.62,0.89,2.45,1.71c0.05,0.02,0.09,0.03,0.14,0.04c0.47,0.95,1.9,2.37,2.96,1.19c0.41-0.02,0.87,0.09,1.2-0.34c0.61-0.08,2.43-1.69,2.93-1.5c0.42-0.31,0.97-0.44,1.27-0.89c0.41-0.08,1.43-0.51,1.76-0.81c0-0.97,1.18-0.96,1.41-1.9c0.9-0.73,2.25-1.5,2.19-2.9c0.21-0.21,0.41-0.41,0.63-0.63c0.04-0.32,0.08-0.66,0.13-1.05c0.02-0.02,0.09-0.07,0.15-0.11c0-0.68,0.4-0.99,0.88-1.47c0.49,0,0.98,0,1.48,0c0.1,0.42,0.36,0.7,0.77,0.83c0.09,0.49-0.05,0.93-0.43,1.3c0.38-0.06,0.62,0.08,0.8,0.32c0,0.18,0,0.36,0,0.55c-0.05,0.05-0.11,0.11-0.17,0.17c0,0.17,0,0.35,0,0.53c-0.76,0.97-1.15,2.01-2.03,2.88c-0.01,0.07-0.02,0.14-0.02,0.23c-0.07,0-0.15,0-0.24,0c-0.15,0.61-0.72,0.97-1.05,1.49c-0.37-0.04-0.63,0.16-0.91,0.32c0,0.06,0,0.12,0,0.19c-0.32,0.06-1.26,0.82-1.47,1.05c-0.08,1.74-4.57,2.14-4.99,3.55C150.87,68.26,150.63,68.4,150.4,68.57z"/><path class="inline-svg--fill-only" d="M57.65,79.32c0-0.17,0-0.33,0-0.5c-0.81-0.39-1.1-1.2-1.1-2c-0.32-0.36-0.35-0.43-0.37-0.75c-0.06-0.04-0.14-0.09-0.18-0.12c0-0.14,0-0.24,0-0.3c-0.49-0.41-0.67-1.01-1.02-1.51c0.15-0.96,0.4-1.12,1.07-1.88c0.21,0,0.43,0,0.64,0c0.04,0.04,1.73,0.58,1.6,0.58c0.01,0.05,0.02,0.09,0.04,0.15c0.16,0,0.32,0,0.47,0c0.07,0.07,0.12,0.12,0.19,0.19c0.14,0,0.29,0,0.47,0c0.04,0.06,0.1,0.14,0.13,0.19c0.16,0,0.29,0,0.42,0c0.02,0.05,0.03,0.1,0.06,0.17c0.13,0,0.26,0,0.4,0c0.02,0.07,0.04,0.12,0.06,0.19c0.1,0,0.2,0,0.29,0c0.1,0.17,0.19,0.31,0.28,0.45c0.21-0.03,0.43-0.06,0.63-0.09c0.09,0.08,0.15,0.15,0.22,0.21c0.09,0,0.18,0,0.23,0c0.15,0.17,0.27,0.32,0.4,0.47c0.72-0.46,1.25,0.45,1.95,0.45c0.02,0.05,0.04,0.1,0.06,0.17c0.08,0,0.17,0,0.32,0c0.03,0.06,0.07,0.14,0.09,0.19c0.75,0.08,1.2,0.5,1.65,1.05c0.91-0.45,2.6,1.03,2.63,1.97c0.05,0.04,0.13,0.09,0.18,0.13c0.1,0.34,0.02,0.62-0.24,0.85c-0.17-0.05-0.31-0.09-0.43-0.13c-0.06,0.06-0.1,0.1-0.17,0.17c0.03,0.12,0.06,0.26,0.1,0.44c-0.52,0.9-1.9,1.09-2.61,1.79c-0.39,0-0.78,0-1.17,0c-0.95,0.86-2.44,0.69-3.55,0.55c-0.93-0.93-2.75-1.53-3.41-2.75C57.77,79.61,57.83,79.34,57.65,79.32z"/></svg>',
		"logo_v" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 320"><path class="inline-svg--fill-only" d="M37.15,5.67c-0.06,0.05-0.12,0.1-0.16,0.13c0.28,0.14,0.58,0.29,0.87,0.44c0,0.51,0.24,0.9,0.69,1.16C39.08,7.45,40,7.7,40.61,7.7c0.71,0.93,2.36,0.6,2.79,1.91c0.44,0.1,0.88,0.48,1.29,0.5c0.02,0.07,0.02,0.12,0.03,0.17c0.25,0,0.78,0.46,0.95,0.38c0.69,0.77,1.23,0.39,1.56,1.52c0.02,0,0.03-0.01,0.05-0.01c0,1.11,0.36,1.38,0.36,2.29c0.17,0.2,0.22,0.44,0.2,0.67c0.08,0.08,0.13,0.13,0.19,0.19c0.12,0.59,0.05,1.15-0.21,1.68c0.51,0.5,0.7,1.08,0.57,1.75c-0.05,0.05-0.11,0.11-0.17,0.17c0,0.52-0.23,1.25-0.18,1.75c-0.06,0.06-0.11,0.11-0.18,0.18c0,0.09-0.01,0.19-0.02,0.31c-0.04,0.01-0.09,0.02-0.11,0.03c-0.15,0.3-0.29,0.59-0.44,0.88c-0.32,0.14-0.49,0.44-0.77,0.67c-0.1,0-0.24,0-0.38,0c-0.29,1.31-1.2,0.83-1.78,1.58c0,0,0,0.06,0,0.14c-0.69,0.01-1.72,1.64-2.43,1.34c-0.13,0.2-0.79,0.34-0.98,0.41c0.02,0.09-1.57,1.56-1.57,2.4c0.28,0.16,0.5,0.39,0.65,0.69c0.45,0.06,0.91-0.07,1.37,0.12c0.64-0.41,1.23-0.71,1.96-0.32c0.82-0.83,2.42-0.53,3.5-0.8c0.53-0.13,3.34-0.55,3.59-0.8c4.1-0.58,8.5,0.12,12.49-0.41c0.04,0.07,0.09,0.14,0.13,0.19c0.14,0,0.23,0,0.33,0c0.06-0.06,0.12-0.12,0.19-0.18c1.06-0.01,2.07,0.06,3.03,0.4c0.06-0.08,0.11-0.16,0.15-0.21c1.56,0,3.4,0.35,4.86,0.03c0.72,0.59,3.02,0.34,3.67,0.34c0.06,0.06,0.12,0.12,0.19,0.19c0.12,0,0.25,0,0.37,0c0.07,0.07,0.13,0.12,0.18,0.18c0.61,0.01,1.34,0.16,1.89,0.42c0,0.03,0,0.06,0.01,0.11c0.13,0,0.26,0,0.4,0c0.06,0.07,0.1,0.13,0.16,0.19c0.11,0,0.21,0,0.31,0c0.08,0.43,1.06,1.42,0.23,1.9c-0.13,0.19-0.2,0.4-0.19,0.62c-0.24,0.29-0.46,0.55-0.68,0.81c-0.17,0-0.32,0-0.48,0c-0.52,1.01-0.94,3.26-1.07,4.39c-0.04,0.01-0.09,0.03-0.17,0.05c0.11,0.68-0.9,1.89-1.08,2.59c-0.35,1.35-0.08,2.93-0.49,4.26c0.06,0.07-0.09,1.07-0.09,1.2c-0.07,0.07-0.12,0.12-0.18,0.18c0,1.03-0.2,1.94-0.2,2.97c-0.05,0.05-0.1,0.1-0.16,0.16c0,0.12,0,0.24,0,0.36c-0.26,0.28-0.32,2.24-0.4,2.61c-0.02,0.01-0.07,0.02-0.13,0.04c-0.11,0.36-0.32,0.71-0.2,1.08c-0.43,0.96-1.38,0.72-2.03,0.27c0-0.07,0-0.14,0-0.21c-0.2-0.05-0.22-0.27-0.38-0.36c0-0.12,0-0.24,0-0.38c-0.06-0.05-0.14-0.1-0.19-0.14c0-0.16,0-0.28,0-0.41c-0.05-0.05-0.11-0.1-0.17-0.16c0-0.16,0-0.33,0-0.5c0.52-0.39,0.17-1.76,0.17-2.3c0.72-0.68-0.13-2.19,0.55-2.86c0-0.66-0.18-1.13-0.18-1.73c-0.31-0.35-0.14-0.79-0.19-1.22c0.05-0.04,0.12-0.08,0.19-0.14c0-0.12,0-0.23,0-0.34c0.07-0.02,0.12-0.03,0.17-0.05c0-0.1,0-0.2,0-0.29c0.55-0.55,1.09-2.89,1.14-3.54c0.22,0.05,0.46,0.34,0.71,0.02c0-0.14,0-0.29,0-0.49c-0.34-0.13-0.58-0.35-0.74-0.66c0.26-1.18,0.93-1.91,0.93-3.18c0.8-0.67-0.07-2.34-1.07-2.36c-0.04-0.05-0.09-0.13-0.12-0.18c-0.14,0-0.23,0-0.32,0c-0.07-0.06-0.13-0.13-0.2-0.19c-0.48,0-2.71-0.28-2.83-0.72c-0.13,0-0.26,0-0.4,0c-0.12,0.12-0.24,0.24-0.36,0.36c-1.66,0-4.54,0.26-6.02-0.48c-0.18,0.13-0.34,0.25-0.49,0.37c-0.41,0.2-0.73,0.17-0.96-0.08c-0.04,0.06-0.09,0.12-0.13,0.18c-0.15,0-0.29,0-0.41,0c-0.05,0.05-0.08,0.08-0.11,0.11c0.02,0.17,0.05,0.33,0.07,0.52c0.52,0.33,0.79,0.8,0.82,1.42c-0.12,0.12-0.24,0.27-0.19,0.49c-0.49,0.21-1.42,2.26-1.98,2.81c-0.15,0-0.31,0-0.48,0c-0.5,0.75-3.43,2.82-1.93,4.24c0.33,0.12,0.65,0.27,0.95,0.45c0.16-0.26,2.94-0.5,3.44-0.43c-0.31,0.2,1.11-0.62,1.25-0.57c0.86-0.62,5.23,0.24,6.16,0.65c0.76,0.34,1.75,0.87,1.8,1.75c0.03,0.49-0.79,1.97-1.5,1.67c-0.15,0.11-0.31,0.23-0.49,0.37c-2.11-0.18-5.04,1.63-6.9,0.85c-0.31,0.32-0.83,0.25-1.15,0.54c-0.15-0.05-0.28-0.09-0.45-0.14c-0.02,0.29,0,0.54-0.01,0.81c0.11,0.09,0.22,0.19,0.38,0.33c0.22,0,1.77,0.5,1.98,0.74c0.67-0.12,1.44,0.55,2.16,0.55c0.39,0.64,1.03,1.16,1.57,1.71c0,0.06,0,0.12,0,0.19c0.4,0.38-0.04,1.09-0.01,1.56c-0.41,0.3-0.65,0.84-1.24,0.8c-0.01,0.18-0.2,0.18-0.29,0.27c-0.82-0.26-1.72-0.46-2.58-0.46c-0.03-0.05-0.07-0.13-0.1-0.18c-0.57,0-2.02-0.43-2.26-1.1c-0.15,0-0.3,0-0.48,0c-0.03-0.05-0.07-0.12-0.11-0.17c-0.36-0.29-0.75-0.42-1.18-0.39c-0.07-0.07-0.12-0.12-0.18-0.18c-0.12,0-0.24,0-0.38,0c-0.02-0.05-0.04-0.1-0.05-0.15c-0.41-0.14-0.74-0.4-1.06-0.68c-0.29-0.04-0.55,0.07-0.76,0.33c-0.1-0.09-0.18-0.16-0.25-0.23c-0.4,0-0.8,0-1.18,0c-0.42,0.29-0.65,0.71-0.7,1.25c-0.67,0.31-0.39,0.09-0.27,1.2c-0.07,0.04-0.14,0.09-0.19,0.13c0,0.17,0,0.29,0,0.46c0.84,0.68,1,1.84,2.18,2.15c0.18,0.41,0.37,0.8,0.83,0.98c0.02-0.01,0.05-0.04,0.08-0.07c0.34,0.36,1.16,0.1,1.68,0.21c0.02,0.03,0.07,0.11,0.11,0.17c0.53-0.08,2.22,0.3,2.54-0.01c4.17,0,8.53-0.54,12.63-0.54c0.11,0.12,0.23,0.25,0.36,0.4c0.21-0.15,0.39-0.27,0.6-0.41c0.84,0.12,1.63,0.1,2.45-0.02c0.05,0.08,0.1,0.15,0.14,0.2c0.32,0,0.59,0,0.88,0c0.06-0.06,0.13-0.12,0.19-0.18c0.28,0,0.56,0,0.83,0c0.31,0.28,0.54,0.22,0.69-0.19c0.78,0,1.76-0.19,2.43-0.57c0.21,0.06,0.47,0.14,0.75,0.23c0.05-0.09,0.1-0.18,0.12-0.22c0.28,0,0.5,0,0.73,0c0.25-0.31,0.61-0.48,1.06-0.49c0.1,0.15,0.2,0.29,0.32,0.47c0,0-0.04,0.07-0.1,0.21c0.15-0.04,0.23-0.06,0.37-0.1c0.33,0.29,0.83,0.45,0.98,0.94c0.46,0.2,0.71,0.57,0.76,1.09c-1.48,1.41-1.96,3.41-4.51,3.41c-0.12,0.12-0.24,0.24-0.36,0.36c-0.43-0.02-0.83,0.33-1.31,0.13c-0.49,0.44-1.14,0.34-1.74,0.24c-0.06,0.06-0.12,0.12-0.18,0.18c-0.11,0-0.23,0-0.38,0c-0.05,0.06-0.1,0.14-0.14,0.19c-1.61,0-3.2,0.18-4.75,0.18c-0.05,0.06-0.1,0.14-0.14,0.19c-1.03,0.07-2.02-0.48-3.07-0.27c-0.16-0.18-0.38-0.03-0.53-0.1c-0.3,0.24-1.93,0.3-2.29,0.2c-1.84,1.17-6.3,0-8.53,0.21c-0.06-0.08-0.11-0.16-0.14-0.21c-0.86,0-2.53,0.11-3.34-0.28c-0.23,0.45-0.55,0.67-0.96,0.65c-1.37,2.51-2.44,5.11-4.19,7.48c0,0.37-0.55,0.43-0.66,0.79c-1.08,0.64-1.45,2.31-2.57,3.05c0,0.02-1.28,0.97-0.91,0.68c-0.06,0-0.15,0-0.24,0c-0.62,0.63-0.62,0.63-1.02,0.65c-0.07,0.08-0.15,0.15-0.23,0.23c0.02,0.02,0.04,0.04,0.07,0.08c-0.1,0.21-0.25,0.38-0.44,0.51c-0.02,0-0.11,0-0.24,0c-0.02,0.07-0.06,0.16-0.07,0.19c-0.21,0-0.33,0-0.43,0c-0.23,0.42-0.58,0.63-1.04,0.64c-0.68-0.35-1.98,0.48-2.7,0.48c-0.05-0.05-0.1-0.11-0.16-0.17c-0.45,0.1-0.83-0.04-1.14-0.42c-0.09-0.29-0.17-0.57-0.28-0.91c-2.21-0.86-0.39-2.01,0.95-2.01c0.03,0.05,0.08,0.13,0.12,0.19c0.37-0.06,0.54,0.2,0.79,0.34c0.31-0.16,1.21-0.37,1.57-0.34c0.53-0.97,1.98-0.67,1.98-1.89c0.43-0.41,0.27-0.45,1.29-0.82c0-0.05,0.01-0.11,0.01-0.21c0.44-0.07,0.38-0.61,0.73-0.85c0-0.06,0-0.16,0-0.22c0.15-0.11,0.26-0.2,0.37-0.28c0.01-0.32,0.58-1.35,0.91-1.48c0.03-0.23,0.13-0.43,0.35-0.54c-0.03-0.18,0.4-1.15,0.59-1.22c0-0.13,0-0.26,0-0.38c0.19-0.05,0.21-0.26,0.36-0.35c0.34-1.43,0.07-2.17-0.95-3.19c-0.27,0-0.54,0-0.84,0c-0.05-0.06-0.1-0.14-0.14-0.19c-0.95,0-2.96-1.04-3.73-0.19c-1.79,0-8.57,1.64-9.68,0.23c-1.69,0.89-3.53,0.79-5.41,0.69c-0.15,0.11-0.32,0.23-0.53,0.37c-0.85-0.1-1.2,0.18-1.81,0.18c-0.68,0.68-1.94-0.36-2.66,0.36c-0.73,0-1.46,0-2.23,0c-0.08-0.08-0.19-0.18-0.33-0.33c-0.16,0.33-0.42,0.5-0.75,0.62c-0.61-0.23-1.85-0.27-2.54-0.07c-0.01,0.02-0.06,0.1-0.09,0.15c-1.16,0.11-2.73,0.17-3.81-0.21c-0.71-0.24-1.31-1.24-2.08-1.28c-0.47-0.84-2.12-1.5-2.79-2.34c0-0.29,0-0.6,0-0.91c1.31-1.41,3.66-0.68,5.48-0.44c0.09,0.17,0.16,0.31,0.26,0.49c0.2-0.04,0.39-0.08,0.59-0.12c0.01-0.29,0.41-0.1,0.42-0.37c0.3,0.05,0.58,0.09,0.89,0.13c0.27,0.3,0.72,0.36,1.09,0.06c0.91,0,1.65,0.34,2.59,0.17c0.04,0.07,0.08,0.15,0.12,0.22c0.33-0.07,0.58-0.17,0.8-0.39c0.82,0,1.58-0.14,2.4-0.19c0.3,0.36,3.89-0.04,4.16-0.26c0.2,0.19,2.52-0.12,2.86-0.22c0.09-0.17,0.21-0.31,0.36-0.43c0.68,0.09,1.35,0.04,2-0.16c0.75,0,0.8-0.38,1.62-0.04c0.2-0.14,0.43-0.29,0.68-0.46c0.09,0.03,0.2,0.07,0.33,0.11c0.61-0.92-0.54-2.06-0.41-3.2c0.24-0.19,0.36-0.47,0.35-0.82c-0.66-0.7,0.06-1.35-0.54-2.03c0-0.24,0-0.49,0-0.73c0.07-0.07,0.12-0.12,0.19-0.19c-0.07-0.84,0.41-1.12-0.19-1.86c0-1.32,0.18-2.62,0.18-3.95c-0.06-0.06-0.11-0.11-0.18-0.18c0-0.12,0-0.25,0-0.37c-0.07-0.07-0.12-0.12-0.19-0.19c0.11-0.74,0-1.26-0.23-1.96c-0.02-0.01-0.07-0.03-0.13-0.05c0-0.12,0-0.24,0-0.36c-0.89-0.62-1.84-2.68-2.72-3.56c-0.73-0.03-0.99-0.58-1.32-1.09c-0.31-0.06-0.56-0.1-0.83-0.15c-0.15-0.43-0.43-0.68-0.85-0.74c0.13-0.62-0.83-1.07-0.83-1.82c-0.65-0.42-0.97-1-0.96-1.73c-0.05-0.03-0.13-0.08-0.24-0.15c0-0.08,0-0.18,0-0.29c-0.06-0.01-0.1-0.02-0.16-0.03c0.07-0.26-0.33-0.38-0.19-0.67c-0.07-0.07-0.12-0.12-0.19-0.19c0-0.11,0-0.23,0-0.38c-0.05-0.03-0.12-0.06-0.17-0.09c0-0.15,0-0.25,0-0.34c-0.08-0.08-0.14-0.15-0.21-0.22c0.1-0.54-0.23-0.91-0.55-1.29c0-0.36,0-0.73,0-1.1c-0.5-0.58-0.7-1.65-0.74-2.41c-0.06-0.03-0.14-0.08-0.18-0.1c0-1.09,0.37-2.12,0.37-3.3c0.24-0.24,0.17-0.53,0.19-0.84c0.05-0.04,0.13-0.09,0.2-0.15c-0.22-0.78,1.09-1.88,1.58-2.47c0.08,0,0.14,0,0.22,0c1.05-1.73,1.66-3.08,3.42-4.3c0-0.09,0-0.22,0-0.36c0.14-0.17,0.26-0.33,0.37-0.46c0.24-0.06,0.43-0.1,0.63-0.15c0.02-0.05,0.04-0.11,0.06-0.16c0.1,0,0.19,0,0.28,0c0.31-0.28,1.08-0.9,1.2-1.29c1.12-0.1,3-2.96,3.68-3.69c0.2,0.07,0.38-0.25,0.57,0c0.05-0.05,0.09-0.09,0.14-0.14c0-0.15,0-0.3,0-0.49c0.42-0.13,0.86-0.23,1.29-0.29c-0.08-0.21-0.33,0.04-0.37-0.19C36.41,5.67,36.78,5.67,37.15,5.67z M41.58,45.99c-0.44-0.16-0.61-0.13-1.03,0.08c-0.64-0.46-1.64-0.19-2.36-0.19c-0.12,0.11-0.24,0.22-0.39,0.35c-0.2-0.04-0.33,0.34-0.59,0.19c-0.65,0.67-1.16,1.9-1.17,2.83c-0.07,0.07-0.12,0.12-0.21,0.21c0.16,0.52-0.22,1.01-0.17,1.55c-0.56,0.48-0.1,2.34-0.43,2.99c0.16,0.76,0.27,1.15,0.71,1.83c0.54,0.04,0.94,0.2,1.48,0.2c0.04,0.06,0.09,0.13,0.12,0.17c0.21,0.06,0.29-0.07,0.39-0.17c0.09,0,0.18,0,0.27,0c0.07-0.06,0.13-0.13,0.19-0.18c0.7,0,1.4,0.03,2.09,0.09c0.63-0.8,5.23-0.33,5.9-0.22c0.16-0.22,0.36-0.48,0.55-0.74c-0.02-0.43,0.04-0.84,0.18-1.25c0.1-0.11,0.17-0.19,0.25-0.28c0.04,0,0.1,0,0.19,0c0.05-0.17,0.1-0.35,0.15-0.52c1.98-0.78,1.06-1.47,2.18-2.48c0-0.53-0.18-0.97-0.18-1.48c-0.06-0.06-0.12-0.12-0.19-0.19c0-0.21,0-0.44,0-0.65c-0.07-0.07-0.12-0.12-0.18-0.18c0.13-0.47,0.01-0.86-0.34-1.18c-0.05-0.15-0.11-0.3-0.14-0.4c-0.16-0.06-0.26-0.09-0.39-0.14c-0.46,0.42-1.34,0.27-1.9,0.6c0,0.03,0,0.06,0,0.09c-0.5,0.18-0.89,0.6-1.38,0.61c-1.31,1.06-3.39,3.45-5.08,2.65c0-0.25,0-0.47,0-0.68c0.73-0.45,1.02-2.22,1.84-2.39c0-0.06,0-0.12,0-0.18c0.15-0.09,0.15-0.09,0.27-0.32C42,46.41,41.8,46.21,41.58,45.99z M41.03,41.79c0.79,0.22,0.88,0.17,1.71-0.15c0.28,0.12,0.56,0.24,0.83,0.36c0.17-0.12,0.34-0.21,0.55-0.17c0.12-0.21,0.36-0.18,0.48-0.25c0.36,0.07,1.43,0.35,1.78,0.25c0.66,0.35,1.2,0.22,1.65-0.38c0.14,0,0.29,0,0.43,0c0.36-0.3,1.25-0.37,1.25-0.98c0.04-0.01,0.09-0.02,0.13-0.03c0.35-0.87,0.14-1.64,0.32-2.53c-1.85-1.99-4.15,0.39-5.68,1.7c-0.56,0.07-1.1,0.02-1.62-0.16c-0.24,0.03-0.34-0.21-0.47-0.25c-1.08-1.96,0.22-5.21,0.22-7.41c-0.53-0.31-2.02-1.59-2.73-0.85c-0.42-0.07-0.76,0.07-1.04,0.44c0.01,0.07-0.13,0.16-0.03,0.25c-0.23,0.51-0.39,0.97-0.79,1.37c0.06,0.5,0.07,2.15,0.45,2.5c0,0.13,0,0.25,0,0.37c0.2,0.18,0.19,0.42,0.18,0.7c0.06,0.04,0.14,0.08,0.19,0.11c0,0.96,0.18,1.82,0.18,2.78c0.55,0.55,0.68,1.19,0.87,1.91C40.13,41.46,40.83,41.58,41.03,41.79z M51.4,31.13c0.21-0.2,0.37-0.4,0.3-0.75c-0.19-0.13-0.4-0.28-0.63-0.44c0-0.03,0-0.09,0-0.15c-0.59-0.36-2.16,0.06-2.84-0.05c-0.16,0.23-0.3,0.44-0.43,0.62c-0.22,0.05-0.41,0.1-0.55,0.14c-0.42,0.9,0.44,1.1,0.91,1.74c0.43,0,0.71,0.18,1.13,0.16c0.17-0.36,0.79-0.42,0.91-0.74c0.21,0.04,0.39,0.08,0.57,0.12C50.81,31.27,51.02,31.05,51.4,31.13z"/><path class="inline-svg--fill-only" d="M92.51,277.75c-0.53,1.26-1.82,1.23-2.99,1.1c-0.08,0.1-0.16,0.19-0.21,0.26c-0.2,0.04-0.56,0.07-0.61,0.05c-0.6,0.31-1.69-0.28-2.14,0.07c-0.21-0.05-0.42-0.1-0.63-0.17c-0.21,0.08-0.43,0.11-0.66,0.08c-0.73,0.83-2.2-0.42-2.88,0.2c-0.19-0.14-0.35-0.27-0.52-0.39c-0.13,0-0.25,0-0.38,0c-0.22,0.31-0.53,0.5-0.92,0.56c-0.38-0.28-0.8-0.59-1.26-0.93c-0.07,0.02-0.2,0.06-0.34,0.11c0.07,1.05-1.88,0.18-2.35,0.64c-0.27-0.01-1.16-0.02-1.38-0.37c-0.43,0-0.88,0-1.32,0c-0.06,0.06-0.11,0.11-0.17,0.17c-2.61,0-5.81,0.47-8.4,0.18c-0.05-0.05-0.1-0.1-0.18-0.18c-0.88,0.14-1.87,0-2.76,0c-0.06,0.06-0.13,0.12-0.2,0.19c-0.46,0-0.92,0-1.38,0c-0.6,0.66-4.27,0.18-4.98,0.18c-0.07,0.07-0.12,0.12-0.18,0.18c-1.21,0-7.31-0.51-8.11,0.37c-0.24,0-0.49,0-0.74,0c-0.05,0.05-0.1,0.11-0.15,0.18c-0.13,0-0.27,0-0.38,0c-0.25,0.21-0.48,0.4-0.7,0.58c0,0.45,0,0.88,0,1.32c0.06,0.06,0.12,0.13,0.18,0.19c0,0.06,0,0.12,0,0.17c0.78,0.29,2.89,0.5,3.48,1.09c0.25-0.05,0.52-0.1,0.86-0.17c0.16,0.1,0.39,0.25,0.62,0.39c0,0,0.02-0.02,0.02-0.02c0.09,0.09,0.18,0.18,0.23,0.23c0.21,0,0.33,0,0.47,0c0.22-0.16,0.35-0.37,0.41-0.63c0.14,0,0.24,0,0.34,0c0.11,0.15,0.22,0.3,0.33,0.46c0.48-0.15,0.68-0.08,1.11,0.1c0.74-0.7,3.94-0.12,5.04-0.11c1.86,0.02,3.75,0.41,5.63,0.19c0.51,0.38,1.78-0.14,2.28,0.28c0.21,0,0.42,0,0.64,0c0.33-0.15,0.68-0.24,1.04-0.28c0.62,0.49,1.76-0.11,2.39,0.47c0.75-0.33,1.5-0.01,2.29-0.01c0.84-0.92,2.48,0.32,3.28,0.18c1.21,0.84,1.56,0.93,1.56,2.38c-0.13,0.09-0.27,0.2-0.41,0.3c-0.13,0-0.25,0-0.39,0c-0.39,0.59-0.97,0.21-1.37,0.65c-2.2,0-5.36-0.65-7.33-0.36c-0.09,0.1-0.2,0.25-0.3,0.37c-0.66-0.06-2.83-0.13-3.3-0.37c-0.51,0.1-1.28-0.43-1.69-0.01c-0.11,0-0.23,0-0.38,0c-0.07-0.08-0.16-0.19-0.22-0.27c-2.32,0-1.53,3.97-2.03,5.35c0.17,0.27,0.05,0.58,0.09,0.87c-1.49,1.49,0.36,4.98-1.1,6.56c0,0.1,0,0.22,0,0.37c-0.06,0.04-0.14,0.1-0.19,0.13c-0.02,0.43-0.19,0.76-0.19,1.17c-0.04,0.01-0.09,0.03-0.13,0.04c-0.18,0.21-0.26,0.45-0.25,0.71c-0.05,0.01-0.1,0.02-0.16,0.04c0,0.1,0,0.2,0,0.31c-0.07,0.02-0.12,0.04-0.17,0.06c-0.04,0.27-0.21,0.47-0.39,0.68c0,0.07,0,0.17,0,0.26c-0.06,0.07-0.13,0.13-0.19,0.2c0,0.15,0,0.31,0,0.47c-0.04,0.01-0.08,0.03-0.13,0.05c-1.29,2.45-1.06,5.01-3.05,7c-0.49,0.03-0.78-0.31-1.11-0.65c-0.62-0.08-1.1,0.13-1.45,0.64c-0.42-0.05-0.8,0.06-1.16,0.31c-0.16-0.1-0.33-0.21-0.48-0.31c0-0.28,0-0.52,0-0.79c0.05-0.04,0.1-0.09,0.14-0.12c0.05-0.24,0.19-1.42,0.41-1.62c0-0.49,0.15-0.83,0.2-1.31c0.04-0.04,0.1-0.1,0.16-0.16c0-0.14,0-0.29,0-0.47c0.06-0.04,0.14-0.1,0.21-0.15c-0.16-0.56,0.31-1.12,0.63-1.48c0-0.54-0.09-1.06-0.09-1.6c0.04-0.01,0.08-0.03,0.13-0.05c0.33-0.8,0.23-1.57,0.23-2.44c0.05-0.03,0.12-0.07,0.17-0.1c0.07-0.51,0.14-0.99,0.21-1.47c0.05-0.02,0.1-0.04,0.16-0.06c0.32-2.76,0.94-5.61,0.94-8.31c0.36-0.31,0.4-0.75,0.11-1.31c-0.02-0.27,0.07-0.49,0.26-0.64c0-0.65,0-1.29,0-1.94c-0.06-0.06-0.11-0.11-0.18-0.18c0-0.12,0-0.25,0-0.37c-0.27-0.2-0.56-0.11-0.84-0.14c-0.34,0.39-0.76,0.52-1.27,0.37c-0.08,0.38-0.3,0.67-0.65,0.85c0,0.9-0.74,0.96,0.01,1.91c0.07,0.53-0.04,1.01-0.32,1.43c0.68,1.38-0.07,3.31-0.07,4.81c-0.06,0.04-0.13,0.1-0.18,0.14c0,0.16,0,0.28,0,0.4c-0.34,0.38-0.36,0.79-0.08,1.21c-0.04,0.32-0.08,0.66-0.13,1.02c-0.4,0.31-0.78,0.65-1.12,1.03c-0.07,0.01-0.14,0.02-0.22,0.02c-0.05,0.26-0.09,0.52-0.14,0.76c-0.07,0.06-0.13,0.12-0.25,0.22c-0.69,0.26-1.26,0.17-1.73-0.27c-0.05-0.32-0.33-0.58-0.18-0.98c-0.22-0.14-0.39-0.32-0.5-0.56c0.04-0.2,0.08-0.36,0.11-0.51c-0.08-0.08-0.14-0.14-0.19-0.19c-0.02-0.37-0.04-0.74,0.2-1.07c-0.04-0.06-0.07-0.11-0.1-0.14c0.03-0.05,0.06-0.1,0.09-0.14c-0.17-0.14-0.33-0.27-0.47-0.39c-0.01-0.3-0.01-0.3-0.3-0.79c0.04-0.29,0.08-0.63,0.11-0.91c-0.1-0.13-0.17-0.22-0.25-0.32c-0.06,0.03-0.1,0.05-0.16,0.08c-1.01-0.51-2.13-0.73-2.98-1.36c-0.69,0.19-1.18-0.35-1.61-0.73c-0.22,0-0.41,0-0.59,0c-0.05-0.05-0.11-0.11-0.17-0.17c-0.44,0-1.06-0.23-1.38-0.55c-1.1,0-1.53-0.93-2.42-1.29c-0.12-0.38-0.24-0.73,0.05-1.07c0-0.15,0-0.3,0-0.47c0.05-0.04,0.11-0.09,0.17-0.14c0-0.48,0.39-0.76,0.39-1.26c0.06-0.01,0.1-0.03,0.16-0.04c0-0.13,0-0.26,0-0.39c0.07-0.07,0.13-0.12,0.19-0.18c0-0.16,0-0.32,0-0.45c0.44-0.53,1.02-2.55,0.93-3.16c0.59-0.65,0.38-1.92,0.16-2.7c-0.67-0.44-2.1-0.74-2.6-1.22c-0.46,0-0.93,0-1.38,0c-0.06,0.06-0.11,0.11-0.17,0.17c-0.27,0-0.54,0-0.84,0c-0.04,0.06-0.1,0.14-0.13,0.19c-0.26,0-0.47,0-0.69,0c-0.34,0.68-1.31,1.25-1.14,2.18c0.24,0.21,0.15,0.54,0.17,0.86c0.84,0.32,0.92,1.28,0.92,1.99c-0.06,0.06-0.11,0.11-0.18,0.18c0.01,0.22,0.02,0.46-0.18,0.64c0,0.15,0,0.3,0,0.46c-0.06,0.07-0.13,0.13-0.19,0.2c0,0.08,0,0.16,0,0.27c-0.23,0.26-0.47,0.54-0.74,0.87c-0.02,0.29,0.07,0.53,0.28,0.71c0,0.08,0,0.17,0,0.28c-0.43,0.33-1.16,1.53-1.63,1.7c-0.04,0.39-0.09,0.76-0.13,1.17c-0.32,0.22-0.69,0.48-0.54,0.94c-0.51,0.93-0.71,2.86-1.65,3.44c0,0.81-0.53,4.77-1.09,5.36c-0.02,0.55,0.17,1.7-0.21,2.15c0,0.36,0,0.73,0,1.1c0.01,0,0.03-0.01,0.04-0.01c0.18,0.55,1.33,2.06,2.15,1.9c0.01,0.06,0.03,0.1,0.04,0.16c0.21,0.07,0.4,0.28,0.68,0.22c0.07,0.17,0.14,0.34,0.37,0.27c0.16,0.16,0.31,0.31,0.47,0.47c0.02-0.02,0.04-0.04,0.06-0.06c0.53,0.07,1.53,0.88,1.36,1.58c0.07,0.07,0.13,0.13,0.18,0.18c-0.11,0.46-0.18,0.93-0.19,1.4c-0.04,0.04-0.1,0.1-0.16,0.16c0,0.14,0,0.29,0,0.41c-0.21,0.21-0.41,0.41-0.64,0.64c-0.01,0-0.08,0-0.18,0c-0.19,0.46-0.5,0.82-0.97,1.03c-0.19-0.08-0.38,0.26-0.55,0.02c-0.43,0.12-0.83,0.3-1.21,0.53c-0.06-0.06-0.11-0.11-0.19-0.19c-0.83,0-1.62-0.02-2.41,0.01c-0.05,0.05-0.11,0.11-0.15,0.15c-0.28-0.18-0.56-0.35-0.85-0.54c-0.25,0.04-0.53-0.08-0.77,0.09c-1.04-0.23-2.41-0.53-3.33-1.06c-0.04-0.11-0.08-0.25-0.14-0.42c-0.26-0.04-0.55-0.08-0.87-0.12c-0.09-0.09-0.21-0.21-0.33-0.33c-0.09,0-0.18,0-0.29,0c-0.02-0.05-0.04-0.1-0.06-0.17c-0.1,0-0.2,0-0.24,0c-0.18-0.16-0.31-0.28-0.46-0.41c0-0.73-0.26-0.85-0.97-0.78c-0.1-0.12-0.2-0.23-0.34-0.39c0-0.21-0.19-2.71,0.53-2.69c0.13-0.21,0.18-0.43,0.01-0.63c0.03-0.3,0.25-0.45,0.42-0.63c0.09,0,0.18,0,0.27,0c0.08-0.17,0.16-0.34,0.26-0.53c0.34-0.15,0.7-0.31,1.06-0.47c0.25-0.86,0.21-1.02,0.95-1.62c-0.17-0.82,1.1-1.77,1.31-2.62c0.04-0.01,0.08-0.02,0.14-0.04c0-0.07,0-0.14,0-0.2c0.07-0.07,0.13-0.12,0.2-0.2c-0.24-1,1.16-2.46,1.84-3.01c0-0.12,0-0.22,0-0.28c0.16-0.26,0.36-0.38,0.63-0.36c0.16-0.69,0.7-1.09,0.9-1.75c0.19-0.05,0.04-0.37,0.29-0.38c0.04-0.31,1.67-2.48,1.72-2.59c-0.02-0.02-0.04-0.03-0.06-0.05c0.17-0.15,0.34-0.3,0.53-0.46c-0.04-0.07-0.08-0.12-0.11-0.17c0.4-0.78,1.06-1.45,1.1-2.37c1.2-1.13-0.4-1.38-1.07-2.11c-0.34,0.15-1.11-0.66-1.2-0.73c-0.34,0-0.68,0-1.01,0c-0.06-0.06-0.11-0.11-0.18-0.18c-0.12,0-0.25,0-0.39,0c-0.01-0.06-0.02-0.1-0.03-0.16c-0.09,0-0.19,0-0.31,0c-0.02-0.06-0.04-0.12-0.06-0.18c-0.72-0.14-2.56-1.25-2.56-2.02c-0.05-0.02-0.1-0.04-0.17-0.06c0-0.1,0-0.2,0-0.25c-0.21-0.26-0.39-0.48-0.56-0.7c-0.04-0.94,0.3-1.22,0.82-1.36c0.6-1.37,2.08-0.49,2.88-0.08c0.41-0.09,0.82-0.09,1.24,0c0.16-0.3,0.4-0.45,0.74-0.45c0.2-0.46-0.21-0.74-0.15-1.23c-0.49-0.68-0.12-1.01,0.03-1.61c0.06-0.01,1.13-0.86,1.04-0.76c0.65,0.15,2.13,0.05,2.58,0.56c0.25,0,0.49,0,0.74,0c0.23,0.27,0.55,0.16,0.84,0.19c0.06,0.06,0.11,0.11,0.18,0.18c0.39-0.05,0.83,0.13,1.2-0.19c1.47,0,5.59-0.3,6.91,0.37c0.97-0.97,4.2-0.18,5.44-0.37c0.01-0.2,0.27-0.17,0.33-0.35c0.47,0,0.93,0,1.43,0c0.04-0.06,0.08-0.14,0.1-0.17c0.39-0.13,0.78-0.14,1.17-0.04c0.58-0.47,3.68-0.5,4.28-0.08c2.4-0.75,5.87,1.18,8.15,0c0.62,0.36,3.16-0.09,3.93-0.09c0.01-0.1,0.01-0.2,0.02-0.31c0.12-0.09,0.25-0.17,0.37-0.26c0.32,0.06,0.44,0.36,0.71,0.47c1.68-0.55,3.69-0.09,5.43-0.09c0.04-0.05,0.08-0.11,0.13-0.17c0.14,0,0.28,0,0.43,0c0.3,0.33,2.15,0.37,2.6,0.56c1.24-0.7,6.43,0.45,7.17-0.57c0.22,0.35,1.08-0.03,1.47,0.36c0.45-0.13,0.9-0.26,1.35-0.36c1.02-0.78,3.33,0.56,4.19-0.37c0.67,0,1.23-0.18,1.94-0.18c0.19-0.25,0.46-0.35,0.82-0.3c0.42,0.46,0.83,0.39,1.26,0.85C92.32,276.58,92.51,277.15,92.51,277.75z"/><path class="inline-svg--fill-only" d="M62.36,258.32c-0.05,0.05-0.1,0.1-0.15,0.16c-0.19,0-0.37,0-0.55,0c-0.05,0.05-0.11,0.11-0.18,0.18c-0.3-0.02-0.63,0.08-0.92-0.19c-0.47,0.08-0.9-0.01-1.3-0.27c-0.03,0.06-0.07,0.14-0.1,0.19c-0.56-0.08-1.08-0.08-1.53-0.42c-0.92,0.45-1.1-0.01-1.92-0.27c-0.65,0.55-4.13,0.45-4.75-0.17c-0.12,0.39-0.38,0.69-0.79,0.9c0.1,0.23,0.14,0.47,0.11,0.72c-0.06,0.06-0.11,0.11-0.19,0.19c0.01,0.22,0.02,0.46-0.18,0.64c0,0.72-0.4,1.21-0.37,1.95c0.09,0.07,0.2,0.15,0.27,0.2c0,0.7,1.07,0.94,1.62,0.94c0.04,0.05,0.09,0.11,0.14,0.18c0.17,0,0.34,0,0.49,0c0.07,0.07,0.12,0.12,0.19,0.19c0.54,0.04,1.36,0.02,1.86,0.27c0.81-0.76,2.72,0.54,3.5-0.27c0.55,0.09,2.17-0.31,2.59,0c0.47,0,1.82-0.02,2.21-0.31c0.16,0.1,0.31,0.19,0.49,0.31c0.32-0.04,0.7,0.1,1.06-0.17c0.37,0.2,0.73,0.41,1.07,0.65c-0.23,0.64-0.91,2.27-1.83,2.19c-0.08,0.14-0.16,0.29-0.25,0.46c-0.08,0-0.19,0-0.28,0c-0.06-0.06-0.11-0.11-0.17-0.17c-0.46-0.01-0.46-0.01-0.84,0.36c-0.66-0.02-1.31,0.01-1.97,0.09c-0.53,0.17-1.04,0.11-1.53-0.17c-0.84,0.67-2.67-0.12-3.66,0.17c-0.86-0.66-3.96,0.34-4.75,0.83c-0.22,0.9,0.04,2.07,0.71,2.73c-0.07,0.51,0.11,0.92,0.53,1.25c0.04-0.02,0.09-0.05,0.12-0.06c1.24,0.23,2.24,0.7,3.53,0.52c0.12-0.13,0.23-0.25,0.35-0.37c0.13,0,0.25,0,0.39,0c0.1,0.11,0.21,0.23,0.31,0.35c0.14,0,0.24,0,0.36,0c0.13-0.26,0.34-0.44,0.61-0.54c0.29,0,0.57,0,0.84,0c0.06,0.06,0.11,0.11,0.18,0.18c0.09,0,0.19,0.01,0.29,0.01c0.06,0.06,0.12,0.12,0.18,0.18c2.1,0,5.67-0.68,7.05,1.19c0,0.29,0,0.64,0,0.98c-0.44,0.31-0.88,0.53-1.36,0.78c-0.26-0.1-0.58-0.13-0.8-0.36c-0.09,0-0.18,0-0.3,0c-0.88,1.35-7.68,0.37-9.57,0.37c-0.06-0.06-0.11-0.11-0.18-0.18c-0.95,0-1.8-0.15-2.77-0.19c-0.18-0.18-0.35-0.35-0.54-0.54c-1.48,0-3.06,0.97-4.54,1.1c-0.09,0.09-0.17,0.17-0.29,0.29c-0.5-0.09-1.03-0.19-1.52-0.27c-1.07-1.68-0.54-3.76-1.73-5.36c0-0.46-0.08-2.4,0.37-2.63c0-0.79-0.25-3.13,0.27-3.71c-0.16-0.75,0.13-1.87,0.65-2.4c-0.14-0.43-0.05-0.78,0.25-1.07c0.03,0.01,0.08,0.02,0.19,0.05c0.11-0.06,0.24-0.08,0.37-0.05c0.05-0.26-0.06-0.57,0.2-0.78c-0.02-0.02-0.04-0.05-0.07-0.08c0.16-0.25,0.38-0.5,0.35-0.84c0.13-0.11,0.27-0.21,0.4-0.32c0.06,0.03,0.12,0.07,0.21,0.12c0.13-0.23,0.24-0.45,0.37-0.69c0.13,0.03,0.28,0.07,0.43,0.11c1.79-2.19,1.16-4.35,4.72-3.04c0.18,0.42,0.23,0.83,0.84,0.72c0.1-0.11,0.22-0.23,0.34-0.36c0.29,0.02,0.6-0.07,0.85,0.2c0.37-0.05,0.77,0.08,1.15-0.1c1.09,0.79,2.34-0.11,3.64-0.09c0.15,0.15,0.3,0.3,0.46,0.46c0.31,0.06,0.58-0.04,0.8-0.3c0.19,0.12,0.45,0.08,0.58,0.3c0.13,0,0.25,0,0.37,0c0.05-0.08,0.1-0.17,0.16-0.28c0.66,0,2.07,0.27,2.8,0.18c0.04,0.07,0.09,0.15,0.11,0.18c1.69,0.2,4.03,0.2,5.6,0.2c0.05,0.05,0.11,0.11,0.18,0.18c0.12,0,0.25,0,0.36,0c0.17,0.13,1.19,0.9,1.49,0.93c0.62,0.66,1.45,1.08,1.98,1.82c-0.2,0.82,1.14,1.49,0.93,2.33c0.74,1.41-0.62,2.66-0.21,3.94c-0.3,0.24-0.71,2.82-0.71,3.02c-0.06,0.06-0.11,0.11-0.18,0.18c0,0.12,0,0.25,0,0.37c-0.07,0.07-0.12,0.12-0.18,0.18c0,0.12,0,0.24,0,0.38c-0.05,0.05-0.11,0.09-0.17,0.14c0,0.41-0.44,0.62-0.38,1.04c-0.16,0.3-0.36,0.57-0.61,0.81c-0.12-0.02-0.23-0.04-0.4-0.07c-0.34,0.18-0.54,0.85-0.78,1.16c-0.11,0-0.2,0-0.32,0c-0.1,0.21-0.7,0.74-0.77,0.92c-0.24,0.03-0.47,0-0.69-0.09c-0.47,0.22-0.47,0.22-0.83,0.09c-0.03-0.13-0.1-0.24-0.22-0.31c0-0.27,0-0.55,0-0.84c-0.05-0.05-0.11-0.09-0.17-0.15c-0.08-0.47,0.09-0.87,0.52-1.18c-0.04-0.19,0.3-0.31,0.21-0.58c0.37-0.16,0.24-0.97,0.54-1.21c-0.04-0.24,0.27-0.35,0.21-0.59c0.06-0.02,0.1-0.03,0.14-0.04c0.16-0.45,0.28-0.9,0.21-1.33c0.26-0.5,1.01-1.75,0.39-2.26c0-0.11,0-0.21,0-0.37c0.22-0.16,0.47-0.33,0.72-0.51c-0.1-0.34-0.21-0.68-0.54-0.89c0-0.2,0-0.39,0-0.56c0.74-0.84-0.47-2.43-1.32-2.96c-0.05,0.05-0.09,0.08-0.1,0.09c-0.4-0.2-0.87-0.25-1.22-0.54C64.78,258.84,63.5,258.09,62.36,258.32z"/><path class="inline-svg--fill-only" d="M87.34,299.08c-0.03,1.1,0.15,2.9-0.54,3.82c0.44,1.66-1.38,2.77-1.3,4.35c-0.4,0.24-0.59,0.55-0.56,0.93c-0.23,0.11-0.28,0.4-0.52,0.5c0,0.05-0.43,0.77-0.64,0.73c-0.06,0.16-0.11,0.32-0.19,0.54c-0.16,0.1-0.25,0.38-0.49,0.5c0,0.06,0,0.12,0,0.23c-0.11-0.03-0.21-0.06-0.32-0.09c-0.5,0.76-1.25,1.71-2.13,2.11c-0.02-0.02-0.05-0.05-0.11-0.1c-0.13,0.12-0.28,0.2-0.45,0.23c-0.13,0.59-0.6,0.89-1.11,1.15c0,0-0.03-0.03-0.07-0.07c0.01-0.01-0.87,0.55-0.89,0.64c-0.91,0.02-1.58,0.36-2.47,0.15c-0.01-0.04-0.02-0.08-0.03-0.12c-0.58-0.2-1.18-0.21-1.79-0.21c-0.02-0.05-0.03-0.11-0.05-0.17c-0.7-0.24-0.93-0.39-1.74-0.39c-0.12-0.14-0.27-0.31-0.41-0.48c-0.83,0.52-4.72-1.37-5.72-1.56c-0.23-0.37-0.97-0.61-1.28-0.96c0.04-0.25,0.08-0.51,0.12-0.76c0.3-0.31,0.62-0.59,0.96-0.85c0.2,0,1.54,0.24,1.85,0.18c0.09,0.09,0.18,0.18,0.28,0.28c1.27-0.12,2.75,0.67,3.76-0.37c0.19,0,0.37,0,0.59,0c0.76-1.43,2.19-2.35,2.34-4.12c0.59-0.43,0.02-1.51,0.53-2c0-0.51,0.19-0.75,0.22-1.24c0.05-0.05,0.11-0.11,0.16-0.16c0-1.15,0.25-2.46,0.18-3.6c0.06-0.05,0.13-0.11,0.19-0.15c0-0.28,0-0.52,0-0.77c0.05-0.05,0.11-0.11,0.17-0.17c0-0.17,0-0.35,0-0.57c0.06-0.04,0.14-0.09,0.19-0.12c0-1.62,1.66-3.39,1.66-5.31c0.19-0.18,0.37-0.37,0.55-0.55c-0.02-0.34,0.14-0.6,0.36-0.84c0-0.11,0-0.23,0-0.33c0.56-0.75,1.46-1.07,2.13-1.71c-0.31-0.78,0.91-3.68,1.99-2.61c0.27-0.14,0.4,0.24,0.66,0.19c0.02,0.06,0.03,0.1,0.04,0.16c0.1,0,0.2,0,0.26,0c0.79,0.58,1.65,0.99,1.77,2.03c0.05,0,0.12,0.01,0.18,0.02c0.23,0.23,0.46,0.46,0.72,0.72c0,0.17,0,0.38,0,0.62c0.06,0.04,0.14,0.09,0.18,0.11c0.15,1.39,0.31,2.2-0.16,3.53c0.27,0.42,0.15,0.94,0.19,1.43c0.06,0.02,0.11,0.05,0.13,0.05c0.09,0.43,0.17,0.85,0.25,1.26c0.05,0.01,0.09,0.02,0.13,0.04c0.3,0.82,0.03,1.66,0.03,2.51c-0.17,0.18-0.31,0.36-0.28,0.65c0.09,0.07,0.2,0.15,0.31,0.23c-0.03,0.02-0.05,0.04-0.08,0.06C87.19,298.78,87.25,298.91,87.34,299.08z"/><path class="inline-svg--fill-only" d="M17.02,264.01c0.05,0.05,0.1,0.11,0.16,0.18c0.49-0.04,0.92,0.3,1.39,0.18c0.08,0.08,0.14,0.14,0.19,0.19c2.5,0,5.19,1.41,7.84,1.02c0.72,0.43,1.47,0.02,1.69,1.19c0.5-0.02,0.8,0.28,1.07,0.66c0.48,0.09,0.93,0.27,1.35,0.51c0.01,0.03,0.01,0.07,0.03,0.12c0.11,0,0.21,0.01,0.33,0.01c0.01,0.05,0.02,0.09,0.03,0.14c0.49,0.12,0.88,0.35,1.28,0.66c0,0.07,0,0.16,0,0.26c0.12,0.12,0.24,0.24,0.38,0.38c-0.03,0.12-0.05,0.26-0.09,0.45c0.88,1.35-0.09,1.08-0.88,1.98c-2.65,0-4.99,1.83-7.76,0.96c-0.11,0.05-0.25,0.11-0.38,0.17c-0.34-0.26-0.76-0.32-1.08-0.57c-0.12,0-0.24,0-0.36,0c-0.07-0.06-0.13-0.13-0.2-0.19c-2.42,0-7.54,0.34-9.7-1.16c-0.28-1.46-2.86-2.19-2.69-3.99c-0.1-0.01-0.17-0.02-0.26-0.02c0.03-0.06,0.05-0.12,0.1-0.22c-0.06-0.02-0.14-0.04-0.22-0.06c0.02-0.02,0.05-0.05,0.07-0.07c-0.18,0-0.37,0-0.59,0c-0.42-0.65-1.02-1.27-1.02-2.07c-0.07-0.07-0.12-0.12-0.19-0.19c-0.05-0.92-0.19-1.71-0.19-2.7c0.7-0.77,1.53-1.32,2.25-2.05c0.76,0,1.38,0.69,1.74,1.34c0.56,0.19,0.92,0.24,1.43,0.53c0.07,0.18,0.16,0.38,0.24,0.59c0.41,0.04,1.55,1,1.71,1.12c0.03,0.18,0.08,0.45,0.13,0.74c0.12,0,0.25,0,0.36,0c0.12-0.19,0.24-0.38,0.37-0.58C16.01,263.73,16.5,263.9,17.02,264.01z"/><path class="inline-svg--fill-only" d="M66.83,161.86c0.07-0.07,0.11-0.11,0.17-0.17c0-0.77-0.35-1.26-0.35-2.05c-0.24-0.09-0.13-0.42-0.36-0.53c0.03-0.13-0.57-1.17-0.57-1.16c-0.12,0-0.22,0-0.35,0c0-0.53-0.37-0.37-0.62-0.75c-0.28,0.07-0.57-0.39-0.74-0.55c-0.09,0-0.18,0-0.27,0c-0.1-0.23-0.36-0.28-0.47-0.47c-1,0.4-1.66-0.45-2.59-0.45c-0.05-0.06-0.11-0.13-0.15-0.19c-0.18,0-0.34,0-0.49,0c-0.05-0.05-0.11-0.11-0.18-0.18c-1.17,0-2.26-0.33-3.41-0.37c-0.06-0.06-0.11-0.11-0.19-0.19c-0.92,0.07-3.19,0-3.87-0.73c-0.42,0-0.85,0-1.28,0c-0.89-0.76-2.23-0.47-3.24-0.37c-0.28-0.31-1.53-0.25-1.78,0.02c-0.67-0.25-2.36,0.07-2.94,0.37c-0.39-0.33-0.69-0.34-0.9-0.03c-1.2,0.19-2.8,0.15-3.2-1.28c0.55-0.87,0.99-1.48,1.72-2.22c0.93-0.13,1.52-0.77,2.49-0.73c0.56,0.7,3.84-0.72,4.85,0.09c1.28-0.25,2.66,0.09,3.97,0.09c0.18,0.13,0.33,0.25,0.48,0.37c0.83,0,1.64,0.37,2.5,0.37c0.07,0.07,0.12,0.12,0.18,0.18c0.15,0,0.3,0,0.48,0c0.02,0.05,0.03,0.1,0.05,0.17c0.1,0,0.2,0,0.29,0c0.07,0.07,0.12,0.13,0.2,0.2c0.26-0.01,1.74,0.2,1.95,0.37c1.21,0,2.27,0.37,3.4,0.37c0.44,0.13,0.89,0.27,1.32,0.42c0,0.01,0.01,0.06,0.03,0.12c0.16,0,0.32,0,0.48,0c0.06,0.07,0.11,0.13,0.17,0.19c1.22,0,3.81,1.65,4.87,2.48c-0.31,0.68,1.66,1.05,1.26,1.83c0.07,0.02,0.11,0.03,0.15,0.04c0.2,0.23,0.28,0.5,0.23,0.79c0.05,0.02,0.1,0.03,0.17,0.06c0,0.13,0,0.26,0,0.4c0.56,0.36,0.81,0.82,0.75,1.37c0.3,0.3,0.27,0.63,0.18,1.02c-0.17,0.07-0.36,0.15-0.53,0.23c0,0.17,0,0.3,0,0.43c0.06,0.06,0.12,0.12,0.18,0.18c0,1.06,0.1,2.91-1.3,2.91c0.26,0.4,0.19,1.17,0.19,1.61c-0.05,0.05-0.11,0.11-0.17,0.17c0,0.08,0,0.17,0,0.26c-0.37,0.5-1.05,1.17-1.14,1.81c-0.41,0.26-0.85,0.44-1.31,0.56c-0.03-0.03-0.06-0.06-0.1-0.09c-0.15,0.11-0.3,0.23-0.48,0.37c-0.3,0-0.63,0-0.99,0c-0.43-0.81-1.52-0.4-1.52-1.61c0.05-0.05,0.11-0.1,0.17-0.17c0-0.33,0-0.66,0-0.97c0.13-0.12,0.24-0.22,0.4-0.38c-0.01,0,0.06-0.01,0.13-0.02c0.21-0.51,1.92-2.31,1.72-2.83C66.87,162.87,66.83,162.34,66.83,161.86z"/><path class="inline-svg--fill-only" d="M43.4,169.57c-0.09,0-0.21,0-0.35,0c-0.01,0.04-0.02,0.08-0.04,0.16c-0.18,0.03-0.69,0.21-0.76,0.39c-0.16,0-0.32,0-0.47,0c-0.06,0.06-0.11,0.11-0.17,0.17c-0.08,0-0.17,0-0.29,0c-0.04,0.06-0.09,0.14-0.13,0.18c-0.15,0.01-0.25,0.01-0.35,0.02c-0.02,0.06-0.03,0.1-0.04,0.16c-0.13,0-0.26,0-0.38,0c-0.07,0.07-0.12,0.13-0.18,0.19c-1.14,0-2.04,0.35-3.08,0.71c-0.95-0.49-2.19,0.22-3.12,0.22c-0.04-0.05-0.09-0.11-0.12-0.15c-0.37-0.08-0.7-0.17-1.02-0.01c-0.15-0.16-0.28-0.29-0.41-0.42c-0.01,0.02-0.03,0.04-0.04,0.06c-1.02-0.54-1.17-0.52-2.14-1.26c0.08-0.58-0.42-0.73-0.73-1.03c0-0.22,0-0.43,0-0.67c0.04-0.01,0.09-0.03,0.15-0.04c0.21-0.89,1.09-1.57,1.16-2.54c0.03-0.01,0.09-0.03,0.17-0.06c0-0.1,0-0.22,0-0.38c0.11,0.05,0.17,0.08,0.22,0.11c0.35-0.2,0.72-0.41,1.12-0.64c0.32,0.29,0.68,0.39,1.1,0.28c0.07-0.21,0.14-0.42,0.2-0.62c0.23,0,0.42,0,0.61,0c0.73-0.81,2.62,0.89,2.45,1.71c0.05,0.02,0.09,0.03,0.14,0.04c0.47,0.95,1.9,2.37,2.96,1.19c0.41-0.02,0.87,0.09,1.2-0.34c0.61-0.08,2.43-1.69,2.93-1.5c0.42-0.31,0.97-0.44,1.27-0.89c0.41-0.08,1.43-0.51,1.76-0.81c0-0.97,1.18-0.96,1.41-1.9c0.9-0.73,2.25-1.5,2.19-2.9c0.21-0.21,0.41-0.41,0.63-0.63c0.04-0.32,0.08-0.66,0.13-1.05c0.02-0.02,0.09-0.07,0.15-0.11c0-0.68,0.4-0.99,0.88-1.47c0.49,0,0.98,0,1.48,0c0.1,0.42,0.36,0.7,0.77,0.83c0.09,0.49-0.05,0.93-0.43,1.3c0.38-0.06,0.62,0.08,0.8,0.32c0,0.18,0,0.36,0,0.55c-0.05,0.05-0.11,0.11-0.17,0.17c0,0.17,0,0.35,0,0.53c-0.76,0.97-1.15,2.01-2.03,2.88c-0.01,0.07-0.02,0.14-0.02,0.23c-0.07,0-0.15,0-0.24,0c-0.15,0.61-0.72,0.97-1.05,1.49c-0.37-0.04-0.63,0.16-0.91,0.32c0,0.06,0,0.12,0,0.19c-0.32,0.06-1.26,0.82-1.47,1.05c-0.08,1.74-4.57,2.14-4.99,3.55C43.87,169.26,43.63,169.4,43.4,169.57z"/><path class="inline-svg--fill-only" d="M59.65,72.32c0-0.17,0-0.33,0-0.5c-0.81-0.39-1.1-1.2-1.1-2c-0.32-0.36-0.35-0.43-0.37-0.75c-0.06-0.04-0.14-0.09-0.18-0.12c0-0.14,0-0.24,0-0.3c-0.49-0.41-0.67-1.01-1.02-1.51c0.15-0.96,0.4-1.12,1.07-1.88c0.21,0,0.43,0,0.64,0c0.04,0.04,1.73,0.58,1.6,0.58c0.01,0.05,0.02,0.09,0.04,0.15c0.16,0,0.32,0,0.47,0c0.07,0.07,0.12,0.12,0.19,0.19c0.14,0,0.29,0,0.47,0c0.04,0.06,0.1,0.14,0.13,0.19c0.16,0,0.29,0,0.42,0c0.02,0.05,0.03,0.1,0.06,0.17c0.13,0,0.26,0,0.4,0c0.02,0.07,0.04,0.12,0.06,0.19c0.1,0,0.2,0,0.29,0c0.1,0.17,0.19,0.31,0.28,0.45c0.21-0.03,0.43-0.06,0.63-0.09c0.09,0.08,0.15,0.15,0.22,0.21c0.09,0,0.18,0,0.23,0c0.15,0.17,0.27,0.32,0.4,0.47c0.72-0.46,1.25,0.45,1.95,0.45c0.02,0.05,0.04,0.1,0.06,0.17c0.08,0,0.17,0,0.32,0c0.03,0.06,0.07,0.14,0.09,0.19c0.75,0.08,1.2,0.5,1.65,1.05c0.91-0.45,2.6,1.03,2.63,1.97c0.05,0.04,0.13,0.09,0.18,0.13c0.1,0.34,0.02,0.62-0.24,0.85c-0.17-0.05-0.31-0.09-0.43-0.13c-0.06,0.06-0.1,0.1-0.17,0.17c0.03,0.12,0.06,0.26,0.1,0.44c-0.52,0.9-1.9,1.09-2.61,1.79c-0.39,0-0.78,0-1.17,0c-0.95,0.86-2.44,0.69-3.55,0.55c-0.93-0.93-2.75-1.53-3.41-2.75C59.77,72.61,59.83,72.34,59.65,72.32z"/></svg>',
		"logo_kurokawa_h" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 70"><path class="inline-svg--fill-only" d="M258.27,65.17c-3.18-0.92-4.52-3.59-5.93-6.43l-0.17-0.33c-0.2-0.39-0.32-0.86-0.45-1.36l-0.09-0.34c-0.67-2.45-0.67-2.45,1.45-3.81c0.1-0.07,0.21-0.13,0.31-0.19l1.61-0.96l-1.4-0.87c-0.63-0.39-1.34-0.59-2.13-0.59c-0.95,0-2.01,0.29-3.16,0.86c-0.93,0.46-1.91,0.83-2.95,1.23c-0.35,0.13-0.71,0.27-1.06,0.41c-0.65,0.25-1.3,0.52-1.94,0.79c-1.59,0.67-3.1,1.29-4.68,1.72c-2.01,0.54-4.17,0.72-6.2,0.83l-0.1,0c-1.04,0-1.52-0.93-1.53-1.85c-0.01-0.76-0.02-1.55,0.07-1.73c0.18-0.12,1.24-0.2,2.01-0.26c0.74-0.06,1.48-0.09,2.22-0.12c1.1-0.05,2.23-0.1,3.35-0.23c2.5-0.29,4.47-1.66,6.12-2.93c0.36-0.28,0.76-0.52,1.19-0.79c0.21-0.13,0.41-0.25,0.62-0.39l0.53-0.34l-0.08-0.63c-0.29-2.19-2.31-2.86-2.97-3.08c-2.13-0.7-4.23-1.3-6.46-1.94c-0.54-0.15-1.07-0.31-1.62-0.46c0.17-0.19,0.41-0.41,0.75-0.62c0.66-0.4,1.34-0.77,2.02-1.15c0.7-0.39,1.4-0.77,2.08-1.19c0.37-0.22,0.71-0.33,1.07-0.33c0.47,0,1.02,0.18,1.81,0.59c2.64,1.37,4.72,2.33,6.72,3.1c0.21,0.08,0.45,0.12,0.7,0.12c0.64,0,1.28-0.27,1.85-0.51c0.14-0.06,0.28-0.12,0.42-0.17c0.44-0.17,0.8-0.45,1.14-0.72c0.14-0.11,0.29-0.23,0.46-0.35l1.43-1.01l-2.51-1.13c-0.64-0.29-1.27-0.58-1.9-0.84c-2.45-1.04-4.9-2.08-7.35-3.11l-4.13-1.75c-0.12-0.05-0.24-0.11-0.35-0.17c-0.27-0.13-0.57-0.28-0.92-0.37c-0.83-0.22-1.51-0.78-1.94-1.58c-0.5-0.94-0.57-2.07-0.2-3.2l0.4-1.19c0.74-2.22,1.5-4.52,2.46-6.66c0.49-1.09,1.44-2.1,2.37-3.07l0.19-0.2c1.03-1.09,2.4-2.48,3.91-3.63c0.34-0.26,0.74-0.39,1.17-0.39c1.03,0,2.15,0.8,2.18,2c0.03,1.6,1.06,1.78,1.5,1.78c0.13,0,0.26-0.01,0.42-0.03l0.12-0.01c0.23-0.02,0.46-0.06,0.68-0.11c0.26-0.05,0.51-0.09,0.71-0.09c0.05,0,0.1,0,0.14,0.01c0.3,0.05,0.58,0.07,0.85,0.07c1.64,0,2.85-0.85,3.6-2.51c0.71-1.6,2.18-2.24,3.88-2.98c0.38-0.17,0.77-0.33,1.14-0.51c1.77-0.85,3.81-1.89,5.57-3.54c0.47-0.44,1.66-0.58,2.45-0.68c0.24-0.03,0.48-0.06,0.72-0.06c0.46,0,0.86,0.09,1.31,0.54c0.89,0.89,2.26,1.16,3.46,1.4l0.27,0.05c0.42,0.09,0.63,0.17,0.63,1.14c-0.12,0.19-0.54,0.54-0.73,0.7c-0.38,0.31-0.76,0.57-1.16,0.85c-0.4,0.27-0.8,0.54-1.17,0.85c-0.67,0.54-0.98,1.13-0.91,1.74c0.1,0.95,1.03,1.42,1.33,1.58c2.88,1.47,5.77,2.95,8.5,4.55c0.74,0.44,1.39,1.12,2.08,1.84c0.21,0.22,0.41,0.43,0.62,0.64c0.47,0.47,0.49,0.82,0.09,1.33c-0.2,0.26-0.39,0.53-0.58,0.8c-0.33,0.49-0.65,0.95-1.01,1.23c-2.12,1.64-2.23,4.09-2.3,5.71c-0.08,1.82-0.76,2.79-2.4,3.45c-1.43,0.58-2.79,1.32-4.1,2.04c-0.04,0.02-1.83,1.09-1.29,2.25c0.34,0.73,0.93,1.65,1.81,1.85c1.25,0.28,2.53,0.4,3.77,0.52l0.67,0.06c0.39,0.04,0.6,0.09,0.71,0.12c-0.02,0.11-0.07,0.3-0.19,0.62c-0.72,1.83-1.49,2.86-3.52,3.04c-1.99,0.18-3.92,0.77-5.79,1.35c-0.8,0.25-1.59,0.49-2.39,0.7l-0.67,0.18l-0.1,1.03l-0.06,0.76l0.71,0.28l0.64,0.24c0.48,0.18,0.96,0.36,1.45,0.54l0.95,0.33c2.15,0.74,4.17,1.44,5.91,2.89c1.24,1.03,3.22,1.09,4.68,1.13c1.78,0.05,3.68,0.07,5.82,0.07c2.19,0,4.39-0.02,6.58-0.05c0,0,0,0,0,0c0.89,0,1.3,0.19,1.76,0.78c0.46,0.59,1.14,0.88,1.74,1.13c0.13,0.06,0.27,0.11,0.4,0.17c-0.15,0.05-0.29,0.1-0.44,0.15c-1.21,0.41-2.35,0.79-3.48,0.86c-3.35,0.19-6.1,1.3-8.43,3.39c-0.61,0.55-1.29,0.8-2.13,0.8c-0.43,0-0.9-0.07-1.45-0.2c-2.5-0.61-4.95-1.57-7.71-3c-0.82-0.43-1.68-0.81-2.5-1.18c-1.29-0.57-2.63-1.17-3.79-1.93c-1.23-0.8-2.42-1.71-3.67-2.68c-0.6-0.46-1.21-0.93-1.85-1.41l-1.41-1.05l-0.19,1.74c-0.04,0.35-0.06,0.7-0.09,1.03c-0.05,0.67-0.1,1.24-0.22,1.78c-0.29,1.27-0.61,2.52-0.93,3.78c-0.36,1.43-0.72,2.87-1.05,4.31c-0.25,1.12-0.28,2.28-0.28,3.18C258.31,65.19,258.29,65.18,258.27,65.17z M264.02,37.62c-1.86,0-2.44,2.12-2.96,4.69l-0.55,2.73l7.4-5.99l-1.88-0.82C265.29,37.9,264.66,37.62,264.02,37.62z M248.44,26.6c-1.79,0-3.02,0.81-3.76,2.48l-0.48,1.07l1.13,0.3c1.17,0.32,2.34,0.64,3.5,0.96c2.66,0.74,5.41,1.5,8.13,2.14c2.21,0.53,4.47,0.87,6.67,1.21l1.26,0.19c0.21,0.03,0.42,0.05,0.63,0.05c1.24,0,2.08-0.71,2.25-1.89c0.21-1.53-0.53-2.69-2-3.1l-0.7-0.2c-1.29-0.37-2.58-0.74-3.88-1.07l-0.2-0.05c-1.42-0.36-2.88-0.74-4.36-0.99c-2.01-0.35-4.4-0.75-6.83-1C249.32,26.65,248.89,26.6,248.44,26.6z M260.98,19.02c-1.85,0-5.19,0.2-6.72,1.53l-1.14,1l1.37,0.66c2.78,1.33,5.75,1.96,9.36,1.96h0c2.27,0,4.56-0.25,6.51-0.5l1.07-0.14l-0.21-1.05C270.66,19.74,264.28,19.02,260.98,19.02z"/><path class="inline-svg--fill-only" d="M5.34,55.93c-0.93,0-1.89-0.22-2.94-0.67C2.12,55.14,2.04,55.01,2,54.92c-0.09-0.23-0.04-0.61,0.14-1.03c1.05-2.41,2.05-4.31,3.13-5.96c0.1-0.02,0.31-0.06,0.7-0.06c0.39,0,0.79,0.03,1.12,0.06c0.88,0.08,1.79,0.22,2.67,0.36c1.41,0.22,2.86,0.44,4.33,0.45c0,0,0,0,0,0c1.2,0,2.28-0.28,3.33-0.55c0.63-0.16,1.23-0.31,1.82-0.41c0.9-0.14,1.84-0.24,2.74-0.34c1.14-0.12,2.32-0.25,3.49-0.46c1.35-0.24,2.68-0.6,3.97-0.95c0.56-0.15,1.13-0.3,1.69-0.44l0.96-0.24l-0.52-2.16l-0.68-0.09C30.37,43.04,29.84,43,29.3,43c-1.47,0-2.98,0.27-4.48,0.8c-1.48,0.53-3.1,0.78-4.94,0.78c-0.41,0-0.83-0.01-1.24-0.04c-0.88-0.05-1.44-0.23-1.68-0.54c-0.27-0.34-0.31-1.04-0.11-2.07c0.15-0.81,0.32-1.46,0.51-2.04c0.25-0.73,0.5-0.79,0.86-0.79l0.13,0c0.49,0.03,0.97,0.05,1.46,0.05c2.73,0,5.36-0.56,7.82-1.67c0.81-0.37,1.66-0.87,2.51-1.5c0.66-0.49,0.72-1.55,0.52-2.13C30.38,33.07,29.35,33,29.04,33c-0.19,0-0.36,0.02-0.52,0.07c-0.82,0.24-1.65,0.48-2.48,0.71c-2.46,0.7-5.01,1.42-7.45,2.36c-0.48,0.19-0.91,0.27-1.31,0.27c-0.99,0-1.85-0.58-2.95-1.39c-2.53-1.86-3.29-4.58-4.1-7.47c-0.17-0.59-0.33-1.19-0.52-1.77c-0.52-1.66-0.88-3.42-1.23-5.13l-0.25-1.2c-0.2-0.94,0.01-1.72,0.64-2.29l1.55-1.44c2.45-2.27,4.98-4.62,7.56-6.81c0.17-0.14,0.65-0.3,1.2-0.3c0.22,0,0.43,0.02,0.58,0.07C20.12,8.8,20.48,8.9,20.84,9c2.17,0.61,4.21,1.19,5.94,2.47c0.49,0.37,0.98,0.54,1.5,0.54c0.47,0,0.95-0.14,1.55-0.46c0.61-0.33,1.55-0.37,2.47-0.37l0.79,0c3.18,0,6.32-0.46,9.35-0.91c0.68-0.1,1.36-0.2,2.04-0.29c0.62-0.09,1.29-0.13,2.03-0.13c1.31,0,2.69,0.14,4.02,0.27c0.42,0.04,0.84,0.08,1.26,0.12c1.28,0.11,2.67,0.42,4.14,0.91c1.37,0.46,1.93,0.82,1.86,2.59c-0.03,0.7,0.36,1.28,0.67,1.74c0.11,0.16,0.22,0.32,0.3,0.48c0.06,0.12,0.12,0.23,0.19,0.35c0.06,0.11,0.15,0.27,0.19,0.36c-0.25,1.6-0.52,3.2-0.79,4.8c-0.41,2.43-0.84,4.95-1.17,7.44c-0.12,0.91-0.62,1.21-1.64,1.74l-0.11,0.06c-1.2,0.63-2.57,0.92-4.32,0.92c-0.99,0-2-0.09-3.12-0.2c-0.47-0.04-0.94-0.12-1.4-0.2c-0.77-0.13-1.58-0.26-2.4-0.26l-0.14,0c-1.78,0.03-1.96,1.52-2.03,2.09c-0.02,0.15-0.05,0.37-0.08,0.44l-0.7,1.38l1.53,0.1l2.36,0.11c1.9,0.09,3.74,0.17,5.58,0.23c0.44,0.02,0.94,0.15,1.31,1.01c0.05,0.12,0.08,0.2,0.09,0.25c-0.07,0.03-0.19,0.07-0.41,0.1l-0.9,0.12c-1.36,0.17-2.77,0.34-4.13,0.76c-0.8,0.24-1.22,0.98-1.59,1.63c-0.12,0.2-0.23,0.41-0.36,0.58l-0.45,0.6l1.02,1.34l0.58-0.08c0.34-0.05,0.69-0.11,1.03-0.17c0.71-0.13,1.39-0.25,2.04-0.25l0.11,0c0.81,0,1.65,0.05,2.46,0.1c0.84,0.05,1.71,0.1,2.58,0.1c0.2,0,0.4,0,0.6-0.01c1.34-0.04,2.68-0.22,3.97-0.39c0.52-0.07,1.04-0.14,1.56-0.2c0,0,6.81-0.79,8.33-0.96c-1.96,2.83-4.04,4.06-6.85,4.06c-0.2,0-0.41-0.01-0.62-0.02c-0.76-0.05-1.56-0.07-2.37-0.07c-2.86,0-5.65,0.29-7.77,0.55c-1.69,0.2-3.36,0.63-4.96,1.04c-0.95,0.24-1.93,0.49-2.89,0.69c-1.41,0.29-2.82,0.54-4.23,0.8c-1.71,0.31-3.47,0.63-5.2,1c-3.42,0.74-7.05,1.55-10.57,2.56c-3.33,0.95-6.68,2.03-9.92,3.07c-1.29,0.42-2.58,0.83-3.88,1.24c-0.5,0.16-0.92,0.33-1.31,0.52C7.1,55.72,6.24,55.93,5.34,55.93z M22.5,29.91l-0.36,1.77l0.89,0.26c0.17,0.05,0.34,0.12,0.52,0.19c0.44,0.17,0.94,0.37,1.48,0.37c0.13,0,0.26-0.01,0.38-0.03c0.94-0.17,1.81-0.54,2.65-0.89c0.21-0.09,0.43-0.18,0.64-0.27c2.04-0.82,2.4-1.47,1.99-3.64l-0.23-1.23L22.5,29.91z M47.5,24.23c-1.47,0.11-2.99,0.23-4.48,0.61c-0.71,0.18-1.21,0.7-1.64,1.15c-0.14,0.15-0.29,0.3-0.44,0.43l-0.44,0.38l0.32,1.71l0.49,0.21c0.08,0.03,0.16,0.08,0.24,0.13c0.3,0.17,0.68,0.39,1.15,0.39h0.08l0.16-0.02c1.95-0.33,3.58-0.65,5.2-1.11c0.72-0.21,1-0.89,1.22-1.45c0.06-0.14,0.11-0.29,0.18-0.41l0.49-0.9l-0.91-0.47c-0.08-0.04-0.17-0.1-0.25-0.16c-0.31-0.21-0.73-0.49-1.26-0.49h-0.04L47.5,24.23z M26.8,18l-0.95,0.25c-0.49,0.13-0.97,0.26-1.46,0.39c-2.37,0.67-2.21,3.27-2.14,4.39c0.14,2.25,1.73,2.42,2.22,2.42l0,0c0.26,0,0.55-0.04,0.85-0.12c0.99-0.26,2.16-0.58,3.31-1.05c1.09-0.44,2.67-1.08,2.71-3.06c0.02-0.69,0.01-1.37,0.01-2.11l0-2.36L26.8,18z M40.84,17.45c0.14,0.32,0.25,0.67,0.35,1c0.3,0.95,0.59,1.85,1.44,2.12C43.33,20.8,44.1,20.9,45,20.9c0.59,0,1.21-0.05,1.92-0.14c1.36-0.18,2.28-1.42,2.24-2.99c-0.02-1.06-0.68-1.72-1.7-1.72c-0.15,0-0.3,0.01-0.45,0.03c-0.07,0.01-0.13,0.02-0.19,0.02c-0.6-0.04-1.25-0.06-2.09-0.06c-0.42,0-0.86,0-1.33,0.01c-0.51,0.01-1.05,0.01-1.63,0.01h-1.52L40.84,17.45z"/><path class="inline-svg--fill-only" d="M184.44,62.71c-2.12,0-4.07-0.35-5.96-1.07c-0.35-0.13-0.72-0.4-1.11-0.69c-0.19-0.14-0.39-0.28-0.59-0.42l-6.85-4.56c-0.14-0.09-0.28-0.15-0.37-0.18c-0.17-0.13-0.47-0.34-0.66-0.51c0.2-0.21,0.51-0.48,0.64-0.59c0.34-0.3,0.63-0.62,0.9-0.93c0.72-0.81,1.16-1.27,1.94-1.28c0.38-0.01,0.75-0.03,1.13-0.04c0.34-0.02,0.68-0.03,1.02-0.04c1.27-0.03,2.21-0.11,2.8-0.8c0.58-0.67,0.51-1.61,0.39-2.52c-0.26-2.01,0.11-3.92,0.55-5.68c0.08-0.28,0.18-0.66,0.03-1.07c-0.57-1.57,0.27-2.33,1.81-3.53l0.4-0.31c1.53-1.22,3.24-1.79,5.4-1.79c1.16,0,2.42,0.16,4.1,0.5c2.52,0.52,5.08,0.79,7.61,0.79c2,0,4.02-0.17,6-0.49c0.17-0.03,0.34-0.04,0.52-0.04c0.74,0,1.6,0.21,2.36,0.57c1.9,0.89,3.79,1.91,5.63,2.9c0.82,0.44,1.63,0.88,2.45,1.31c0.28,0.26,0.44,1.66,0.2,2c-1.1,0.75-1.44,1.78-0.98,3.11c0.31,0.89,0.57,1.83,0.83,2.74c0.2,0.71,0.4,1.41,0.62,2.11c0.35,1.12,1.22,1.74,2.45,1.75c3.52,0.04,7.01,0.13,10.02,0.23c-0.21,0.18-0.43,0.36-0.65,0.53c-0.53,0.43-1.07,0.87-1.58,1.36c-0.52,0.5-1.23,0.61-2.05,0.74c-0.41,0.06-0.83,0.13-1.26,0.25c-0.57,0.16-1.14,0.33-1.71,0.5c-0.92,0.27-1.87,0.56-2.8,0.78c-0.88,0.21-1.78,0.35-2.72,0.5c-0.08,0.01-0.16,0.03-0.24,0.04l-0.03-0.19l-3.26,0.22c-2.04,0.14-4.09,0.28-6.13,0.38c-0.1,0-0.19,0.01-0.29,0.01c-0.65,0-1.32-0.11-1.83-0.2c-0.24-0.04-0.47-0.06-0.69-0.06c-1.44,0-2.46,0.85-3.27,1.52c-0.16,0.13-0.31,0.26-0.47,0.38c-1.08,0.84-2.29,0.93-3.77,0.95l-1.08,0.01c-1.68,0.01-3.43,0.03-5.13,0.36C187.25,62.56,185.83,62.71,184.44,62.71z M195.04,42.4c-0.42,0-0.84,0.03-1.25,0.1c-1.01,0.17-1.52,1.61-1.55,2.31c-0.08,1.61-0.08,3.32,0,5.25c0.03,0.64,0.38,1.8,1.23,2.15c0.79,0.33,1.58,0.53,2.5,0.76c0.36,0.09,0.73,0.18,1.13,0.29l1.41,0.39l-0.15-1.46c-0.04-0.4-0.09-0.77-0.13-1.12c-0.09-0.71-0.16-1.33-0.18-1.93c-0.02-0.64-0.01-1.28,0.01-1.91c0.01-0.63,0.03-1.25,0.01-1.88c-0.03-1.18-0.06-2.4-1.03-2.68C196.41,42.49,195.74,42.4,195.04,42.4z M204.26,42.57c-0.37,0-0.8,0.04-1.34,0.11L202,42.81l0.06,0.92c0.02,0.28,0.03,0.57,0.04,0.86c0.03,0.68,0.06,1.38,0.16,2.09c0.16,1.12,0.36,2.23,0.56,3.37c0.09,0.5,0.41,2.35,0.41,2.35h5.32l-0.2-1.17c-0.11-0.63-0.21-1.25-0.3-1.84c-0.22-1.34-0.42-2.6-0.68-3.87C207.06,43.99,206.46,42.57,204.26,42.57z M180.53,52.41l1.85-0.14c0.6-0.05,1.16-0.1,1.71-0.15c1.09-0.1,2.03-0.2,2.96-0.2c0,0,0.22,0,0.22,0c0.85,0,1.42-0.2,1.81-0.61c0.52-0.54,0.57-1.26,0.54-1.96c-0.04-1.06-0.08-2.26,0.1-3.33c0.39-2.24-0.36-3.52-2.45-4.16l-0.77-0.23L180.53,52.41z"/><path class="inline-svg--fill-only" d="M123.21,61.42c-0.14,0-0.45-0.14-0.54-0.24c-1.75-3.32-2.29-6.28-1.67-9.27c0.03-0.16,0.07-0.25,0.09-0.3c2.11-1.54,2.45-3.97,2.67-5.58c0.59-4.22,1.09-8.03,1.27-11.92c0.16-3.58-0.03-6.59-0.58-9.19c-0.13-0.61-0.27-1.21-0.42-1.8c-0.4-1.64-0.78-3.2-0.8-4.84c-0.02-1.03-0.68-1.9-1.27-2.68c-0.14-0.18-0.27-0.36-0.4-0.54c-0.21-0.3-0.45-0.54-0.72-0.78c0.22-0.17,0.42-0.32,0.64-0.45c0.69-0.44,1.39-0.87,2.08-1.3c1.34-0.82,2.73-1.68,4.05-2.62c0.76-0.55,1.79-0.85,2.9-0.85c1.81,0,3.51,0.77,4.42,2.01l0.39,0.54c0.33,0.47,0.68,0.96,1.08,1.42c1.16,1.35,1.41,2.85,0.85,5.16c-0.66,2.75-1.03,5.15-1.1,7.35c-0.11,2.95,0.03,5.93,0.15,8.82l0.07,1.62c0.03,0.67,0.13,1.31,0.24,1.94c0.13,0.77,0.25,1.49,0.21,2.17c-0.09,1.68-0.28,3.39-0.46,5.05c-0.15,1.37-0.3,2.8-0.41,4.21c-0.14,1.87-0.43,4.05-1.57,6.03c-1.04,1.81-2.26,2.91-3.84,3.45c-1.02,0.35-2.03,0.77-3,1.17c-0.7,0.29-1.41,0.58-2.12,0.85C124.72,61.08,123.93,61.37,123.21,61.42z"/><path class="inline-svg--fill-only" d="M190.56,34.29c-1.02,0-2.03-0.29-3.29-0.94c-0.53-0.28-1.08-0.52-1.63-0.76c-0.6-0.26-1.16-0.51-1.69-0.8c-0.96-0.52-1.92-1.1-2.85-1.66c-0.45-0.27-0.91-0.55-1.36-0.81c-0.27-0.16-0.56-0.32-0.84-0.45c-1.03-0.47-1.68-1.08-1.93-1.83c-0.29-0.83-0.12-1.85,0.49-3.06c1.05-2.05,1.99-4.18,2.91-6.25c0.5-1.14,1.01-2.28,1.53-3.41c0.35-0.76,0.72-1.55,1.21-2.16c0.68-0.84,1.49-1.23,2.55-1.23c0.57,0,1.21,0.11,1.95,0.34c0.61,0.19,1.22,0.39,1.83,0.6c1.08,0.37,2.19,0.75,3.33,1.02c0.99,0.23,2,0.33,2.97,0.41c0.48,0.04,0.97,0.09,1.45,0.15c0.62,0.08,1.25,0.15,1.87,0.22c2.72,0.3,5.29,0.59,7.69,1.71c0.97,0.45,1.49,1.23,1.75,2.61c0.52,2.74,0.99,5.55,1.43,8.27l0.17,1.01c0.09,0.56,0.14,1.13,0.2,1.73c0.01,0.1,0.02,0.21,0.03,0.31l-0.04,0.43l0,0.38c0,0.32-0.01,0.63,0.01,0.95c0.06,0.96-0.15,1.7-0.62,2.19c-0.66,0.7-1.74,0.84-2.53,0.84h-0.16c-2.01,0-4.07-0.05-6.06-0.11c-1.72-0.05-3.44-0.09-5.16-0.1l-0.17,0c-1.31,0-2.74,0.11-4.24,0.34C191.08,34.27,190.82,34.29,190.56,34.29z M195.42,23.93c-0.13,0-0.27,0.01-0.4,0.03c-1.77,0.18-8.79,0.89-8.79,0.89l1.27,1.46c1.13,1.29,2.53,2.69,4.92,2.98c0.89,0.11,1.78,0.38,2.72,0.67c0.68,0.21,1.39,0.43,2.12,0.58c0.28,0.06,0.57,0.09,0.88,0.09c0.58,0,1.19-0.11,1.71-0.31c0.58-0.23,1.05-0.61,1.5-0.99c0.18-0.15,0.37-0.31,0.58-0.46l0.65-0.48l-0.34-0.74c-0.04-0.1-0.08-0.21-0.12-0.33c-0.15-0.46-0.35-1.09-0.98-1.36c-1.43-0.61-2.91-1.14-4.34-1.65l-0.79-0.28C195.83,23.96,195.64,23.93,195.42,23.93z M191.91,15.7c-1.75,0-2.53,1.23-3.24,2.6l-0.56,1.08l10.34,3v-1.33c0-0.15,0.01-0.3,0.01-0.46c0.02-0.39,0.03-0.83-0.03-1.28c-0.43-2.9-2.4-3.34-3.54-3.34c-0.29,0-0.61,0.03-0.94,0.08c-0.01-0.01-0.03-0.01-0.05-0.02c-0.08-0.03-0.16-0.05-0.24-0.07C192.91,15.78,192.37,15.7,191.91,15.7z"/><path class="inline-svg--fill-only" d="M105.45,48.42c-0.44,0-0.75-0.13-1.02-0.43c-0.44-0.48-0.67-0.96-0.67-1.16c0.01-0.82,0.1-1.63,0.2-2.5c0.1-0.89,0.21-1.82,0.22-2.75c0.01-1.2-0.17-2.38-0.34-3.52c-0.05-0.33-0.1-0.65-0.14-0.98c-0.35-2.6-0.52-4.59,0.58-6.58c0.46-0.83,0.45-1.81,0.45-2.67c0-0.19,0-0.38,0-0.56l0.03-0.91c0.05-1.4,0.1-2.84-0.1-4.27c-0.15-1.12-0.74-2.37-1.57-3.34c-1.26-1.47-1.17-1.8-0.18-2.7c1.84-1.68,3.74-3.41,6.21-3.92c0.48-0.1,0.96-0.16,1.44-0.22c0.22-0.03,0.43-0.06,0.65-0.09l0.13,0c1.99,0,3.83,0.7,5.65,2.13c0.42,0.33,0.47,0.41,0.38,0.86c-0.23,1.08-0.26,2.18-0.28,3.24c-0.02,0.65-0.03,1.26-0.09,1.87c-0.12,1.28-0.27,2.56-0.42,3.85c-0.2,1.67-0.4,3.39-0.54,5.1c-0.07,0.87-0.18,1.74-0.28,2.62c-0.36,2.97-0.74,6.05,0.27,9.19c0.4,1.23,0.06,2.2-1.05,3.05c-2.82,2.16-5.57,3.64-8.41,4.51C106.12,48.35,105.76,48.42,105.45,48.42z"/><path class="inline-svg--fill-only" d="M90.36,54.43c-0.93,0-1.54-0.67-2.43-1.78c-0.14-0.17-0.28-0.35-0.42-0.51c-1.17-1.39-2.26-2.95-3.24-4.65c-0.45-0.77-0.76-1.79-0.88-2.87c-0.17-1.56-0.27-3.16-0.36-4.72c-0.06-1-0.12-1.99-0.2-2.99l-0.04-0.57c-0.11-1.45-0.22-2.94-0.53-4.41c-0.08-0.39-0.03-0.52,0.37-0.94c0.34-0.35,0.68-0.7,1.01-1.05c1.04-1.07,2.11-2.17,3.09-3.35c0.81-0.98,1.43-2.1,1.74-3.17c0.65-2.26,2.25-2.85,5.35-3.19c0.25,0.07,0.52,0.13,0.81,0.21c0.9,0.22,1.91,0.48,2.89,0.84c0.8,0.29,1.15,0.66,0.84,1.82c-0.19,0.74-0.39,1.49-0.58,2.23c-0.41,1.54-0.81,3.09-1.19,4.64c-0.77,3.19-0.44,6.38,0.98,9.48c0.23,0.49,0.48,0.98,0.73,1.46c0.23,0.44,0.46,0.87,0.66,1.32c0.33,0.72,0.24,0.8-0.26,1.06c-2.52,1.34-3.78,3.7-3.54,6.66c0.16,2.02-2.25,3.78-3.94,4.33C90.9,54.38,90.62,54.43,90.36,54.43z"/><path class="inline-svg--fill-only" d="M161.67,57.43c-0.74,0-1.66-0.42-2.55-0.82c-0.3-0.14-0.6-0.27-0.89-0.4c-1.09-0.45-1.63-1.17-1.79-2.41c-0.17-1.26-0.54-2.48-0.89-3.66c-0.15-0.5-0.31-1.01-0.44-1.51c-0.02-0.06-0.03-0.11-0.04-0.17l0.02-0.21c0.02-0.23,0.03-0.47,0.03-0.71c0.01-0.41,0.02-0.8,0.1-1.12c0.09-0.05,0.23-0.1,0.3-0.11c0.19,0.01,0.39,0.01,0.6,0.01c3.02,0,5.89-0.94,9.02-2.97c0.78-0.5,1.58-0.98,2.38-1.45c1.29-0.77,2.63-1.56,3.88-2.48c0.9-0.66,1.62-1.5,2.32-2.31c0.35-0.4,0.7-0.81,1.07-1.19c0.78-0.8,1.61-1.62,2.53-2.49c-0.04,1.32-0.58,2.56-1.15,3.86c-0.24,0.54-0.48,1.08-0.68,1.64l-0.07,0.18c-0.3,0.83-0.47,1.18-0.92,1.36c-0.48,0.19-0.74,0.66-0.82,0.99c-0.28,1.2-1.06,2.19-1.87,3.23c-0.71,0.9-1.44,1.83-1.91,2.96c-0.04,0.1-0.13,0.22-0.22,0.29c-1.67,1.33-2.18,3.22-2.59,4.74c-0.78,2.9-2.54,4.5-5.24,4.74C161.78,57.43,161.73,57.43,161.67,57.43z"/><path class="inline-svg--fill-only" d="M170.31,22.56c-0.66,0-1.22-0.11-1.73-0.33c-0.25-0.11-0.51-0.22-0.76-0.32c-0.55-0.23-1.07-0.44-1.54-0.71c-1.16-0.64-2.58-1.3-4.23-1.3c-0.59,0-1.19,0.09-1.77,0.25c-0.15,0.04-0.29,0.07-0.4,0.07c-0.15,0-0.31,0-0.32-0.63c0-0.59-0.34-1.03-0.59-1.36c-0.58-0.78-0.51-1.43,0.16-2.02l0.63-0.55c1-0.87,2.04-1.78,2.97-2.78c0.3-0.32,0.6-0.48,0.92-0.48c0.11,0,0.22,0.02,0.34,0.05c2.86,0.79,5.76,1.66,8.56,2.49l1.5,0.45l-0.15,1.19c-0.18,1.42-0.35,2.76-0.5,4.09c-0.09,0.84-0.76,1.63-1.48,1.74C171.25,22.51,170.76,22.56,170.31,22.56z"/><path class="inline-svg--fill-only" d="M64.17,59.62c-0.48,0-0.97-0.04-1.48-0.12c-0.21-0.17-0.61-0.84-0.77-1.45c-0.54-2.18-1.87-3.59-4.06-4.32c-0.28-0.09-0.6-0.33-0.93-0.57c-0.07-0.05-0.15-0.11-0.22-0.16c-0.14-0.58-0.37-1.95-0.47-2.75c0.05-0.02,0.11-0.05,0.16-0.07c0.76-0.34,1.48-0.66,2.21-0.83c0.72-0.17,1.49-0.22,2.31-0.27c0.37-0.02,0.75-0.05,1.12-0.08l0.19,0c3.61,0,6.13,1.98,8.79,4.95c0.38,0.42,0.25,1.73-0.39,2.49C68.83,58.54,66.66,59.62,64.17,59.62z"/><path class="inline-svg--fill-only" d="M19.41,63.61c-1.47-0.1-2.97-0.33-4.42-0.55l-0.55-0.08c-0.66-0.1-1.31-0.22-1.97-0.34c-1.01-0.19-2.05-0.38-3.11-0.49c-1.26-0.14-1.54-0.39-1.72-0.93c-0.15-0.44,0-0.77,0.67-1.51c0.42-0.46,0.79-0.93,1.16-1.42c1.02-1.33,2.35-1.89,4.44-1.89c0.76,0,1.57,0.07,2.35,0.14l0.19,0.02c0.65,0.06,1.3,0.09,1.91,0.09c2.42,0,4.59-0.43,6.57-1.31c-0.65,0.69-1.3,1.34-2.01,1.94c-1.71,1.44-2.66,3.31-2.89,5.71c-0.06,0.64-0.24,0.64-0.51,0.64L19.41,63.61z"/><path class="inline-svg--fill-only" d="M163.37,35.71c-0.51,0-1.06-0.12-1.6-0.36c-1.74-0.76-3.05-1.95-3.79-3.43c-0.26-0.52-0.22-1.37-0.18-2.19c0.02-0.33,0.03-0.65,0.03-0.96c0-0.15,0.07-0.37,0.14-0.6c0.08-0.25,0.16-0.53,0.21-0.84c0.35-2.52,1.1-2.63,3.93-3.08l0.7-0.11l0.07-0.02c0.17,0.03,0.63,0.51,0.9,0.81c0.3,0.32,0.6,0.65,0.96,0.93c0.61,0.49,1.12,1.17,1.66,1.89c0.18,0.24,0.36,0.47,0.54,0.7c0.79,1.01,0.79,1.84-0.01,2.98c-0.56,0.79-0.92,1.52-1.11,2.21C165.44,35.01,164.62,35.71,163.37,35.71z"/><path class="inline-svg--fill-only" d="M46.5,58.44c-0.61,0-1.13-0.09-1.44-0.26c-1.4-0.76-1.95-1.61-2.11-3.27c-0.17-1.77-1.29-2.81-2.37-3.69c0.04-0.01,0.08-0.03,0.12-0.04c1-0.36,1.95-0.71,2.86-0.76c0.57-0.03,1.14-0.05,1.71-0.05c1.3,0,2.63,0.07,3.92,0.14c0.71,0.04,1.41,0.08,2.12,0.1c0.04,0.02,0.2,0.11,0.2,0.11c0.53,0.29,0.94,1.1,1.03,2.05c0.1,0.95-0.14,1.85-0.59,2.24c-0.9,0.77-1.76,1.54-2.42,2.48C49.22,57.96,47.92,58.44,46.5,58.44z"/><path class="inline-svg--fill-only" d="M34.69,61.05c-0.33,0-0.66-0.08-0.98-0.23c-1.45-0.71-2.9-0.94-4.26-1.12c-1.14-0.15-1.33-0.31-1.36-0.34c-0.03-0.05-0.1-0.29,0.15-1.37c0.12-0.54,0.18-1.07,0.24-1.59l0.06-0.49c0.09-0.75,0.52-1.18,1.16-1.18c2.61,0,4.89-0.37,6.99-1.11c0.11,0.01,0.19,0.01,0.28,0.02c0.15,0.01,0.32,0.02,0.49,0.02h0.22l0.06-0.03c0.02,0.05,0.04,0.11,0.06,0.19c0.23,0.76,0.58,1.46,0.91,2.13c0.25,0.5,0.48,0.98,0.66,1.46c0.24,0.64,0.21,0.81,0.2,0.83c-0.01,0-0.13,0.14-0.82,0.4c-0.68,0.25-1.34,0.71-1.82,1.24C36.27,60.63,35.45,61.05,34.69,61.05z"/></svg>',
		"logo_kurokawa_v" : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 270"><path class="inline-svg--fill-only" d="M19.34,53.93c-0.93,0-1.89-0.22-2.94-0.67c-0.28-0.12-0.36-0.25-0.39-0.34c-0.09-0.23-0.04-0.61,0.14-1.03c1.05-2.41,2.05-4.31,3.13-5.96c0.1-0.02,0.31-0.06,0.7-0.06c0.39,0,0.79,0.03,1.12,0.06c0.88,0.08,1.79,0.22,2.67,0.36c1.41,0.22,2.86,0.44,4.33,0.45c0,0,0,0,0,0c1.2,0,2.28-0.28,3.33-0.55c0.63-0.16,1.23-0.31,1.82-0.41c0.9-0.14,1.84-0.24,2.74-0.34c1.14-0.12,2.32-0.25,3.49-0.46c1.35-0.24,2.68-0.6,3.97-0.95c0.56-0.15,1.13-0.3,1.69-0.44l0.96-0.24l-0.52-2.16l-0.68-0.09C44.37,41.04,43.84,41,43.3,41c-1.47,0-2.98,0.27-4.48,0.8c-1.48,0.53-3.1,0.78-4.94,0.78c-0.41,0-0.83-0.01-1.24-0.04c-0.88-0.05-1.44-0.23-1.68-0.54c-0.27-0.34-0.31-1.04-0.11-2.07c0.15-0.81,0.32-1.46,0.51-2.04c0.25-0.73,0.5-0.79,0.86-0.79l0.13,0c0.49,0.03,0.97,0.05,1.46,0.05c2.73,0,5.36-0.56,7.82-1.67c0.81-0.37,1.66-0.87,2.51-1.5c0.66-0.49,0.72-1.55,0.52-2.13C44.38,31.07,43.35,31,43.04,31c-0.19,0-0.36,0.02-0.52,0.07c-0.82,0.24-1.65,0.48-2.48,0.71c-2.46,0.7-5.01,1.42-7.45,2.36c-0.48,0.19-0.91,0.27-1.31,0.27c-0.99,0-1.85-0.58-2.95-1.39c-2.53-1.86-3.29-4.58-4.1-7.47c-0.17-0.59-0.33-1.19-0.52-1.77c-0.52-1.66-0.88-3.42-1.23-5.13l-0.25-1.2c-0.2-0.94,0.01-1.72,0.64-2.29l1.55-1.44c2.45-2.27,4.98-4.62,7.56-6.81c0.17-0.14,0.65-0.3,1.2-0.3c0.22,0,0.43,0.02,0.58,0.07C34.12,6.8,34.48,6.9,34.84,7c2.17,0.61,4.21,1.19,5.94,2.47c0.49,0.37,0.98,0.54,1.5,0.54c0.47,0,0.95-0.14,1.55-0.46c0.61-0.33,1.55-0.37,2.47-0.37l0.79,0c3.18,0,6.32-0.46,9.35-0.91c0.68-0.1,1.36-0.2,2.04-0.29c0.62-0.09,1.29-0.13,2.03-0.13c1.31,0,2.69,0.14,4.02,0.27c0.42,0.04,0.84,0.08,1.26,0.12c1.28,0.11,2.67,0.42,4.14,0.91c1.37,0.46,1.93,0.82,1.86,2.59c-0.03,0.7,0.36,1.28,0.67,1.74c0.11,0.16,0.22,0.32,0.3,0.48c0.06,0.12,0.12,0.23,0.19,0.35c0.06,0.11,0.15,0.27,0.19,0.36c-0.25,1.6-0.52,3.2-0.79,4.8c-0.41,2.43-0.84,4.95-1.17,7.44c-0.12,0.91-0.62,1.21-1.64,1.74l-0.11,0.06c-1.2,0.63-2.57,0.92-4.32,0.92c-0.99,0-2-0.09-3.12-0.2c-0.47-0.04-0.94-0.12-1.4-0.2c-0.77-0.13-1.58-0.26-2.4-0.26l-0.14,0c-1.78,0.03-1.96,1.52-2.03,2.09c-0.02,0.15-0.05,0.37-0.08,0.44l-0.7,1.38l1.53,0.1l2.36,0.11c1.9,0.09,3.74,0.17,5.58,0.23c0.44,0.02,0.94,0.15,1.31,1.01c0.05,0.12,0.08,0.2,0.09,0.25c-0.07,0.03-0.19,0.07-0.41,0.1l-0.9,0.12c-1.36,0.17-2.77,0.34-4.13,0.76c-0.8,0.24-1.22,0.98-1.59,1.63c-0.12,0.2-0.23,0.41-0.36,0.58l-0.45,0.6l1.02,1.34l0.58-0.08c0.34-0.05,0.69-0.11,1.03-0.17c0.71-0.13,1.39-0.25,2.04-0.25l0.11,0c0.81,0,1.65,0.05,2.46,0.1c0.84,0.05,1.71,0.1,2.58,0.1c0.2,0,0.4,0,0.6-0.01c1.34-0.04,2.68-0.22,3.97-0.39c0.52-0.07,1.04-0.14,1.56-0.2c0,0,6.81-0.79,8.33-0.96c-1.96,2.83-4.04,4.06-6.85,4.06c-0.2,0-0.41-0.01-0.62-0.02c-0.76-0.05-1.56-0.07-2.37-0.07c-2.86,0-5.65,0.29-7.77,0.55c-1.69,0.2-3.36,0.63-4.96,1.04c-0.95,0.24-1.93,0.49-2.89,0.69c-1.41,0.29-2.82,0.54-4.23,0.8c-1.71,0.31-3.47,0.63-5.2,1c-3.42,0.74-7.05,1.55-10.57,2.56c-3.33,0.95-6.68,2.03-9.92,3.07c-1.29,0.42-2.58,0.83-3.88,1.24c-0.5,0.16-0.92,0.33-1.31,0.52C21.1,53.72,20.24,53.93,19.34,53.93z M36.5,27.91l-0.36,1.77l0.89,0.26c0.17,0.05,0.34,0.12,0.52,0.19c0.44,0.17,0.94,0.37,1.48,0.37c0.13,0,0.26-0.01,0.38-0.03c0.94-0.17,1.81-0.54,2.65-0.89c0.21-0.09,0.43-0.18,0.64-0.27c2.04-0.82,2.4-1.47,1.99-3.64l-0.23-1.23L36.5,27.91z M61.5,22.23c-1.47,0.11-2.99,0.23-4.48,0.61c-0.71,0.18-1.21,0.7-1.64,1.15c-0.14,0.15-0.29,0.3-0.44,0.43l-0.44,0.38l0.32,1.71l0.49,0.21c0.08,0.03,0.16,0.08,0.24,0.13c0.3,0.17,0.68,0.39,1.15,0.39h0.08l0.16-0.02c1.95-0.33,3.58-0.65,5.2-1.11c0.72-0.21,1-0.89,1.22-1.45c0.06-0.14,0.11-0.29,0.18-0.41l0.49-0.9l-0.91-0.47c-0.08-0.04-0.17-0.1-0.25-0.16c-0.31-0.21-0.73-0.49-1.26-0.49h-0.04L61.5,22.23z M40.8,16l-0.95,0.25c-0.49,0.13-0.97,0.26-1.46,0.39c-2.37,0.67-2.21,3.27-2.14,4.39c0.14,2.25,1.73,2.42,2.22,2.42l0,0c0.26,0,0.55-0.04,0.85-0.12c0.99-0.26,2.16-0.58,3.31-1.05c1.09-0.44,2.67-1.08,2.71-3.06c0.02-0.69,0.01-1.37,0.01-2.11l0-2.36L40.8,16z M54.84,15.45c0.14,0.32,0.25,0.67,0.35,1c0.3,0.95,0.59,1.85,1.44,2.12C57.33,18.8,58.1,18.9,59,18.9c0.59,0,1.21-0.05,1.92-0.14c1.36-0.18,2.28-1.42,2.24-2.99c-0.02-1.06-0.68-1.72-1.7-1.72c-0.15,0-0.3,0.01-0.45,0.03c-0.07,0.01-0.13,0.02-0.19,0.02c-0.6-0.04-1.25-0.06-2.09-0.06c-0.42,0-0.86,0-1.33,0.01c-0.51,0.01-1.05,0.01-1.63,0.01h-1.52L54.84,15.45z"/><path class="inline-svg--fill-only" d="M78.17,57.62c-0.48,0-0.97-0.04-1.48-0.12c-0.21-0.17-0.61-0.84-0.77-1.45c-0.54-2.18-1.87-3.59-4.06-4.32c-0.28-0.09-0.6-0.33-0.93-0.57c-0.07-0.05-0.15-0.11-0.22-0.16c-0.14-0.58-0.37-1.95-0.47-2.75c0.05-0.02,0.11-0.05,0.16-0.07c0.76-0.34,1.48-0.66,2.21-0.83c0.72-0.17,1.49-0.22,2.31-0.27c0.37-0.02,0.75-0.05,1.12-0.08l0.19,0c3.61,0,6.13,1.98,8.79,4.95c0.38,0.42,0.25,1.73-0.39,2.49C82.83,56.54,80.66,57.62,78.17,57.62z"/><path class="inline-svg--fill-only" d="M33.41,61.61c-1.47-0.1-2.97-0.33-4.42-0.55l-0.55-0.08c-0.66-0.1-1.31-0.22-1.97-0.34c-1.01-0.19-2.05-0.38-3.11-0.49c-1.26-0.14-1.54-0.39-1.72-0.93c-0.15-0.44,0-0.77,0.67-1.51c0.42-0.46,0.79-0.93,1.16-1.42c1.02-1.33,2.35-1.89,4.44-1.89c0.76,0,1.57,0.07,2.35,0.14l0.19,0.02c0.65,0.06,1.3,0.09,1.91,0.09c2.42,0,4.59-0.43,6.57-1.31c-0.65,0.69-1.3,1.34-2.01,1.94c-1.71,1.44-2.66,3.31-2.89,5.71c-0.06,0.64-0.24,0.64-0.51,0.64L33.41,61.61z"/><path class="inline-svg--fill-only" d="M60.5,56.44c-0.61,0-1.13-0.09-1.44-0.26c-1.4-0.76-1.95-1.61-2.11-3.27c-0.17-1.77-1.29-2.81-2.37-3.69c0.04-0.01,0.08-0.03,0.12-0.04c1-0.36,1.95-0.71,2.86-0.76c0.57-0.03,1.14-0.05,1.71-0.05c1.3,0,2.63,0.07,3.92,0.14c0.71,0.04,1.41,0.08,2.12,0.1c0.04,0.02,0.2,0.11,0.2,0.11c0.53,0.29,0.94,1.1,1.03,2.05c0.1,0.95-0.14,1.85-0.59,2.24c-0.9,0.77-1.76,1.54-2.42,2.48C63.22,55.96,61.92,56.44,60.5,56.44z"/><path class="inline-svg--fill-only" d="M48.69,59.05c-0.33,0-0.66-0.08-0.98-0.23c-1.45-0.71-2.9-0.94-4.26-1.12c-1.14-0.15-1.33-0.31-1.36-0.34c-0.03-0.05-0.1-0.29,0.15-1.37c0.12-0.54,0.18-1.07,0.24-1.59l0.06-0.49c0.09-0.75,0.52-1.18,1.16-1.18c2.61,0,4.89-0.37,6.99-1.11c0.11,0.01,0.19,0.01,0.28,0.02c0.15,0.01,0.32,0.02,0.49,0.02h0.22l0.06-0.03c0.02,0.05,0.04,0.11,0.06,0.19c0.23,0.76,0.58,1.46,0.91,2.13c0.25,0.5,0.48,0.98,0.66,1.46c0.24,0.64,0.21,0.81,0.2,0.83c-0.01,0-0.13,0.14-0.82,0.4c-0.68,0.25-1.34,0.71-1.82,1.24C50.27,58.63,49.45,59.05,48.69,59.05z"/><path class="inline-svg--fill-only" d="M45.63,266.65c-3.18-0.92-4.52-3.59-5.93-6.43l-0.17-0.33c-0.2-0.39-0.32-0.86-0.45-1.36l-0.09-0.34c-0.67-2.45-0.67-2.45,1.45-3.81c0.1-0.07,0.21-0.13,0.31-0.19l1.61-0.96l-1.4-0.87c-0.63-0.39-1.34-0.59-2.13-0.59c-0.95,0-2.01,0.29-3.16,0.86c-0.93,0.46-1.91,0.83-2.95,1.23c-0.35,0.13-0.71,0.27-1.06,0.41c-0.65,0.25-1.3,0.52-1.94,0.79c-1.59,0.67-3.1,1.29-4.68,1.72c-2.01,0.54-4.17,0.72-6.2,0.83l-0.1,0c-1.04,0-1.52-0.93-1.53-1.85c-0.01-0.76-0.02-1.55,0.07-1.73c0.18-0.12,1.24-0.2,2.01-0.26c0.74-0.06,1.48-0.09,2.22-0.12c1.1-0.05,2.23-0.1,3.35-0.23c2.5-0.29,4.47-1.66,6.12-2.93c0.36-0.28,0.76-0.52,1.19-0.79c0.21-0.13,0.41-0.25,0.62-0.39l0.53-0.34l-0.08-0.63c-0.29-2.19-2.31-2.86-2.97-3.08c-2.13-0.7-4.23-1.3-6.46-1.94c-0.54-0.15-1.07-0.31-1.62-0.46c0.17-0.19,0.41-0.41,0.75-0.62c0.66-0.4,1.34-0.77,2.02-1.15c0.7-0.39,1.4-0.77,2.08-1.19c0.37-0.22,0.71-0.33,1.07-0.33c0.47,0,1.02,0.18,1.81,0.59c2.64,1.37,4.72,2.33,6.72,3.1c0.21,0.08,0.45,0.12,0.7,0.12c0.64,0,1.28-0.27,1.85-0.51c0.14-0.06,0.28-0.12,0.42-0.17c0.44-0.17,0.8-0.45,1.14-0.72c0.14-0.11,0.29-0.23,0.46-0.35l1.43-1.01l-2.51-1.13c-0.64-0.29-1.27-0.58-1.9-0.84c-2.45-1.04-4.9-2.08-7.35-3.11l-4.13-1.75c-0.12-0.05-0.24-0.11-0.35-0.17c-0.27-0.13-0.57-0.28-0.92-0.37c-0.83-0.22-1.51-0.78-1.94-1.58c-0.5-0.94-0.57-2.07-0.2-3.2l0.4-1.19c0.74-2.22,1.5-4.52,2.46-6.66c0.49-1.09,1.44-2.1,2.37-3.07l0.19-0.2c1.03-1.09,2.4-2.48,3.91-3.63c0.34-0.26,0.74-0.39,1.17-0.39c1.03,0,2.15,0.8,2.18,2c0.03,1.6,1.06,1.78,1.5,1.78c0.13,0,0.26-0.01,0.42-0.03l0.12-0.01c0.23-0.02,0.46-0.06,0.68-0.11c0.26-0.05,0.51-0.09,0.71-0.09c0.05,0,0.1,0,0.14,0.01c0.3,0.05,0.58,0.07,0.85,0.07c1.64,0,2.85-0.85,3.6-2.51c0.71-1.6,2.18-2.24,3.88-2.98c0.38-0.17,0.77-0.33,1.14-0.51c1.77-0.85,3.81-1.89,5.57-3.54c0.47-0.44,1.66-0.58,2.45-0.68c0.24-0.03,0.48-0.06,0.72-0.06c0.46,0,0.86,0.09,1.31,0.54c0.89,0.89,2.26,1.16,3.46,1.4l0.27,0.05c0.42,0.09,0.63,0.17,0.63,1.14c-0.12,0.19-0.54,0.54-0.73,0.7c-0.38,0.31-0.76,0.57-1.16,0.85c-0.4,0.27-0.8,0.54-1.17,0.85c-0.67,0.54-0.98,1.13-0.91,1.74c0.1,0.95,1.03,1.42,1.33,1.58c2.88,1.47,5.77,2.95,8.5,4.55c0.74,0.44,1.39,1.12,2.08,1.84c0.21,0.22,0.41,0.43,0.62,0.64c0.47,0.47,0.49,0.82,0.09,1.33c-0.2,0.26-0.39,0.53-0.58,0.8c-0.33,0.49-0.65,0.95-1.01,1.23c-2.12,1.64-2.23,4.09-2.3,5.71c-0.08,1.82-0.76,2.79-2.4,3.45c-1.43,0.58-2.79,1.32-4.1,2.04c-0.04,0.02-1.83,1.09-1.29,2.25c0.34,0.73,0.93,1.65,1.81,1.85c1.25,0.28,2.53,0.4,3.77,0.52l0.67,0.06c0.39,0.04,0.6,0.09,0.71,0.12c-0.02,0.11-0.07,0.3-0.19,0.62c-0.72,1.83-1.49,2.86-3.52,3.04c-1.99,0.18-3.92,0.77-5.79,1.35c-0.8,0.25-1.59,0.49-2.39,0.7l-0.67,0.18l-0.1,1.03l-0.06,0.76l0.71,0.28l0.64,0.24c0.48,0.18,0.96,0.36,1.45,0.54l0.95,0.33c2.15,0.74,4.17,1.44,5.91,2.89c1.24,1.03,3.22,1.09,4.68,1.13c1.78,0.05,3.68,0.07,5.82,0.07c2.19,0,4.39-0.02,6.58-0.05c0,0,0,0,0,0c0.89,0,1.3,0.19,1.76,0.78c0.46,0.59,1.14,0.88,1.74,1.13c0.13,0.06,0.27,0.11,0.4,0.17c-0.15,0.05-0.29,0.1-0.44,0.15c-1.21,0.41-2.35,0.79-3.48,0.86c-3.35,0.19-6.1,1.3-8.43,3.39c-0.61,0.55-1.29,0.8-2.13,0.8c-0.43,0-0.9-0.07-1.45-0.2c-2.5-0.61-4.95-1.57-7.71-3c-0.82-0.43-1.68-0.81-2.5-1.18c-1.29-0.57-2.63-1.17-3.79-1.93c-1.23-0.8-2.42-1.71-3.67-2.68c-0.6-0.46-1.21-0.93-1.85-1.41l-1.41-1.05l-0.19,1.74c-0.04,0.35-0.06,0.7-0.09,1.03c-0.05,0.67-0.1,1.24-0.22,1.78c-0.29,1.27-0.61,2.52-0.93,3.78c-0.36,1.43-0.72,2.87-1.05,4.31c-0.25,1.12-0.28,2.28-0.28,3.18C45.68,266.67,45.65,266.66,45.63,266.65z M51.38,239.1c-1.86,0-2.44,2.12-2.96,4.69l-0.55,2.73l7.4-5.99l-1.88-0.82C52.66,239.38,52.03,239.1,51.38,239.1z M35.8,228.09c-1.79,0-3.02,0.81-3.76,2.48l-0.48,1.07l1.13,0.3c1.17,0.32,2.34,0.64,3.5,0.96c2.66,0.74,5.41,1.5,8.13,2.14c2.21,0.53,4.47,0.87,6.67,1.21l1.26,0.19c0.21,0.03,0.42,0.05,0.63,0.05c1.24,0,2.08-0.71,2.25-1.89c0.21-1.53-0.53-2.69-2-3.1l-0.7-0.2c-1.29-0.37-2.58-0.74-3.88-1.07l-0.2-0.05c-1.42-0.36-2.88-0.74-4.36-0.99c-2.01-0.35-4.4-0.75-6.83-1C36.68,228.13,36.25,228.09,35.8,228.09z M48.34,220.5c-1.85,0-5.19,0.2-6.72,1.53l-1.14,1l1.37,0.66c2.78,1.33,5.75,1.96,9.36,1.96h0c2.27,0,4.56-0.25,6.51-0.5l1.07-0.14l-0.21-1.05C58.02,221.22,51.64,220.5,48.34,220.5z"/><path class="inline-svg--fill-only" d="M47.6,192.51c-2.12,0-4.07-0.35-5.96-1.07c-0.35-0.13-0.72-0.4-1.11-0.69c-0.19-0.14-0.39-0.28-0.59-0.42l-6.85-4.56c-0.14-0.09-0.28-0.15-0.37-0.18c-0.17-0.13-0.47-0.34-0.66-0.51c0.2-0.21,0.51-0.48,0.64-0.59c0.34-0.3,0.63-0.62,0.9-0.93c0.72-0.81,1.16-1.27,1.94-1.28c0.38-0.01,0.75-0.03,1.13-0.04c0.34-0.02,0.68-0.03,1.02-0.04c1.27-0.03,2.21-0.11,2.8-0.8c0.58-0.67,0.51-1.61,0.39-2.52c-0.26-2.01,0.11-3.92,0.55-5.68c0.08-0.28,0.18-0.66,0.03-1.07c-0.57-1.57,0.27-2.33,1.81-3.53l0.4-0.31c1.53-1.22,3.24-1.79,5.4-1.79c1.16,0,2.42,0.16,4.1,0.5c2.52,0.52,5.08,0.79,7.61,0.79c2,0,4.02-0.17,6-0.49c0.17-0.03,0.34-0.04,0.52-0.04c0.74,0,1.6,0.21,2.36,0.57c1.9,0.89,3.79,1.91,5.63,2.9c0.82,0.44,1.63,0.88,2.45,1.31c0.28,0.26,0.44,1.66,0.2,2c-1.1,0.75-1.44,1.78-0.98,3.11c0.31,0.89,0.57,1.83,0.83,2.74c0.2,0.71,0.4,1.41,0.62,2.11c0.35,1.12,1.22,1.74,2.45,1.75c3.52,0.04,7.01,0.13,10.02,0.23c-0.21,0.18-0.43,0.36-0.65,0.53c-0.53,0.43-1.07,0.87-1.58,1.36c-0.52,0.5-1.23,0.61-2.05,0.74c-0.41,0.06-0.83,0.13-1.26,0.25c-0.57,0.16-1.14,0.33-1.71,0.5c-0.92,0.27-1.87,0.56-2.8,0.78c-0.88,0.21-1.78,0.35-2.72,0.5c-0.08,0.01-0.16,0.03-0.24,0.04l-0.03-0.19l-3.26,0.22c-2.04,0.14-4.09,0.28-6.13,0.38c-0.1,0-0.19,0.01-0.29,0.01c-0.65,0-1.32-0.11-1.83-0.2c-0.24-0.04-0.47-0.06-0.69-0.06c-1.44,0-2.46,0.85-3.27,1.52c-0.16,0.13-0.31,0.26-0.47,0.38c-1.08,0.84-2.29,0.93-3.77,0.95l-1.08,0.01c-1.68,0.01-3.43,0.03-5.13,0.36C50.41,192.36,48.99,192.51,47.6,192.51z M58.2,172.2c-0.42,0-0.84,0.03-1.25,0.1c-1.01,0.17-1.52,1.61-1.55,2.31c-0.08,1.61-0.08,3.32,0,5.25c0.03,0.64,0.38,1.8,1.23,2.15c0.79,0.33,1.58,0.53,2.5,0.76c0.36,0.09,0.73,0.18,1.13,0.29l1.41,0.39l-0.15-1.46c-0.04-0.4-0.09-0.77-0.13-1.12c-0.09-0.71-0.16-1.33-0.18-1.93c-0.02-0.64-0.01-1.28,0.01-1.91c0.01-0.63,0.03-1.25,0.01-1.88c-0.03-1.18-0.06-2.4-1.03-2.68C59.57,172.29,58.9,172.2,58.2,172.2z M67.42,172.38c-0.37,0-0.8,0.04-1.34,0.11l-0.92,0.13l0.06,0.92c0.02,0.28,0.03,0.57,0.04,0.86c0.03,0.68,0.06,1.38,0.16,2.09c0.16,1.12,0.36,2.23,0.56,3.37c0.09,0.5,0.41,2.35,0.41,2.35h5.32l-0.2-1.17c-0.11-0.63-0.21-1.25-0.3-1.84c-0.22-1.34-0.42-2.6-0.68-3.87C70.22,173.8,69.62,172.38,67.42,172.38z M43.69,182.22l1.85-0.14c0.6-0.05,1.16-0.1,1.71-0.15c1.09-0.1,2.03-0.2,2.96-0.2c0,0,0.22,0,0.22,0c0.85,0,1.42-0.2,1.81-0.61c0.52-0.54,0.57-1.26,0.54-1.96c-0.04-1.06-0.08-2.26,0.1-3.33c0.39-2.24-0.36-3.52-2.45-4.16l-0.77-0.23L43.69,182.22z"/><path class="inline-svg--fill-only" d="M61.75,126.22c-0.14,0-0.45-0.14-0.54-0.24c-1.75-3.32-2.29-6.28-1.67-9.27c0.03-0.16,0.07-0.25,0.09-0.3c2.11-1.54,2.45-3.97,2.67-5.58c0.59-4.22,1.09-8.03,1.27-11.92c0.16-3.58-0.03-6.59-0.58-9.19c-0.13-0.61-0.27-1.21-0.42-1.8c-0.4-1.64-0.78-3.2-0.8-4.84c-0.02-1.03-0.68-1.9-1.27-2.68c-0.14-0.18-0.27-0.36-0.4-0.54c-0.21-0.3-0.45-0.54-0.72-0.78c0.22-0.17,0.42-0.32,0.64-0.45c0.69-0.44,1.39-0.87,2.08-1.3c1.34-0.82,2.73-1.68,4.05-2.62c0.76-0.55,1.79-0.85,2.9-0.85c1.81,0,3.51,0.77,4.42,2.01l0.39,0.54c0.33,0.47,0.68,0.96,1.08,1.42c1.16,1.35,1.41,2.85,0.85,5.16c-0.66,2.75-1.03,5.15-1.1,7.35c-0.11,2.95,0.03,5.93,0.15,8.82l0.07,1.62c0.03,0.67,0.13,1.31,0.24,1.94c0.13,0.77,0.25,1.49,0.21,2.17c-0.09,1.68-0.28,3.39-0.46,5.05c-0.15,1.37-0.3,2.8-0.41,4.21c-0.14,1.87-0.43,4.05-1.57,6.03c-1.04,1.81-2.26,2.91-3.84,3.45c-1.02,0.35-2.03,0.77-3,1.17c-0.7,0.29-1.41,0.58-2.12,0.85C63.27,125.88,62.48,126.17,61.75,126.22z"/><path class="inline-svg--fill-only" d="M53.72,164.1c-1.02,0-2.03-0.29-3.29-0.94c-0.53-0.28-1.08-0.52-1.63-0.76c-0.6-0.26-1.16-0.51-1.69-0.8c-0.96-0.52-1.92-1.1-2.85-1.66c-0.45-0.27-0.91-0.55-1.36-0.81c-0.27-0.16-0.56-0.32-0.84-0.45c-1.03-0.47-1.68-1.08-1.93-1.83c-0.29-0.83-0.12-1.85,0.49-3.06c1.05-2.05,1.99-4.18,2.91-6.25c0.5-1.14,1.01-2.28,1.53-3.41c0.35-0.76,0.72-1.55,1.21-2.16c0.68-0.84,1.49-1.23,2.55-1.23c0.57,0,1.21,0.11,1.95,0.34c0.61,0.19,1.22,0.39,1.83,0.6c1.08,0.37,2.19,0.75,3.33,1.02c0.99,0.23,2,0.33,2.97,0.41c0.48,0.04,0.97,0.09,1.45,0.15c0.62,0.08,1.25,0.15,1.87,0.22c2.72,0.3,5.29,0.59,7.69,1.71c0.97,0.45,1.49,1.23,1.75,2.61c0.52,2.74,0.99,5.55,1.43,8.27l0.17,1.01c0.09,0.56,0.14,1.13,0.2,1.73c0.01,0.1,0.02,0.21,0.03,0.31l-0.04,0.43l0,0.38c0,0.32-0.01,0.63,0.01,0.95c0.06,0.96-0.15,1.7-0.62,2.19c-0.66,0.7-1.74,0.84-2.53,0.84h-0.16c-2.01,0-4.07-0.05-6.06-0.11c-1.72-0.05-3.44-0.09-5.16-0.1l-0.17,0c-1.31,0-2.74,0.11-4.24,0.34C54.24,164.08,53.98,164.1,53.72,164.1z M58.58,153.73c-0.13,0-0.27,0.01-0.4,0.03c-1.77,0.18-8.79,0.89-8.79,0.89l1.27,1.46c1.13,1.29,2.53,2.69,4.92,2.98c0.89,0.11,1.78,0.38,2.72,0.67c0.68,0.21,1.39,0.43,2.12,0.58c0.28,0.06,0.57,0.09,0.88,0.09c0.58,0,1.19-0.11,1.71-0.31c0.58-0.23,1.05-0.61,1.5-0.99c0.18-0.15,0.37-0.31,0.58-0.46l0.65-0.48l-0.34-0.74c-0.04-0.1-0.08-0.21-0.12-0.33c-0.15-0.46-0.35-1.09-0.98-1.36c-1.43-0.61-2.91-1.14-4.34-1.65l-0.79-0.28C58.99,153.76,58.8,153.73,58.58,153.73z M55.07,145.5c-1.75,0-2.53,1.23-3.24,2.6l-0.56,1.08l10.34,3v-1.33c0-0.15,0.01-0.3,0.01-0.46c0.02-0.39,0.03-0.83-0.03-1.28c-0.43-2.9-2.4-3.34-3.54-3.34c-0.29,0-0.61,0.03-0.94,0.08c-0.01-0.01-0.03-0.01-0.05-0.02c-0.08-0.03-0.16-0.05-0.24-0.07C56.07,145.58,55.53,145.5,55.07,145.5z"/><path class="inline-svg--fill-only" d="M44,113.22c-0.44,0-0.75-0.13-1.02-0.43c-0.44-0.48-0.67-0.96-0.67-1.16c0.01-0.82,0.1-1.63,0.2-2.5c0.1-0.89,0.21-1.82,0.22-2.75c0.01-1.2-0.17-2.38-0.34-3.52c-0.05-0.33-0.1-0.65-0.14-0.98c-0.35-2.6-0.52-4.59,0.58-6.58c0.46-0.83,0.45-1.81,0.45-2.67c0-0.19,0-0.38,0-0.56l0.03-0.91c0.05-1.4,0.1-2.84-0.1-4.27c-0.15-1.12-0.74-2.37-1.57-3.34c-1.26-1.47-1.17-1.8-0.18-2.7c1.84-1.68,3.74-3.41,6.21-3.92c0.48-0.1,0.96-0.16,1.44-0.22c0.22-0.03,0.43-0.06,0.65-0.09l0.13,0c1.99,0,3.83,0.7,5.65,2.13c0.42,0.33,0.47,0.41,0.38,0.86c-0.23,1.08-0.26,2.18-0.28,3.24c-0.02,0.65-0.03,1.26-0.09,1.87c-0.12,1.28-0.27,2.56-0.42,3.85c-0.2,1.67-0.4,3.39-0.54,5.1c-0.07,0.87-0.18,1.74-0.28,2.62c-0.36,2.97-0.74,6.05,0.27,9.19c0.4,1.23,0.06,2.2-1.05,3.05c-2.82,2.16-5.57,3.64-8.41,4.51C44.67,113.15,44.31,113.22,44,113.22z"/><path class="inline-svg--fill-only" d="M28.91,119.23c-0.93,0-1.54-0.67-2.43-1.78c-0.14-0.17-0.28-0.35-0.42-0.51c-1.17-1.39-2.26-2.95-3.24-4.65c-0.45-0.77-0.76-1.79-0.88-2.87c-0.17-1.56-0.27-3.16-0.36-4.72c-0.06-1-0.12-1.99-0.2-2.99l-0.04-0.57c-0.11-1.45-0.22-2.94-0.53-4.41c-0.08-0.39-0.03-0.52,0.37-0.94c0.34-0.35,0.68-0.7,1.01-1.05c1.04-1.07,2.11-2.17,3.09-3.35c0.81-0.98,1.43-2.1,1.74-3.17c0.65-2.26,2.25-2.85,5.35-3.19c0.25,0.07,0.52,0.13,0.81,0.21c0.9,0.22,1.91,0.48,2.89,0.84c0.8,0.29,1.15,0.66,0.84,1.82c-0.19,0.74-0.39,1.49-0.58,2.23c-0.41,1.54-0.81,3.09-1.19,4.64c-0.77,3.19-0.44,6.38,0.98,9.48c0.23,0.49,0.48,0.98,0.73,1.46c0.23,0.44,0.46,0.87,0.66,1.32c0.33,0.72,0.24,0.8-0.26,1.06c-2.52,1.34-3.78,3.7-3.54,6.66c0.16,2.02-2.25,3.78-3.94,4.33C29.45,119.18,29.16,119.23,28.91,119.23z"/><path class="inline-svg--fill-only" d="M24.83,187.24c-0.74,0-1.66-0.42-2.55-0.82c-0.3-0.14-0.6-0.27-0.89-0.4c-1.09-0.45-1.63-1.17-1.79-2.41c-0.17-1.26-0.54-2.48-0.89-3.66c-0.15-0.5-0.31-1.01-0.44-1.51c-0.02-0.06-0.03-0.11-0.04-0.17l0.02-0.21c0.02-0.23,0.03-0.47,0.03-0.71c0.01-0.41,0.02-0.8,0.1-1.12c0.09-0.05,0.23-0.1,0.3-0.11c0.19,0.01,0.39,0.01,0.6,0.01c3.02,0,5.89-0.94,9.02-2.97c0.78-0.5,1.58-0.98,2.38-1.45c1.29-0.77,2.63-1.56,3.88-2.48c0.9-0.66,1.62-1.5,2.32-2.31c0.35-0.4,0.7-0.81,1.07-1.19c0.78-0.8,1.61-1.62,2.53-2.49c-0.04,1.32-0.58,2.56-1.15,3.86c-0.24,0.54-0.48,1.08-0.68,1.64l-0.07,0.18c-0.3,0.83-0.47,1.18-0.92,1.36c-0.48,0.19-0.74,0.66-0.82,0.99c-0.28,1.2-1.06,2.19-1.87,3.23c-0.71,0.9-1.44,1.83-1.91,2.96c-0.04,0.1-0.13,0.22-0.22,0.29c-1.67,1.33-2.18,3.22-2.59,4.74c-0.78,2.9-2.54,4.5-5.24,4.74C24.94,187.24,24.89,187.24,24.83,187.24z"/><path class="inline-svg--fill-only" d="M33.47,152.36c-0.66,0-1.22-0.11-1.73-0.33c-0.25-0.11-0.51-0.22-0.76-0.32c-0.55-0.23-1.07-0.44-1.54-0.71c-1.16-0.64-2.58-1.3-4.23-1.3c-0.59,0-1.19,0.09-1.77,0.25c-0.15,0.04-0.29,0.07-0.4,0.07c-0.15,0-0.31,0-0.32-0.63c0-0.59-0.34-1.03-0.59-1.36c-0.58-0.78-0.51-1.43,0.16-2.02l0.63-0.55c1-0.87,2.04-1.78,2.97-2.78c0.3-0.32,0.6-0.48,0.92-0.48c0.11,0,0.22,0.02,0.34,0.05c2.86,0.79,5.76,1.66,8.56,2.49l1.5,0.45l-0.15,1.19c-0.18,1.42-0.35,2.76-0.5,4.09c-0.09,0.84-0.76,1.63-1.48,1.74C34.41,152.31,33.92,152.36,33.47,152.36z"/><path class="inline-svg--fill-only" d="M26.53,165.51c-0.51,0-1.06-0.12-1.6-0.36c-1.74-0.76-3.05-1.95-3.79-3.43c-0.26-0.52-0.22-1.37-0.18-2.19c0.02-0.33,0.03-0.65,0.03-0.96c0-0.15,0.07-0.37,0.14-0.6c0.08-0.25,0.16-0.53,0.21-0.84c0.35-2.52,1.1-2.63,3.93-3.08l0.7-0.11l0.07-0.02c0.17,0.03,0.63,0.51,0.9,0.81c0.3,0.32,0.6,0.65,0.96,0.93c0.61,0.49,1.12,1.17,1.66,1.89c0.18,0.24,0.36,0.47,0.54,0.7c0.79,1.01,0.79,1.84-0.01,2.98c-0.56,0.79-0.92,1.52-1.11,2.21C28.6,164.81,27.78,165.51,26.53,165.51z"/></svg>',
		
	}
}

// -------------------------------------------------------------------------------------
// Google Analytics (gtag.js)

const GA_TRACKING_ID = 'UA-134745487-1';

window.dataLayer = window.dataLayer || [];
function gtag(){
	dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', GA_TRACKING_ID);

// -------------------------------------------------------------------------------------
// Google Analytics (analytics.js)

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-61140813-2', 'auto');
ga('send', 'pageview');
