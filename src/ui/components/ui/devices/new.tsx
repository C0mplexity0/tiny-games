import React from "react";
import { Button } from "../button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function DeviceNewButton({ to }: { to: string }) {
  return (
    <Button className="group size-full p-0 bg-tertiary-background hover:bg-tertiary-background relative rounded-[37.5%]" asChild>
      <Link to={to}>
        <Plus className="size-3/5 absolute block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-secondary-foreground" />
      </Link>
    </Button>
  );
}
