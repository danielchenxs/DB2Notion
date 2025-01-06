document.addEventListener('DOMContentLoaded', function() {
    // 获取当前标签页并执行content script
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'content-script.js'}
      );
    });
  });