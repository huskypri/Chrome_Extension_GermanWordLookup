document.getElementById("close-sidebar").onclick = function() {
  // Send a message to the parent window to close the sidebar
  window.parent.postMessage({ type: "close-dictcc-sidebar" }, "*");
};

function showTranslation(word) {
  document.getElementById("hint").innerText = "Translating: " + word;
  const url = `https://www.dict.cc/?s=${encodeURIComponent(word)}`;
  document.getElementById("dictcc-frame").src = url;
}

// Listen for messages from content script
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "translate" && event.data.word) {
    showTranslation(event.data.word);
  }
});