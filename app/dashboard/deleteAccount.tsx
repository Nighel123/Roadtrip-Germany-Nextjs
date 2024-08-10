"use client";
import Modal from "react-modal";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { deleteRoadtrip, deleteUser } from "lib/actions";

export default function DeleteAccount() {
  const [errorMessage, dispatch] = useFormState(deleteUser, undefined);
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

  return (
    <>
      <button onClick={openModal}>
        <h2>Account löschen</h2>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Benutzer Löschen"
        shouldCloseOnOverlayClick={true}
      >
        <h2>Willst du deinen Account wirklich löschen?</h2>
        <button className="no" onClick={closeModal}>
          Nein
        </button>
        <p>Tippe "Löschen" ein, um den Account zu löschen.</p>
        <form action={dispatch} id="deleteUser">
          <input type="text" name="delete" />
          <button type="submit" className="yes delete">
            Account Löschen
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
