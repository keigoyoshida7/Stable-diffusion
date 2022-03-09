
var InvertObject;

if (PJAX.maincontents.isTransition() === false) {
	document.addEventListener("DOMContentLoaded", GAS_pjaxDOMContentLoaded, false);
}

function GAS_pjaxDOMContentLoaded() {
}

function GAS_pjaxOnLoadComplete() {
	//InvertObject.build();
	InViewElement.manage.reset(InViewElement.manage);
}

function GAS_pjaxDestroyJS() {
	//InvertObject.destroy();
	//InvertObject = null;
	GAS_pjaxOnLoadComplete = null;
	GAS_pjaxDOMContentLoaded = null;
	GAS_pjaxDestroyJS = null;
}

var InvertObject = {
	
	blocks: undefined,
	resize_event: undefined,
	
	build: function() {
		var t = this;
		var clone;
		var blocks = document.getElementsByClassName("alternate-block");
		t.blocks = blocks;
		
		for (var i = 0; i < blocks.length; i++) {
			contents = blocks[i].getElementsByClassName("alternate-block__contents")[0];
			img = blocks[i].getElementsByClassName("alternate-block__img")[0];
			clone = t.duplicate(contents, img);
			blocks[i].classList.add("has-clone");
		}
		
		t.resize_event = function(e) {
			t.resize(e, t);
		};
		t.resize("", t);
		window.addEventListener("resize", t.resize_event, false);
	},
	
	duplicate: function(cloneElm, appendElm) {
		var clone = cloneElm.cloneNode(true);
		clone.classList.add("alternate-block__contents-clone");
		appendElm.appendChild(clone);
		return clone;
	},
	
	resize: function(e, t) {
		var imgRect, innerRect, clone;
		var blocks = t.blocks;
		
		for (var i = 0; i < blocks.length; i++) {
			imgRect = blocks[i].getElementsByClassName("alternate-block__img")[0].getBoundingClientRect();
			innerRect = blocks[i].getElementsByClassName("alternate-block-inner")[0].getBoundingClientRect();
			clone = blocks[i].getElementsByClassName("alternate-block__contents-clone")[0];
			
			if (i % 2) {
				clone.style.left = -(innerRect.width - imgRect.width) + "px";
			} else {
				clone.style.right = -(innerRect.width - imgRect.width) + "px";
			}
		}
	},
	
	destroy: function() {
		window.removeEventListener("resize", InvertObject.resize_event, false);
	}
}