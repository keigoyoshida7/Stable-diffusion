
var swipeObject;

if (PJAX.maincontents.isTransition() === false) {
	document.addEventListener("DOMContentLoaded", GAS_pjaxDOMContentLoaded, false);
}

function GAS_pjaxDOMContentLoaded() {
	swipeObject = new SwipeObject();
	swipeObject.init();
	Floormap.init();
}

function GAS_pjaxOnLoadComplete() {
	swipeObject.build();
	Floormap.build();
	InViewElement.manage.reset(InViewElement.manage);
}

function GAS_pjaxDestroyJS() {
	if (swipeObject) {
		swipeObject.destroy(swipeObject);
		swipeObject = null;
	}
	Floormap.destroy();
	Floormap = null;
	
	GAS_pjaxOnLoadComplete = null;
	GAS_pjaxDOMContentLoaded = null;
	GAS_pjaxDestroyJS = null;
}

var Floormap = {
	
	event_resize: undefined,
	flickity: undefined,
	
	init: function() {
		var t = this;
		
		t.event_resize = function(e) {
			Floormap.resize();
		}
		window.addEventListener("resize", t.event_resize);
	},
	
	build: function() {
		
		Floormap.flickity = $(".facilities_floormap__fig").flickity({
			wrapAround: true,
			prevNextButtons: true,
			pageDots: true,
			draggable: true,
			percentPosition: false,
			arrowShape: 'M95,51.5H12L35,66l-2,3L4,50l29-19l2,3L12,48.5h83'
		});
		
		Floormap.resize();
	},
	
	resize: function() {
		var target = document.getElementsByClassName("facilities_floormap__fig")[0];
		var cell = target.getElementsByClassName("carousel-cell");
		
		for (var i = 0; i < cell.length; i++) {
			var inner = cell[i].getElementsByClassName("carousel-cell__inner")[0];
			cell[i].style.height = (inner.getBoundingClientRect().height + 20) + "px";
		}
		Floormap.flickity.flickity("resize");
	},
	
	destroy: function() {
		Floormap.flickity.flickity('destroy')
		window.removeEventListener("resize", Floormap.resize);
	}
}