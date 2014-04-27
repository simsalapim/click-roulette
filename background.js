var iconClicked=false;

//Listen to if the icon has been clicked
chrome.browserAction.onClicked.addListener(function(tab) {
	console.log("icon clicked: "+iconClicked)
	if(iconClicked){
		iconClicked=false;
	}
	else{
	iconClicked=true;
	}
	console.log("icon clicked send to content: "+iconClicked)
	chrome.tabs.sendMessage(tab.id, iconClicked);

});

//Receive if the roulette session is over from content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    iconClicked=request;
  });
