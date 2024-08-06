"use client";
import MessageDisplayer from "./massagesDisplayer";
import { MessagesDisplay } from "app/lib/definitions";
import { Dispatch, SetStateAction, Suspense, useState } from "react";
import MessagesTable from "./massagesTable";
import MessageDisplayerHeading from "./massagesDisplayerHeading";

export default function MessagesContainer() {
  /* const userId = (await auth())?.user?.id;
  if (userId!) return null; */
  const [selected, setSelected] = useState<MessagesDisplay[] | null>(null);
  const [headingInfo, setHeadingInfo] = useState<MessagesDisplay | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  return (
    <div id="messageContainer">
      <MessagesTable
        setSelected={setSelected}
        setSelectedIndex={setSelectedIndex}
        setHeadingInfo={setHeadingInfo}
        selectedIndex={selectedIndex}
      />
      <div id="messageDisplay">
        <MessageDisplayerHeading headingInfo={headingInfo} />
        <MessageDisplayer selected={selected} />
      </div>
    </div>
  );
}
