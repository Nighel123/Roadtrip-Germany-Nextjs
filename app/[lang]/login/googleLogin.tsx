import { SignIn } from "lib/actions";
import GoogleButton from "ui/components/googleButton";

export default function GoogleLogin({ callbackUrl }: { callbackUrl: string }) {
  return (
    <form
      id="googleLogin"
      action={() => {
        SignIn(callbackUrl);
      }}
    >
      <GoogleButton />
    </form>
  );
}
