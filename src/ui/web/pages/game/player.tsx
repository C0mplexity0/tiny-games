import { currentGame } from "@web/Web";
import React from "react";

export default function PlayerPage() {
  if (!currentGame) {
    return;
  }

  const url = new URL(window.location.href);

  return (
    <div className="size-full">
      <div className="size-full">
        <iframe src={`http://${url.hostname}:9977/${currentGame.webRoot}`} className="size-full bg-white" />
      </div>
    </div>
  )
}
