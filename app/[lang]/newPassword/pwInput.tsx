"use client";

import { useShowPw } from "lib/hooks/useShowPw";

export default function PwInput() {
  const { type, clickElement } = useShowPw();
  return (
    <div className="newPasswordInput">
      <input type={type} placeholder="password" name="newPassword"></input>
      {clickElement}
      <button type="submit">Reset Password</button>
    </div>
  );
}
