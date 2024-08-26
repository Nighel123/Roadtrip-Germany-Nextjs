import { Img } from "@react-email/components";

interface EmailTemplateProps {
  username: string;
  resetLink: string;
}

export const ResetPwEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  resetLink,
}) => (
  <div>
    <h1>A warm welcome to you, {username}!</h1>
    <p>
      With the following link you can reset your pw{" "}
      <a href={resetLink}>reset password</a>
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
