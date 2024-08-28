"use client";

import { useShowPw } from "lib/hooks/useShowPw";
import { useSearchParams } from "next/navigation";
import { useFormState } from "react-dom";
import { updateNewPassword } from "./updateNewPassword";

export default function NewPasswordForm() {
  const { type, clickElement } = useShowPw();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || undefined;
  const initialState: null | string[] = null;
  const [state, dispatch] = useFormState(updateNewPassword, initialState);

  return (
    <>
      <form action={dispatch}>
        <input hidden readOnly value={token} name="token" />
        <div className="UsernameInput">
          <input type="text" name="username" placeholder="username"></input>
        </div>
        <div className="newPasswordInput">
          <input
            type={type}
            placeholder="new password"
            name="newPassword"
          ></input>
          {clickElement}
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {state &&
        state.map((error, index) => (
          <p key={`error-${index}-${error}`}>{error}</p>
        ))}
    </>
  );
}
