(function(){

	var builderModel,
		wrapper = utils.createElement("div",{
		"id": "keyb",
		"data-bind":"template: { name: 'main' }"
	});
	document.body.appendChild(wrapper);
	utils.includeTemplate(chrome.extension.getURL("/content/template"), ["main","keyframe-dropdown","keyframe-options-page","builder-page"], function(){
		builderModel = new BuilderModel(wrapper);
		window.builderModel = builderModel;
	});

	chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
		wrapper.classList.toggle("active");
		sendResponse(true);
	});
})();