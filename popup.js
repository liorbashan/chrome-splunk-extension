const inputEl = document.getElementById('fieldInput');
const addBtn = document.getElementById('addBtn');
const saveBtn = document.getElementById('saveBtn');
const listEl = document.getElementById('fieldsList');
const messageSpan = document.getElementById('message');
let popUpSelectedFields = [];

const init = async () => {
    if (!isNullOrUndefined(popUpSelectedFields)) {
        popUpSelectedFields = await getSelectedFields();
    }

    renderList();
};

// Render the list, attach remove + drag‐drop handlers
const renderList = () => {
    listEl.innerHTML = '';

    popUpSelectedFields.forEach((field, idx) => {
        const li = document.createElement('li');
        li.textContent = field;
        li.draggable = true;

        // Remove button
        const x = document.createElement('button');
        x.textContent = '✕';
        x.style.border = 'none';
        x.style.background = 'transparent';
        x.onclick = () => {
            popUpSelectedFields.splice(idx, 1);
            renderList();
        };
        li.appendChild(x);

        // DRAG START
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', idx);
            e.dataTransfer.effectAllowed = 'move';
        });

        // DRAG OVER
        li.addEventListener('dragover', (e) => {
            e.preventDefault(); // allow drop
            li.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
        });

        // DRAG LEAVE
        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over');
        });

        // DROP
        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.classList.remove('drag-over');

            const fromIndex = Number(e.dataTransfer.getData('text/plain'));
            const toIndex = idx;
            if (fromIndex !== toIndex) {
                // remove the item, then re-insert at new position
                const [moved] = popUpSelectedFields.splice(fromIndex, 1);
                popUpSelectedFields.splice(toIndex, 0, moved);
                renderList();
            }
        });

        listEl.appendChild(li);
    });
};

const toggleOverlay = (show) => {
    const overlay = document.querySelector('.overlay');
    if (!overlay) return;
    overlay.style.display = show ? 'flex' : 'none';
};

const clearMessageLine = () => {
    setTimeout(() => {
        messageSpan.textContent = '';
        messageSpan.className = '';
    }, 3200);
};

// Event Listeners
addBtn.addEventListener('click', () => {
    const val = inputEl.value.trim();
    if (val && !popUpSelectedFields.includes(val)) {
        popUpSelectedFields.push(val);
        renderList();
        inputEl.value = '';
    }
});

saveBtn.addEventListener('click', async () => {
    toggleOverlay(true);
    await saveSelectedFields(popUpSelectedFields).catch(() => {
        toggleOverlay(false);
        messageSpan.classList.add('red');
        messageSpan.textContent = 'Error';
        clearMessageLine();
        return;
    });
    setTimeout(() => toggleOverlay(false), 1000);
    messageSpan.classList.add('green');
    messageSpan.textContent = 'Saved!';
    clearMessageLine();
});

(async () => {
    await init();
})();
