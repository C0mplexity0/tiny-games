import React from "react";



function Sidebar() {
  return (
    <div className="w-16 h-full border-r p-2">
      <div className="flex flex-col">
        
      </div>
      <div className="flex-1" />
      <div className="flex flex-col">

      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="size-full flex flex-row">
      <Sidebar />
    </div>
  )
}
