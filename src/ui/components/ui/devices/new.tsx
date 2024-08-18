import React from "react";
import { Button } from "../button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Clover } from "../shapes";

export default function DeviceNewButton({ to }: { to: string }) {
  return (
    <Button className="size-full p-0 bg-transparent hover:bg-transparent relative" asChild>
      <Link to={to}>
        <Clover className="pointer-events-none size-full absolute block text-secondary top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <Plus className="size-3/5 absolute block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary-foreground" />
      </Link>
    </Button>
  )
}
