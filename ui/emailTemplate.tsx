import {
  Body,
  Container,
  Column,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface EmailTemplateProps {
  username: string;
  email: string;
  confirmLink: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  username,
  email,
  confirmLink,
}) => (
  <div>
    <h1>A warm welcome to you, {username}!</h1>
    <p>
      You have recently registered at{" "}
      <a href="www.roadtrip-germany.de">www.roadtrip-germany.de</a> with the
      email: {email}. With this Email we are sending you the confirmation-link
      to validate that your email address actually exists.
    </p>
    <p>
      Click <a href={confirmLink}>here</a> to confirm your email.
    </p>
    <Img
      src="https://www.roadtrip-germany.de/routesOverview/loadingmap.gif"
      width={555}
      height={360}
      alt="loading map"
      id="mapSkeleton"
    />
  </div>
);
