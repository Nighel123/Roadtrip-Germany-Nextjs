import "@/styles/newPassword.css";
import NewPasswordForm from "./newPasswordForm";
import { getDictionary } from "../dictionaries";
import Title from "ui/components/title";
import { Suspense } from "react";

export default async function Page({
  params: { lang },
}: {
  params: { lang: "en" | "de" };
}) {
  const dict = await getDictionary(lang);
  return (
    <div className="newPassword">
      <Title />
      <h1>set a new password</h1>
      <Suspense>
        <NewPasswordForm dict={dict} />
      </Suspense>
    </div>
  );
}
