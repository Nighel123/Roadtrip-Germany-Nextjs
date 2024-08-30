import { useEffect, useState } from "react";
import Modal from "react-modal";
import { resendVerification, sendPwResetToken } from "./actions";
import { useFormState } from "react-dom";
import { Dict } from "../dictionaries";
import ModalSubmitButton from "./modalSubmitButton";
import { MouseEvent } from "react";

export function useModal({
  actionSelect,
}: {
  actionSelect: "sendPwResetToken" | "sendVerification";
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const initialState: string[] | null = null;
  const action =
    actionSelect === "sendPwResetToken" ? sendPwResetToken : resendVerification;
  const [state, dispatch] = useFormState(action, initialState);
  useEffect(() => Modal.setAppElement(".login"));

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
  const ModalJSX = ({ dict }: { dict: Dict }) => {
    const {
      logIn: { modal },
    } = dict;
    const errorMssg = modal[actionSelect] as {
      [key: string]: string;
    };

    return (
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
            state.map((error) => (
              <p className="errorMssg">{errorMssg[error]}</p>
            ))}
        </form>
      </Modal>
    );
  };

  return { ModalJSX, openModal };
}
