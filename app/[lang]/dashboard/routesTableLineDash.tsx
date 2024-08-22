"use client";
import { RoadtripDisplay } from "lib/definitions";
import { formatDateToLocal } from "lib/utils/utils";
import Link from "next/link";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useFormState } from "react-dom";
import { deleteRoadtrip } from "lib/actions";
import SubmitButton from "./submitButton";
import { Dict } from "../dictionaries";

export default function routesTableLineDash({
  roadtrip,
  dict,
}: {
  roadtrip: RoadtripDisplay;
  dict: Dict;
}) {
  const { table } = dict.dashboard;
  const [errorMessage, dispatch] = useFormState(deleteRoadtrip, undefined);
  const [modalIsOpen, setIsOpen] = useState(false);
  useEffect(() => Modal.setAppElement("#dashboard"));
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
        <Link href={link} className="tableLink">
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
          <div className="tableItem">
            {formatDateToLocal(roadtrip.roadtripDate)}
          </div>
        </Link>
        <Link
          className="tableItem edit"
          href={`/insertRoadtrip?id=${roadtrip.id}`}
        >
          <PencilIcon />
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
        <h2>{table.modalRoadtrip.heading}</h2>
        <button className="no" onClick={closeModal}>
          {table.modalRoadtrip.no}
        </button>
        <form action={dispatch}>
          <input hidden name={"id"} value={roadtrip.id} />
          <SubmitButton dict={dict} />
        </form>
        {errorMessage && (
          <>
            <p className="errorMssg">
              {table.modalRoadtrip.error[errorMessage]}
            </p>
          </>
        )}
      </Modal>
    </>
  );
}
