import { useEffect, useState } from "react";
import Modal from "react-modal";
import { sendPwResetToken } from "./sendResetPwToken";
import { useFormState } from "react-dom";
import { Dict } from "../dictionaries";
import ModalSubmitButton from "./modalSubmitButton";
import { MouseEvent } from "react";

export function usePwResetModal({ dict }: { dict: Dict }) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const initialState: string[] | null = null;
  const [state, dispatch] = useFormState(sendPwResetToken, initialState);
  useEffect(() => Modal.setAppElement("#SignInWindow"));

  function openModal(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
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
  const PwResetModal = ({ dict }: { dict: Dict }) => (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
      shouldCloseOnOverlayClick={true}
    >
      <h2>Please Enter your Email</h2>
      <form action={dispatch} id="forgotPassword">
        <input name="email" type="text" />
        <ModalSubmitButton dict={dict} />
        {state &&
          state.map((error) => {
            if (error !== "UNVERIFIED")
              return <p className="errorMssg">{error}</p>;
            else
              return (
                <>
                  <p>
                    We noticed that you are not verified yet. Would you like to
                    receive a new verification Email?
                  </p>
                  <input type="checkbox" />
                </>
              );
          })}
      </form>
    </Modal>
  );

  return { PwResetModal, openModal };
}
