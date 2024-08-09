"use client";

import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import { useFormState } from "react-dom";
import { authenticate } from "app/lib/actions";
import { useSearchParams } from "next/navigation";
import SubmitButton from "./submitButton";
import GoogleLogin from "./googleLogin";

export function Form() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const [swipe, setSwipe] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/";
  const verificationToken =
    searchParams?.get("verification_token") || undefined;

  const ToogleSwipe: MouseEventHandler<HTMLDivElement | HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
    setSwipe(!swipe);
  };
  return (
    <div id="SignInWindow">
      <Image
        src="/login/signIn.jpg"
        width={300}
        height={151}
        alt="signIn"
        id="signInImage"
      />
      {verificationToken ? (
        <h1>Log dich ein, um deine Email zu verifizieren.</h1>
      ) : null}
      <div
        id="arrowBack"
        className={swipe ? "show" : "hide"}
        onClick={ToogleSwipe}
      >
        <Image
          src="/login/arrowDown.svg"
          width={20}
          height={20}
          alt="arrow back"
        />
      </div>

      <form id="logInForm" action={dispatch}>
        <input hidden name="callbackUrl" value={callbackUrl} readOnly />
        <input
          hidden
          name="verificationToken"
          value={verificationToken}
          readOnly
        />
        <div id="swipeContainer" className={swipe ? "right" : "left"}>
          <div id="usernamePage">
            <input
              name="username"
              placeholder="Benutzername"
              /* defaultValue={"Nighel123"} */
            />
            <button
              id="weiter"
              className="nextPage button"
              onClick={ToogleSwipe}
            >
              weiter
            </button>
          </div>
          <div id="passwordPage">
            <input
              name="password"
              type="password"
              placeholder="Passwort"
              /* defaultValue={"Nighel123@gmail.com"} */
            />
            <SubmitButton />
          </div>
        </div>
      </form>
      <GoogleLogin callbackUrl={callbackUrl} />
      {errorMessage && (
        <>
          <p className="errorMssg">{errorMessage}</p>
        </>
      )}
    </div>
  );
}
