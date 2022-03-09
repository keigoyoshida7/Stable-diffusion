
if (PJAX.maincontents.isTransition() === false) {
	document.addEventListener("DOMContentLoaded", GAS_pjaxDOMContentLoaded, false);
}

function GAS_pjaxDOMContentLoaded() {
	ModalWindow.init();
}

function GAS_pjaxOnClickHandler(e, a) {
	if (a) {
		var href = a.getAttribute("href");
		if (href.indexOf("http:") > -1 || href.indexOf("https:") > -1) {
			// ref innternal file
			if (href.toLowerCase().indexOf(".jpg") > -1 || href.toLowerCase().indexOf(".jpeg") > -1 || href.toLowerCase().indexOf(".gif") > -1 || href.toLowerCase().indexOf(".png") > -1 ) {
				e.preventDefault();
				ModalWindow.open(e.target, "", href);
				return false;
			}
		}
	}
}

function GAS_pjaxOnLoadComplete() {
	// add Share items
	var si = document.getElementsByClassName("share-items");
	if (si) {
		for (var i = 0; i < si.length; i++) {
			addShareElement(si[i], window.location.href, document.title);
		}
	}
	
	// check vertical image
	if (document.getElementsByClassName("entry__img")[0]) {
		var articleKv = document.getElementsByClassName("entry__img")[0];
		var articleKvImg = articleKv.getElementsByTagName("img")[0];
		
		if (articleKvImg.naturalWidth < articleKvImg.naturalHeight) {
			articleKv.classList.add("vertical-image");
		}
	}
}

function GAS_pjaxDestroyJS() {
	ModalWindow.destroy();
	ModalWindow = null;
	GAS_pjaxOnClickHandler = null;
	GAS_pjaxOnLoadComplete = null;
	GAS_pjaxDOMContentLoaded = null;
	GAS_pjaxDestroyJS = null;
}

