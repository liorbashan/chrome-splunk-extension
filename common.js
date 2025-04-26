const DEFAULT_FIELDS = ['host', 'source', 'sourcetype'];
const SELECTED_FIELDS_KEY_NAME = 'fields';
const PRINT_PREFIX = '[SPLUNK EXTENSION]: ';
let selectedFields = null;

const print = (text, level) => {
    console.log(`${PRINT_PREFIX}${text}`);
};

const getSelectedFields = async () => {
    const storageResult = await chrome.storage.local.get({ [SELECTED_FIELDS_KEY_NAME]: DEFAULT_FIELDS }).catch(() => {
        print('no selected fields available');
    });

    print(`Selected Fields: ${storageResult[SELECTED_FIELDS_KEY_NAME]}`);
    return storageResult[SELECTED_FIELDS_KEY_NAME];
};

const saveSelectedFields = async (data) => {
    await chrome.storage.local.set({ [SELECTED_FIELDS_KEY_NAME]: data }).catch(() => {
        print('failed to save selected fields');
    });

    print(`${data} was saved as selected fields!`);
};

const clearSelectedFields = async () => {
    await chrome.storage.local.remove([SELECTED_FIELDS_KEY_NAME]).catch(() => {
        print('Failed to remove selected fields');
    });

    print('Selected fields cleared successfully!');
};

const isNullOrUndefined = (value) => {
    return value === null || value === undefined;
};
