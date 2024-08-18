import { Device } from "@/devices/devices";
import { devices } from "@app/App";
import { Button } from "@components/ui/button";
import DeviceNewButton from "@components/ui/devices/new";
import DeviceProfile from "@components/ui/devices/profile";
import { PageHeader, PageSubtitle, PageTitle } from "@components/ui/text/page-header";
import React from "react";
import { Link } from "react-router-dom";

function DeviceDisplay({ device, newButton }: { device?: Device, newButton?: boolean }) {
  return (
    <div className="w-32 h-32">
      <div className="w-24 h-24 relative left-1/2 -translate-x-1/2">
        {
          newButton ? 
          <DeviceNewButton to="/devices/connect-device" />
          :
          device ?
          <DeviceProfile device={device} className="w-24 h-24 absolute left-1/2 -translate-x-1/2" />
          :
          "Error"
        }
      </div>
      <span className="inline-block w-full h-3 text-md align-bottom text-center">
        {
          newButton ? 
          "Add Device"
          :
          device ?
          device.username
          :
          "Error"
        }
      </span>
    </div>
  )
}

export default function AddDevicesPage() {
  return (
    <div className="size-full flex flex-col">
      <PageHeader>
        <PageTitle>Add Devices</PageTitle>
        <PageSubtitle>You can change these later</PageSubtitle>
      </PageHeader>
      <div className="flex-1 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-fit flex flex-wrap justify-center align-middle gap-x-5">
          {
            devices.map((device, i) => <DeviceDisplay key={i} device={device} />)
          }
          <DeviceDisplay newButton={true} />
        </div>
      </div>
      <div className="footer h-40px p-3">
        {
          devices.length == 0 ?
          <Button disabled className="float-right">Continue</Button> :
          <Button className="float-right" asChild><Link to="/">Continue</Link></Button>
        }
      </div>
    </div>
  )
}
