let sidebarInjected = false;
let lastHoveredWord = null;

function injectSidebar() {
  if (sidebarInjected) return;
  sidebarInjected = true;

  const sidebar = document.createElement("iframe");
  sidebar.src = chrome.runtime.getURL("sidebar.html");
  sidebar.id = "dictcc-sidebar";
  sidebar.style.position = "fixed";
  sidebar.style.top = "0";
  sidebar.style.right = "0";
  sidebar.style.width = "600px";
  sidebar.style.height = "100%";
  sidebar.style.zIndex = "999999";
  sidebar.style.border = "none";
  sidebar.style.background = "#fff";
  sidebar.style.boxShadow = "0 0 8px rgba(0,0,0,0.2)";
  sidebar.style.transition = "none";
  document.body.appendChild(sidebar);

  // Trigger animation
  setTimeout(() => {
    sidebar.classList.add("visible");
  }, 10);
}

function sendWordToSidebar(word) {
  injectSidebar();
  const sidebar = document.getElementById("dictcc-sidebar");
  sidebar.contentWindow.postMessage({ type: "translate", word }, "*");
}

// Listen for F2 (from background)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "translate-selection") {
    const selection = window.getSelection().toString().trim();
    if (selection) {
      sendWordToSidebar(selection);
    }
  }
});

function removeSidebarWithAnimation() {
  const sidebar = document.getElementById("dictcc-sidebar");
  if (sidebar) {
    sidebar.classList.remove("visible");
    setTimeout(() => {
      if (sidebar.parentNode) sidebar.parentNode.removeChild(sidebar);
      sidebarInjected = false;
    }, 350);
  } else {
    sidebarInjected = false;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    removeSidebarWithAnimation();
  }
});

window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "close-dictcc-sidebar") {
    removeSidebarWithAnimation();
  }
});