"use client";
export default function onlineStatus() {
  const onFocus = () => {
    console.log("focus");
  };
  const onBlur = () => {
    console.log("blur");
  };
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);
}
