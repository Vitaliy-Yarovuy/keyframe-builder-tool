chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.sendRequest(tab.id, {task:'open'}, function(result){
		console.log("answer from content script: ",result);
	});
});

