export function openLinkInBrowser(to: string) {
  window.electron.ipcRenderer.sendMessage("openLinkInBrowser", to);
}
