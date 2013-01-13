(function(){

	var app,
		templates = ["main","keyframe-dropdown","keyframe-options-page","builder-page","result-page"],
		wrapper = utils.createElement("div",{
			"id": "keyb",
			"data-bind":"template: { name: 'main' }"
		});
	document.body.appendChild(wrapper);
	utils.includeTemplate(chrome.extension.getURL("/content/template"),templates , function(){
		app = new BuilderModel(wrapper);
		window.app = app;
		setTimeout(function(){
			window.prettyPrint && prettyPrint();
		},100)
	});

	chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
		wrapper.classList.toggle("active");
		sendResponse(true);
	});
})();