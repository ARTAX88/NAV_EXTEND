const HIGHLIGHT_CLASS = 'nav-extend__highlight';
const STYLE_ELEMENT_ID = 'nav-extend-style';
const HIGHLIGHT_DURATION = 2200;

function generateHeadingId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `nav-extend-${crypto.randomUUID()}`;
  }

  return `nav-extend-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function ensureStyleElement() {
  if (document.getElementById(STYLE_ELEMENT_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      outline: 3px solid #1e88e5;
      outline-offset: 4px;
      transition: outline 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(style);
}

function collectHeadings() {
  const selector = 'h1, h2, h3, h4, h5, h6';
  const elements = Array.from(document.querySelectorAll(selector));

  return elements
    .map((heading) => {
      const text = heading.textContent?.trim();
      if (!text) {
        return null;
      }

      if (!heading.id) {
        heading.id = generateHeadingId();
      }

      const level = Number.parseInt(heading.tagName.substring(1), 10);

      return {
        id: heading.id,
        text,
        level,
      };
    })
    .filter(Boolean);
}

function scrollToHeading(id) {
  if (!id) {
    return { success: false };
  }

  const target = document.getElementById(id);
  if (!target) {
    return { success: false };
  }

  ensureStyleElement();
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target.classList.add(HIGHLIGHT_CLASS);

  window.setTimeout(() => {
    target.classList.remove(HIGHLIGHT_CLASS);
  }, HIGHLIGHT_DURATION);

  return { success: true };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || !message.type) {
    return;
  }

  if (message.type === 'collectHeadings') {
    const headings = collectHeadings();
    sendResponse({ headings });
  }

  if (message.type === 'scrollToHeading') {
    const result = scrollToHeading(message.id);
    sendResponse(result);
  }
});
