chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "translate-selection") {
    chrome.tabs.sendMessage(tab.id, { action: "translate-selection" });
  }
});