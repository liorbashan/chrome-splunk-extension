const _waitRegistry = new Map();

const waitForElement = (selector, root = document.body) => {
  if (_waitRegistry.has(selector)) {
    throw new Error(`Selector ${selector} is already in the waiting list!`);
  }

  return new Promise((resolve, rejet) => {
    const existing = document.querySelector(selector);
    if (existing) {
      _waitRegistry.delete(selector);
      print(`selector ${selector} exists!. ${existing}`);
      return resolve(existing);
    }

    print(`Adding observer for element: ${selector}`);
    const observer = new MutationObserver((mutations, obs) => {
      const found = document.querySelector(selector);
      if (found) {
        obs.disconnect();
        _waitRegistry.delete(selector);
        print(`${selector} found! Observer disconnected.`);
        resolve(found);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
    _waitRegistry.set(selector, observer);
  });
};

const addAutoSelectButton = (parentElement) => {
  const lastAnchorChild = parentElement.querySelector(':scope > a:last-of-type');
  const anchorClassName = lastAnchorChild ? lastAnchorChild.classList : 'btn-pill';
  const autoSelectFieldsBtn = document.createElement('a');
  autoSelectFieldsBtn.className = `autoSelectFieldsBtn ${anchorClassName}`;
  autoSelectFieldsBtn.textContent = 'CSOD apply fields';
  autoSelectFieldsBtn.href = '#';
  autoSelectFieldsBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    openAllFieldsSection();
    await applySavedFieldsSelection();
    closeAllFieldsSection();
  });
  parentElement.appendChild(autoSelectFieldsBtn);
};

const openAllFieldsSection = () => {
  const allFieldsBtn = document.querySelector('div.search-results-eventspane-fieldsviewer a.all');
  if (allFieldsBtn) allFieldsBtn.click();
};

const closeAllFieldsSection = () => {
  const closeSelectFieldsDialogBtn = document.querySelector('div.modal.shared-fieldpicker.in button.close');
  if (closeSelectFieldsDialogBtn) closeSelectFieldsDialogBtn.click();
};

const applySavedFieldsSelection = async () => {
  await waitForElement(`td.col-select label.checkbox a[data-value="host"]`).catch((error) => {
    print(error.message);
  });
  const table = document.querySelector('tbody.fields-list');
  // RESET CHECKBOXES:
  const allAnchors = table.querySelectorAll('td.col-select label.checkbox a');
  if (allAnchors) {
    allAnchors.forEach((anchor) => {
      const icon = anchor.querySelector('i.icon-check');
      if (icon && icon.style.display !== 'none') {
        anchor.click();
      }
    });
  }

  // APPLY SELECTED FIELDS:
  const fields = await getSelectedFields();
  fields.forEach((name) => {
    const selector = `td.col-select label.checkbox a[data-value="${name}"]`;
    const anchor = table.querySelector(selector);
    if (!anchor) return;

    const icon = anchor.querySelector('i.icon-check');
    const isChecked = icon && icon.style.display !== 'none';

    if (!isChecked) {
      anchor.click();
    }
  });
};

const onDomReady = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};

onDomReady(async () => {
  try {
    const navContainerSelector = '[data-role="app-nav-container"]';
    const navContainer = await waitForElement(navContainerSelector).catch((error) => {
      print(error.message);
    });
    addAutoSelectButton(navContainer);
  } catch (err) {
    print(`Error waiting for toolbar: '${err}`);
  }
});
