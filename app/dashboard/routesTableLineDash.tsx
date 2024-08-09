"use client";
import { Roadtrip, RoadtripDisplay } from "app/lib/definitions";
import { formatDateToLocal } from "app/lib/utils";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Modal from "react-modal";
import { useFormState } from "react-dom";
import { deleteRoadtrip } from "app/lib/actions";

export default function routesTableLineDash({
  roadtrip,
}: {
  roadtrip: RoadtripDisplay;
}) {
  const [errorMessage, dispatch] = useFormState(deleteRoadtrip, undefined);
  Modal.setAppElement("#dashboard");
  const [modalIsOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  const link = "/viewRoadtrip/" + roadtrip.id;

  return (
    <>
      <div className="tableRow">
        <div className="tableItem">{roadtrip.username}</div>
        <div className="tableItem">
          {roadtrip.startland}
          <br />
          {roadtrip.starttown}
        </div>
        <div className="tableItem">
          {roadtrip.destland}
          <br />
          {roadtrip.desttown}
        </div>
        <div className="tableItem">{formatDateToLocal(roadtrip.date)}</div>
        <Link href={`/insertRoadtrip?id=${roadtrip.id}`}>
          <div className="tableItem edit">
            <PencilIcon />
          </div>
        </Link>
        <div className="tableItem edit" onClick={openModal}>
          <TrashIcon />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        shouldCloseOnOverlayClick={true}
      >
        <h2>Willst du den Roadtrip wirklich löschen?</h2>
        <button className="no" onClick={closeModal}>
          Nein
        </button>
        <form action={dispatch}>
          <input hidden name={"id"} value={roadtrip.id} />
          <button type="submit" className="yes">
            Ja
          </button>
        </form>
        {errorMessage && (
          <>
            <p className="errorMssg">{errorMessage}</p>
          </>
        )}
      </Modal>
    </>
  );
}
