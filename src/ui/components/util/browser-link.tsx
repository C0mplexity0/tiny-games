import React from "react";

interface BrowserLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  to: string
}

const BrowserLink = React.forwardRef<HTMLAnchorElement, BrowserLinkProps>(({ to, className, ...props }, ref) => {
  return (
    <a className={`cursor-pointer ${className}`} ref={ref} onClick={() => {
      console.log("open");
      console.log(to);
      window.electron.ipcRenderer.sendMessage("openLinkInBrowser", to);
    }} {...props} />
  );
});

export default BrowserLink;
