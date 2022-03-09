
/*
 * modalWindow.js
 * 
 * Copyright (C) 2011 GLIDE ARTS STUDIO.
 * @ version 0.4
 * @ 2011-07-02
 * @ 2018-12-16 Last Modified.
 * @ Athor GLIDE ARTS STUDIO.
 */

var GAS_MODAL = {};
var GAS_MODAL_CLASS_NAME = "modal";

/* ---------------------------------------------------------------------------------------------- */

var ModalWindow = {
	
	UA: "",
	
	_container: undefined,
	
	_overlay            : document.createElement("div"),
	_body               : document.createElement("div"),
	_bodyInner          : document.createElement("div"),
	_image              : document.createElement("img"),
	_iFrame             : document.createElement("iframe"),
	_ajaxContent        : document.createElement("div"),
	_caption            : document.createElement("p"),
	_closeButton        : document.createElement("p"),
	_nextButton         : document.createElement("p"),
	_prevButton         : document.createElement("p"),
	_indicator          : document.createElement("div"),
	_indicatorContainer : document.createElement("div"),
	
	_targetDocumentId   : undefined,
	_addClassList       : undefined,
	_currentNum         : "",
	_captionText        : "",
	_prevCaption        : "",
	_prevURL            : "",
	_nextCaption        : "",
	_nextURL            : "",
	_currentGroup       : "",
	_isIframe           : false,
	_isCansel           : false,
	_isLoading          : false,
	_httpRequest        : false,
	_transitionEnd      : "",
	
	_triggerElms: undefined,
	
	_event_resize: undefined,
	_event_onclick_trigger: undefined,
	_event_onclick_close: undefined,
	_event_onclick_next: undefined,
	_event_onclick_prev: undefined,
	
	init: function() {
		
		var doc = document;
		var t = this;
		
		this.UA = this.prototype.UA;
		this._triggerElms = doc.getElementsByClassName(GAS_MODAL_CLASS_NAME);
		
		t._event_resize = function(e) {
			t.resize();
		}
		
		t._event_transitionEnd = function(e) {
			if (e.propertyName === "opacity" && document.defaultView.getComputedStyle(this).opacity === "0") {
				if (!t._isCansel) {
					t.remove();
				}
			}
		}
		
		t._event_onclick_trigger = function(e) {
			var ttl, ref, rel;
			
			ttl = this.getAttribute("title") || null;
			ref = this.getAttribute("href") || "";
			rel = this.getAttribute("rel") || false;
			
			t.open(this, ttl, ref, rel);
			this.blur();
			e.preventDefault();
		}
		
		t._event_onclick_next = function(e) {
			t.gotoNext();
		}
		
		t._event_onclick_prev = function(e) {
			t.gotoPrev();
		}
		
		t._event_hide = function(e) {
			t.hide();
		}
		
		window.addEventListener("resize", t._event_resize, false);
		this._overlay.addEventListener("click", t._event_hide, false);
		
		this._closeButton.setAttribute("id", "G_ModalWindowCloseButton");
		this._closeButton.setAttribute("title", "Close");
		this._closeButton.style.visibility = "hidden";
		this._body.appendChild(this._closeButton);
		this._body.addEventListener("transitionend", t._event_transitionEnd, false);
		
		for (var i = 0; i < this._triggerElms.length; i++) {
			this._triggerElms[i].addEventListener("click", t._event_onclick_trigger, true);
		}
		
	},
	
	open: function(triggerElement, caption, url, group) {
		
		var doc = document;
		var html = doc.getElementsByTagName("html")[0];
		var body = this._container || doc.getElementsByTagName("body")[0];
		var overlay = this._overlay;
		var modalBody = this._body;
		var modalBodyInner = this._bodyInner;
		var t = this;
		
		try {
			if (!doc.getElementById("G_ModalWindowOverlay")) {
				body.appendChild(modalBody);
				modalBody.appendChild(overlay);
				modalBody.appendChild(modalBodyInner);
				modalBody.setAttribute("id", "G_ModalWindowBody");
				modalBodyInner.setAttribute("id", "G_ModalWindowBody-inner");
				overlay.setAttribute("id", "G_ModalWindowOverlay");
				
				setTimeout(function() {
					modalBody.classList.add("onstart")
					doc.getElementsByTagName("body")[0].classList.add("show-modalwindow");
				}, 24);
			}
			
		} catch (event) {
			// nothing here
		}
		
		this._isCansel = false;
		this._isLoading = true;
		this._currentGroup = group;
		this.show(triggerElement, caption, url, group);
	},
	
	
	show: function(triggerElement, caption, url, group) {
		
		var t = this;
		var p = this.prototype;
		
		var body = this._container || document.getElementsByTagName("body")[0];
		var indicator = this._indicator;
		var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
		var urlType = "";
		var baseURL = "";
		var G_ModalWindowGroupArray;
		var groupLength = 0;
		var queryString = url.replace(/^[^\?]+\??/,'');
		var params = p.getQuerystring( queryString );
		
		this._indicatorContainer.setAttribute("id", "G_ModalWindowIndicatorContainer");
		this._body.appendChild(this._closeButton);
		this._closeButton.style.visibility = "visible";
		this._closeButton.addEventListener("click", t._event_hide, false);
		
		try {
			
			if (caption === null) caption = "";
			
			this._body.appendChild(this._indicatorContainer);
			this._indicatorContainer.style.position = "fixed";
			this._indicatorContainer.appendChild(indicator);
			
			indicator.setAttribute("id", "G_ModalWindowIndicator");
			this._caption.setAttribute("id", "G_ModalWindowCaption");
			
			if (url.indexOf("?") !== -1) {
				baseURL = url.substr(0, url.indexOf("?"));
			} else { 
				baseURL = url;
			}
			
			this._image.style.visibility = "hidden";
			
			if (this._targetDocumentId) {
				this._targetDocumentId = triggerElement.getAttribute("data-mw-appendId");
			}
			
			if (this._addClassList) {
				this._addClassList = triggerElement.getAttribute("data-mw-class");
			}
			
			if (this._isIframe) {
				this._isIframe = triggerElement.getAttribute("data-mw-iframe");
			}
			
			urlType = baseURL.toLowerCase().match(urlString);
			
			// add group navigation.
			if (group) {
				
				this.G_ModalWindowGroupArray = p.getElementsByRelationName(group, body);
				groupLength = this.G_ModalWindowGroupArray.length;
				
				if (groupLength > 1) {
					
					for (var i = 0; i < groupLength; i++) {
						if (this.G_ModalWindowGroupArray[i].getAttribute("href") === url) {
							
							// between
							if (i > 0 && i < groupLength - 1) {
								this.addPageNavigation("next");
								this.addPageNavigation("prev");
								this._prevCaption = this.G_ModalWindowGroupArray[i - 1].getAttribute("title") || null;
								this._nextCaption = this.G_ModalWindowGroupArray[i + 1].getAttribute("title") || null;
								this._prevURL = this.G_ModalWindowGroupArray[i - 1].getAttribute("href") || "";
								this._nextURL = this.G_ModalWindowGroupArray[i + 1].getAttribute("href") || "";
								
							// last
							} else if (i === groupLength - 1) {
								this.addPageNavigation("prev");
								this._prevCaption = this.G_ModalWindowGroupArray[i - 1].getAttribute("title") || null;
								this._prevURL = this.G_ModalWindowGroupArray[i - 1].getAttribute("href") || "";
								
							// first
							} else if (i === 0) {
								this.addPageNavigation("next");
								this._nextCaption = this.G_ModalWindowGroupArray[i + 1].getAttribute("title") || null;
								this._nextURL = this.G_ModalWindowGroupArray[i + 1].getAttribute("href") || "";
							}
							
							this._currentNum = groupLength + " of " + (i + 1) + " Images";
							
							break;
						}
					}
				}
			}
			
			if (urlType == ".jpg" || urlType == ".jpeg" || urlType == ".png" || urlType == ".gif") {
				var imgPreloader = new Image();
				imgPreloader.onload = function () {
					if (!t._isCansel) {
						t.onload("image", {loader:imgPreloader, src:url, caption:caption});
					}
					imgPreloader.onload = null;
				}
				imgPreloader.src = url;
				
			} else {
				
				// iframe
				if (this._isIframe !== null) {
					
					this._iFrame.setAttribute("frameborder", "0");
					this._iFrame.setAttribute("vspace", "0");
					this._iFrame.setAttribute("hspace", "0");
					this._iFrame.setAttribute("src", url);
					this._iFrame.setAttribute("id", "G_ModalWindowIFrame");
					this._iFrame.setAttribute("name", "G_ModalWindowIFrame" + Math.round(Math.random() * 1000));
					
					this._bodyInner.appendChild(this._iFrame);
					this._bodyInner.appendChild(this._caption);
					
					this.onload("iframe", "");
					this.resize();
					
				// Ajax content
				} else {
					
					this._httpRequest = false;
					this._httpRequest = new XMLHttpRequest();
					this._httpRequest.overrideMimeType("text/html");
					
					// HTTP method
					if (url.indexOf("method=post") < 0) {
						this._httpRequest.open("GET", url, true);
						this._httpRequest.responseType = "document";
						this._httpRequest.send(null);
						
					} else {
						this._httpRequest.open("POST", url, true);
						this._httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						this._httpRequest.send(url);
					}
					
					this._httpRequest.onreadystatechange = function () {
						if (t._httpRequest.readyState === 4) {
							if (t._httpRequest.status === 200) {
								// Success
								t.onload("ajax", t._httpRequest.response);
							} else {
								// Error
								t._httpRequest.abort();
							}
						}
					}
				}
			}
			
			document.onkeyup = function (event) {
				
				var keycode;
				
				if (event === null) {
					keycode = event.keyCode;
					
				} else {
					keycode = event.which;
				}
				// Esc key
				if (keycode === 27) {
					t.hide();
				}
			}
			
		} catch(event) {
			// nothing here
		}
	},
	
	onload: function(type, data) {
		
		var t = this;
		var b = t._container || document.getElementsByTagName("body")[0];
		var body;
		var rect
		var w = 0;
		var h = 0;
		
		this._isLoading = false;
		this._body.classList.add("onload-complete");
		
		if (this._addClassList) {
			this._body.classList.add(this._addClassList);
		}
		
		this._indicatorContainer.removeChild(this._indicator);
		this._body.removeChild(this._indicatorContainer);
		
		// image
		if (type === "image") {
			
			this._bodyInner.appendChild(this._image);
			this._bodyInner.appendChild(this._caption);
			
			this._image.setAttribute("src", data.src);
			this._image.setAttribute("alt", data.caption);
			this._image.setAttribute("id", "G_ModalWindowImage");
			this._image.style.visibility = "visible";
			
			this._captionText = document.createTextNode(data.caption);
			this._caption.appendChild(this._captionText);
			
			w = this._image.naturalWidth;
			h = this._image.naturalHeight;
			
		// iframe
		} else if (type === "iframe") {
			this._body.style.textAlign  = "left";
			
		// AjaxContent
		} else if (type === "ajax") {
			this._bodyInner.appendChild(this._ajaxContent);
			this._bodyInner.appendChild(this._caption);
			this._ajaxContent.setAttribute("id", "G_ModalWindowAjaxContent");
			this._body.style.textAlign  = "left";
			
			// Only a specific id
			if (this._targetDocumentId) {
				this._ajaxContent.appendChild(data.getElementById(this._targetDocumentId));
			} else {
				var children = data.getElementsByTagName("body")[0].children;
				for (var i = 0; i < children.length; i++) {
					this._ajaxContent.appendChild(children[i].cloneNode(true));
				}
			}
			
			rect = t._bodyInner.getBoundingClientRect();
			w = rect.width;
			h = rect.height;
		}
		
		if (w < h) {
			t._bodyInner.classList.add("vertical-rect");
		} else {
			t._bodyInner.classList.remove("vertical-rect");
		}
		
		this.resize();
	},
	
	addPageNavigation: function(type) {
		
		var t = this;
		
		if (type === "next") {
			t._body.appendChild(t._nextButton);
			t._nextButton.setAttribute("id","G_ModalWindowNext");
			t._nextButton.addEventListener("click", t._event_onclick_next, false);
		}
		
		if (type === "prev") {
			t._body.appendChild(t._prevButton);
			t._prevButton.setAttribute("id","G_ModalWindowPrev");
			t._prevButton.addEventListener("click", t._event_onclick_prev, false);
		}
	},
	
	removePageNavigation: function() {
		var t = this;
		if (document.getElementById("G_ModalWindowNext")) t._body.removeChild(t._nextButton);
		if (document.getElementById("G_ModalWindowPrev")) t._body.removeChild(t._prevButton);
		t._nextButton.removeEventListener("click", t._event_onclick_next, false);
		t._prevButton.removeEventListener("click", t._event_onclick_prev, false);
	},
	
	gotoNext: function() {
		this.remove(true);
		this.open(this, this._nextCaption, this._nextURL, this._currentGroup);
	},
	
	gotoPrev: function() {
		this.remove(true);
		this.open(this, this._prevCaption, this._prevURL, this._currentGroup);
	},
	
	hide: function() {
		this._body.classList.add("hide");
	},
	
	remove: function(bool) {
		
		var d = document;
		var b = this._container || d.getElementsByTagName("body")[0];
		var behindOverlay = bool || false;
		
		// image
		if (d.getElementById("G_ModalWindowImage")) {
			this._image.setAttribute("src","");
			this._bodyInner.removeChild(this._image);
			this._caption.removeChild(this._captionText);
		}
		
		// iframe
		if (d.getElementById("G_ModalWindowIFrame")) {
			this._bodyInner.removeChild(this._iFrame);
		}
		
		// ajax
		if (d.getElementById("G_ModalWindowAjaxContent")) {
			this._bodyInner.removeChild(this._ajaxContent);
			this._ajaxContent.innerHTML = "";
		}
		
		if (this._isLoading) {
			this._isCansel = true;
		}
		
		// indicator (cansel)
		if (this._isCansel) {
			this._indicatorContainer.removeChild(this._indicator);
			this._body.removeChild(this._indicatorContainer);
		}
		
		this._closeButton.onclick = null;
		this._closeButton.style.visibility = "hidden";
		this.removePageNavigation();
		document.getElementsByTagName("body")[0].classList.remove("show-modalwindow");
		
		if (!behindOverlay) {
			b.removeChild(this._body);
			this._body.removeChild(this._overlay);
			this._body.setAttribute("class", "");
		}
		
		if (d.getElementById("G_ModalWindowCaption")) this._bodyInner.removeChild(this._caption);
		if (d.getElementById("G_ModalWindowCloseButton")) this._body.removeChild(this._closeButton);
		if (d.getElementById("G_ModalWindowNext")) this._body.removeChild(this._nextButton);
		if (d.getElementById("G_ModalWindowPrev")) this._body.removeChild(this._prevButton);
		
		d.onkeydown = null;
		d.onkeyup = null;
		
		return false;
	},
	
	resize: function() {
		
	},
	
	destroy: function() {
		var t = this;
		window.removeEventListener("resize", t._event_resize, false);
		t._overlay.removeEventListener(t._transitionEnd, t._event_transitionEnd, false);
		t._closeButton.removeEventListener("click", t._event_hide, false);
		t.removePageNavigation();
		document.getElementsByTagName("body")[0].classList.remove("show-modalwindow");
		for (var i = 0; i < t._triggerElms.length; i++) {
			t._triggerElms[i].removeEventListener("click", t._event_onclick_trigger, true);
		}
	}
};


