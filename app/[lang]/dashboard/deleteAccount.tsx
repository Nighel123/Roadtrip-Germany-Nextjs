"use client";
import Modal from "react-modal";
import { ChangeEvent, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { deleteRoadtrip, deleteUser } from "lib/actions";
import SubmitButtonDeleteAcc from "./submitButtonDeleteAcc";
import { Dict } from "../dictionaries";

export default function DeleteAccount({ dict }: { dict: Dict }) {
  const { dashboard } = dict;
  const [errorMessage, dispatch] = useFormState(deleteUser, undefined);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [blockSubmit, setBlockSubmit] = useState(true);
  const [text, setText] = useState<string | undefined>(undefined);
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
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setText(text);
    if (text === dashboard.action) setBlockSubmit(false);
  };

  return (
    <>
      <button onClick={openModal}>
        <h2>{dashboard.deleteAccount}</h2>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Benutzer Löschen"
        shouldCloseOnOverlayClick={true}
      >
        <h2>{dashboard.modalUser.heading}</h2>
        <button className="no" onClick={closeModal}>
          {dashboard.modalUser.no}
        </button>
        <p>{dashboard.modalUser.action}</p>
        <form action={dispatch} id="deleteUser">
          <input
            type="text"
            name="delete"
            onChange={handleChange}
            value={text}
          />
          <SubmitButtonDeleteAcc dict={dict} blockSubmit={blockSubmit} />
        </form>
        {errorMessage && (
          <>
            <p className="errorMssg">
              {dashboard.modalUser.error[errorMessage]}
            </p>
          </>
        )}
      </Modal>
    </>
  );
}
