import "@/styles/newPassword.css";

import PwInput from "./pwInput";

export default function Page({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  return (
    <div className="newPassword">
      <h1>set a new password</h1>
      <form>
        <PwInput />
        <input hidden readOnly value={searchParams.token} name="token" />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
