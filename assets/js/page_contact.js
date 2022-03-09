
if (PJAX.maincontents.isTransition() === false) {
	document.addEventListener("DOMContentLoaded", GAS_pjaxDOMContentLoaded, false);
}

function GAS_pjaxDOMContentLoaded() {
	Contact.init();
}

function GAS_pjaxOnLoadComplete() {
	Contact.onload();
}

function GAS_pjaxDestroyJS() {
	Contact.destroy();
	Contact = null;
	GAS_pjaxOnLoadComplete = null;
	GAS_pjaxDOMContentLoaded = null;
	GAS_pjaxDestroyJS = null;
}

var Contact = {
	
	terms: undefined,
	agree: undefined,
	nextbtn: undefined,
	event_change: undefined,
	event_click: undefined,
	
	init: function() {
		var t = this;
		$.fn.autoKana("#fs_name", "#fs_kana", {katakana: false});
		autosize(document.querySelector("textarea"));
		setMailformElementValue();
		
		t.terms = document.getElementById("js-terms");
		t.agree = document.getElementById("fs_agree");
		t.nextbtn = document.getElementById("js-next-btn");
		
		t.event_change = function(e) {
			console.log(e.target.checked);
			if (e.target.checked) {
				t.nextbtn.disabled = false;
			} else {
				t.nextbtn.disabled = true;
			}
		}
		
		t.event_click = function(e) {
			if (t.agree.checked) {
				t.nextbtn.disabled = false;
			} else {
				return false;
			}
		}
		
		if (t.terms) {
			t.terms.classList.add("article-loader--wait");
			
			// has checked
			if (!t.nextbtn.disabled && t.agree.checked) {
				t.nextbtn.disabled = false;
			} else {
				t.nextbtn.disabled = true;
			}
			
			t.agree.addEventListener("change", t.event_change, false);
			t.nextbtn.addEventListener("click", t.event_click, false);
		}
	},
	
	onload: function() {
		var t = this;
		
		if (t.terms) {
			$.ajax("/information/privacypolicy.html", {
				timeout : 1000,
				dataType: "html"
				
			}).then(function(data) {
				var html = $($.parseHTML(data));
				$("#js-terms").empty().append(html.find("#js-ajax-target"));
				t.terms.classList.add("article-loader--onload");
				t.terms.classList.remove("article-loader--wait");
			});
		}
	},
	
	destroy: function() {
		Contact.agree.addEventListener("change", Contact.event_change, false);
		Contact.nextbtn.addEventListener("click", Contact.event_click, false);
	}
}
