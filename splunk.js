const waitForElement = (selector, root = document.body) => {
  return new Promise((resolve, rejet) => {
    const existing = document.querySelector(selector);
    if (existing) {
      print(`selector ${selector} exists!. ${existing}`);
      return resolve(existing);
    }

    print(`Adding observer for element: ${selector}`);
    const observer = new MutationObserver((mutations, obs) => {
      const found = document.querySelector(selector);
      if (found) {
        obs.disconnect();
        print(`${selector} found! Observer disconnected.`);
        resolve(found);
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
    });
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
  allFieldsBtn.click();
};

const closeAllFieldsSection = () => {
  const closeSelectFieldsDialogBtn = document.querySelector('div.modal.shared-fieldpicker.in button.close');
  closeSelectFieldsDialogBtn.click();
};

const applySavedFieldsSelection = async () => {
  await waitForElement(`td.col-select label.checkbox a[data-value="host"]`);
  const table = document.querySelector('tbody.fields-list');
  // RESET CHECKBOXES:
  const allAnchors = table.querySelectorAll('td.col-select label.checkbox a');
  allAnchors.forEach((anchor) => {
    const icon = anchor.querySelector('i.icon-check');
    if (icon && icon.style.display !== 'none') {
      anchor.click();
    }
  });

  // APPLY SELECTED FIELDS:
  const fields = await getSelectedFields();
  fields.forEach((name) => {
    // an <a> inside a td.col-select > label.checkbox
    const selector = `td.col-select label.checkbox a[data-value="${name}"]`;
    const anchor = table.querySelector(selector);
    if (!anchor) return; // field not in this table

    // inside that <a> is an <i class="icon-check"> whose style.display === "none" if unchecked
    const icon = anchor.querySelector('i.icon-check');
    const isChecked = icon && icon.style.display !== 'none';

    if (!isChecked) {
      // simulate the user clicking it
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
    const navContainer = await waitForElement(navContainerSelector);
    addAutoSelectButton(navContainer);
  } catch (err) {
    print(`Error waiting for toolbar: '${err}`);
  }
});

// table - table.table.table-striped table-row-expanding.table-chrome.table-fields-list
// tr - tr.shared-fieldpicker-table-tablerow
// td = td.col-fields , td.col-select