/* ---------------------------------------------------------------------------------------------- */


ModalWindow.prototype = {
	ua: navigator.userAgent.toLowerCase()
};

ModalWindow.prototype.UA = {
	
	os: (function(a) {
		var o;
		if (a.ua.indexOf("win") > -1) {
			o = "win";
		} else if (a.ua.indexOf("mac") > -1) {
			o = "mac";
		} else if (a.ua.indexOf("linux") > -1) {
			o = "linux";
		} else {
			o = "other";
		}
		return o;
	})(ModalWindow.prototype),
	
	browser: (function(a) {
		if (a.ua.indexOf("msie") > -1 || a.ua.indexOf("trident") > -1) {
			b = "msie";
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
	})(ModalWindow.prototype),
	
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
	})(ModalWindow.prototype),
	
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
	})(ModalWindow.prototype)
}

ModalWindow.prototype.getElementsByRelationName = function(relNameString, targetObject) {
	
	var array = new Array();
	var tags = new Array();
	var i, j, l;
	
	document.all ? tags = targetObject.all : tags = targetObject.getElementsByTagName("*");
	
	l = tags.length;
	for (i = 0, j = 0; i < l; i++) {
		if (tags[i].getAttribute("rel") == relNameString) {
			array[j] = tags[i];
			j++;
		}
	}
	return array;
}


ModalWindow.prototype.getQuerystring = function(string) {
	
	var query, ary, len, i, p;
	
	query = new Object();
	ary = string.split("&");
	len = ary.length;
	
	for (i = 0; i < len; i++) {
		p = ary[i].split("=");
		query[p[0]] = p[1];
	}
	
	return query;
}


String.prototype.replaceAll = function(org, dest) {
	return this.split(org).join(dest);  
}

