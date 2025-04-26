// When extension is installed or updated…
chrome.runtime.onInstalled.addListener(() => {
    const DEFAULT_FIELDS = ['host', 'source', 'sourcetype'];
    chrome.storage.sync.get('fields', (result) => {
        if (!result.fields) {
            // chrome.storage.local.set({ fields: DEFAULT_FIELDS });
        }
    });
});
