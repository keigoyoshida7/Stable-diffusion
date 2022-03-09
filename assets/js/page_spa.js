
var swipeObject;

if (PJAX.maincontents.isTransition() === false) {
	document.addEventListener("DOMContentLoaded", GAS_pjaxDOMContentLoaded, false);
}

function GAS_pjaxDOMContentLoaded() {
	swipeObject = new SwipeObject();
	swipeObject.init();
}

function GAS_pjaxOnLoadComplete() {
	swipeObject.build();
	InViewElement.manage.reset(InViewElement.manage);
	decisionVerticalImage(document.getElementsByClassName("alternate-block"));
}

function GAS_pjaxDestroyJS() {
	if (swipeObject) {
		swipeObject.destroy(swipeObject);
		swipeObject = null;
	}
	GAS_pjaxOnLoadComplete = null;
	GAS_pjaxDOMContentLoaded = null;
	GAS_pjaxDestroyJS = null;
}