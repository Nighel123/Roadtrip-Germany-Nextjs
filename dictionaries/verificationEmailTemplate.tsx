import { Img } from "@react-email/components";

export const VerificationEmailTemplate = ({
  username,
  email,
  confirmLink,
  lang,
}: {
  username: string;
  email: string;
  confirmLink: string;
  lang: "en" | "de";
}) => {
  if (lang === "en")
    return (
      <div>
        <h1>A warm welcome to you, {username}!</h1>
        <p>
          You have recently registered at{" "}
          <a href="www.roadtrip-germany.de">www.roadtrip-germany.de</a> with the
          email: {email}. With this Email we are sending you the
          confirmation-link to validate that your email address actually exists.
        </p>
        <p>
          Click <a href={confirmLink}>here</a> to confirm your email.
        </p>
        <Img
          src="https://www.roadtrip-germany.de/images/routesOverview/loadingmap.gif"
          width={555}
          height={360}
          alt="loading map"
          id="mapSkeleton"
        />
      </div>
    );
  return (
    <div>
      <h1>Ein herzliches willkommen, {username}!</h1>
      <p>
        Du hast dich kürzlich registiert auf{" "}
        <a href="www.roadtrip-germany.de">www.roadtrip-germany.de</a> mit der
        Email: {email}. Mit dieser Email senden wir dir den bestätigunglink um
        sicherzustellen, dass deinee angegebene Email auch wirklich existiert.
      </p>
      <p>
        Klicke <a href={confirmLink}>hier</a> um deine Email zu bestätigen.
      </p>
      <Img
        src="https://www.roadtrip-germany.de/images/routesOverview/loadingmap.gif"
        width={555}
        height={360}
        alt="loading map"
        id="mapSkeleton"
      />
    </div>
  );
};
