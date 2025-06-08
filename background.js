chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const sensitiveKeywords = ["suicide", "self-harm", "porn", "adult", "nsfw"];
    if (changeInfo.url) {
        const url = changeInfo.url.toLowerCase();
        const matched = sensitiveKeywords.some(keyword => url.includes(keyword));
        if (matched) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["content.js"]
            });
        }
    }
});
