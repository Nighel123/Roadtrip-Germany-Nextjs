import { Img } from "@react-email/components";

export const ResetPwEmailTemplate = ({
  username,
  resetLink,
  lang,
}: {
  username: string;
  resetLink: string;
  lang: "en" | "de";
}) => {
  if (lang === "en")
    return (
      <div>
        <h1>A warm hello to you, {username}!</h1>
        <p>
          With the following link you can renew your password:{" "}
          <a href={resetLink}>renew password</a>
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
      <h1>Ein herzliches Willkommen, {username}!</h1>
      <p>
        Mit dem folgenden Link kannst du ein neues Passwort festlegen:{" "}
        <a href={resetLink}>passwort erneuern</a>
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
