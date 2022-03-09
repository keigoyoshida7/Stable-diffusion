
var swipeObject;

if (PJAX.maincontents.isTransition() === false) {
	document.addEventListener("DOMContentLoaded", GAS_pjaxDOMContentLoaded, false);
}

function GAS_pjaxDOMContentLoaded() {
	currentPageHighlight("section-index", 1 + DIRECTORY_LEVEL);
	swipeObject = new SwipeObject();
	swipeObject.init();
	ModalWindow._container = document.getElementById("pushstate-target");
	ModalWindow.init();
}

function GAS_pjaxOnLoadComplete() {
	swipeObject.build();
	InViewElement.manage.reset(InViewElement.manage);
}

function GAS_pjaxDestroyJS() {
	if (swipeObject) {
		swipeObject.destroy(swipeObject);
		swipeObject = null;
	}
	ModalWindow.destroy();
	GAS_pjaxOnLoadComplete = null;
	GAS_pjaxDOMContentLoaded = null;
	GAS_pjaxDestroyJS = null;
}
