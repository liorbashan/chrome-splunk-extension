const DEFAULT_FIELDS = ['host', 'source', 'sourcetype'];
const SELECTED_FIELDS_KEY_NAME = 'fields';
const PRINT_PREFIX = '[SPLUNK EXTENSION]: ';

const print = (text, level) => {
  console.log(`[${getTimestamp()}] - ${PRINT_PREFIX}${text}`);
};

const getTimestamp = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
};

const getSelectedFields = async () => {
  const storageResult = await chrome.storage.local.get({ [SELECTED_FIELDS_KEY_NAME]: DEFAULT_FIELDS }).catch(() => {
    print('no selected fields available');
  });

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
