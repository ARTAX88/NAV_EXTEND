const headingsList = document.getElementById('headings');
const emptyState = document.getElementById('popup-empty');
const filterInput = document.getElementById('filter');

let headingsCache = [];

async function queryActiveTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.id ?? null;
}

function sendMessageToTab(tabId, message) {
  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        reject(lastError);
        return;
      }
      resolve(response);
    });
  });
}

function renderHeadings(list) {
  headingsList.textContent = '';

  if (!list.length) {
    headingsList.setAttribute('aria-hidden', 'true');
    emptyState.classList.remove('popup__empty--hidden');
    return;
  }

  headingsList.removeAttribute('aria-hidden');
  emptyState.classList.add('popup__empty--hidden');

  const fragment = document.createDocumentFragment();

  list.forEach((heading) => {
    const item = document.createElement('li');
    item.className = 'popup__item';
    item.dataset.level = heading.level.toString();
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
    item.dataset.id = heading.id;

    const level = document.createElement('span');
    level.className = 'popup__level';
    level.textContent = `H${heading.level}`;

    const text = document.createElement('p');
    text.className = 'popup__text';
    text.textContent = heading.text;

    item.append(level, text);

    item.addEventListener('click', () => handleHeadingClick(heading.id));
    item.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleHeadingClick(heading.id);
      }
    });

    fragment.appendChild(item);
  });

  headingsList.appendChild(fragment);
}

async function handleHeadingClick(id) {
  const tabId = await queryActiveTabId();
  if (!tabId) {
    return;
  }

  try {
    await sendMessageToTab(tabId, { type: 'scrollToHeading', id });
    window.close();
  } catch (error) {
    console.error('NAV Extend: impossible de faire défiler la page.', error);
  }
}

function applyFilter(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    renderHeadings(headingsCache);
    return;
  }

  const filtered = headingsCache.filter((heading) =>
    heading.text.toLowerCase().includes(normalized)
  );

  renderHeadings(filtered);
}

async function hydrateHeadings() {
  const tabId = await queryActiveTabId();

  if (!tabId) {
    emptyState.textContent =
      "Aucun onglet actif n'a été détecté. Veuillez réessayer.";
    emptyState.classList.remove('popup__empty--hidden');
    return;
  }

  try {
    const response = await sendMessageToTab(tabId, { type: 'collectHeadings' });
    headingsCache = Array.isArray(response?.headings) ? response.headings : [];
    renderHeadings(headingsCache);
  } catch (error) {
    console.error('NAV Extend: impossible de récupérer les titres.', error);
    emptyState.textContent =
      "Impossible d'analyser cette page. Vérifiez les permissions de l'extension.";
    emptyState.classList.remove('popup__empty--hidden');
  }
}

filterInput.addEventListener('input', (event) => {
  applyFilter(event.target.value);
});

document.addEventListener('DOMContentLoaded', () => {
  hydrateHeadings();
});
