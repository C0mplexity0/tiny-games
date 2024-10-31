import { connectLink } from "@app/App";
import { openLinkInBrowser } from "@app/utils";
import { Button } from "@components/ui/button";
import { Content, TitleBar } from "@components/ui/pages/page-structure";
import React from "react";
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function ConnectDevicePage() {
  let [qrCode, setQrCode] = useState(<div />);

  window.electron.ipcRenderer.once("getConnectQrCode", (code: string) => {
    setQrCode(<img className="w-48 h-48 rounded-md" src={code} />);
  });
  window.electron.ipcRenderer.sendMessage("getConnectQrCode");

  return (
    <div className="size-full">
      <Helmet>
        <title>Connect Devices</title>
      </Helmet>
      <TitleBar />
      <Content>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-full h-48 flex justify-center">
            {qrCode}
          </div>
          <div className="mt-2 w-full flex flex-col">
            <h2 className="text-center text-2xl font-bold">Scan the code with your phone</h2>
            <span className="text-center inline-block w-full align-top font-regular text-lg">or go to <a onClick={() => openLinkInBrowser(connectLink)} className="text-blue-500 cursor-pointer underline">{connectLink}</a></span>
          </div>
        </div>
        <div className="w-full absolute bottom-0 p-3">
          <Button className="float-right" asChild><Link to="/devices/add-devices">Done</Link></Button>
        </div>
      </Content>
    </div>
  )
}
