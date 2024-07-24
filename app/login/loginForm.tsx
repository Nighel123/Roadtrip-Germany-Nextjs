"use client";

import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "app/lib/actions";
import { useSearchParams } from "next/navigation";

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
      <div id="swipeContainer">
        <form id="logInForm" action={dispatch}>
          <input hidden name="callbackUrl" value={callbackUrl} />
          <input hidden name="verificationToken" value={verificationToken} />

          <div id="usernamePage" className={swipe ? "unfocus" : "focus"}>
            <input
              name="username"
              placeholder="Benutzername"
              defaultValue={"Nighel123"}
            />
            <button
              id="weiter"
              className="nextPage button"
              onClick={ToogleSwipe}
            >
              weiter
            </button>
          </div>
          <div id="passwordPage" className={swipe ? "focus" : "unfocus"}>
            <input
              name="password"
              type="password"
              placeholder="Passwort"
              defaultValue={"Nighel123@gmail.com"}
            />
            <input
              type="submit"
              id="logIn"
              className="button"
              value="einloggen"
            />
          </div>
        </form>
      </div>
      {errorMessage && (
        <>
          <p className="errorMssg">{errorMessage}</p>
        </>
      )}
    </div>
  );
}
