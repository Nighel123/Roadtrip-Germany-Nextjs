"use client";

import { sendNewMessagesEmails } from "lib/mail";
import { useEffect } from "react";

/* export default function OnClose() {
  const handleWindowClose = () => sendNewMessagesEmails(30);
  useEffect(() => {
    window.addEventListener("beforeunload", handleWindowClose);
    return () => window.removeEventListener("beforeunload", handleWindowClose);
  }, []);

  return <div><div/>;
} */

export default function OnClose() {
  /* const handleWindowClose = () => sendNewMessagesEmails(30); */
  useEffect(() => {
    window.addEventListener("beforeunload", () =>
      fetch(`/api/new-messages-email-timer`)
    );
    return () =>
      window.removeEventListener("beforeunload", () =>
        fetch(`/api/new-messages-email-timer`)
      );
  }, []);
  return null;
}
