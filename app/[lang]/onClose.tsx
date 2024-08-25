"use client";

import { useEffect } from "react";
import { useIdleTimer } from "react-idle-timer";

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
  }, []);

  const onIdle = () => {
    window.addEventListener("beforeunload", () =>
      fetch(`/api/new-messages-email-timer`)
    );
  };

  useIdleTimer({
    onIdle,
    timeout: 600_000,
    throttle: 500,
  });
  return null;
}
