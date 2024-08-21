import React from "react"

interface BrowserLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  to: string
}

export default function BrowserLink({ to, ...props }: BrowserLinkProps) {
  return (
    <a className="cursor-pointer" onClick={() => {
      window.electron.ipcRenderer.sendMessage("openLinkInBrowser", to);
    }} {...props} />
  )
}
