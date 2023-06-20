chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Filter Tweet",
    contexts: ["selection"],
    id: "defilMenu",
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId == "defilMenu") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "getSelectedElement",
        type: "popup-modal",
        value: info.selectionText,
      });
    });
  }
});
