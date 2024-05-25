"use client";

import Image from "next/image";
import { MouseEventHandler, useState } from "react";

export function Form() {
  const [swipe, setSwipe] = useState(false);

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
        <form id="logInForm">
          <div id="usernamePage" className={swipe ? "unfocus" : "focus"}>
            <input name="usrName" placeholder="Benutzername" />
            <button
              id="weiter"
              className="nextPage button"
              onClick={ToogleSwipe}
            >
              weiter
            </button>
          </div>
          <div id="passwordPage" className={swipe ? "focus" : "unfocus"}>
            <input name="pw" type="password" placeholder="Passwort" />
            <input
              type="submit"
              id="logIn"
              className="button"
              value="einloggen"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
