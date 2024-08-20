"use client";

import Image from "next/image";
import { MouseEventHandler, useState } from "react";

export function Swipe() {
  const [swipe, setSwipe] = useState(false);

  const ToogleSwipe: MouseEventHandler<HTMLDivElement | HTMLButtonElement> = (
    event
  ) => {
    setSwipe(!swipe);
  };
  return (
    <div id="SignInWindow">
      <Image src="/login/signIn.jpg" width={300} height={151} alt="signIn" />
      <div id="arrowBack" onClick={ToogleSwipe}>
        <Image
          src="/login/arrowDown.svg"
          width={20}
          height={20}
          alt="arrow back"
        />
      </div>
      <div id="swipeContainer">
        <form id="logInForm">
          <div
            id="usernamePage"
            className={swipe ? "swipe true" : "swipe false"}
          >
            <input name="usrName" placeholder="Benutzername" />
            <button
              id="weiter"
              className="nextPage button"
              onClick={ToogleSwipe}
            >
              weiter
            </button>
          </div>
          <div
            id="passwordPage"
            className={swipe ? "swipe true" : "swipe false"}
          >
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
