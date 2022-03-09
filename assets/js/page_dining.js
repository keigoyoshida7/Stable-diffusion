
if (PJAX.maincontents.isTransition() === false) {
	document.addEventListener("DOMContentLoaded", GAS_pjaxDOMContentLoaded, false);
}

var sliderAry = [];

function GAS_pjaxDOMContentLoaded() {
	var elms = document.getElementsByClassName("CarouselGallery");
	for (var i = 0; i < elms.length; i++) {
		sliderAry[i] = new CarouselGallery(elms[i]);
		sliderAry[i].autoplay = true;
		sliderAry[i].init();
	}
}

function GAS_pjaxOnLoadComplete() {
	
}

function GAS_pjaxDestroyJS() {
	GAS_pjaxOnLoadComplete = null;
	GAS_pjaxDOMContentLoaded = null;
	GAS_pjaxDestroyJS = null;
}