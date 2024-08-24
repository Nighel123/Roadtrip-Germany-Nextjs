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
      src="https://www.roadtrip-germany.de/images/routesOverview/loadingmap.gif"
      width={555}
      height={360}
      alt="loading map"
      id="mapSkeleton"
    />
  </div>
);

export const NewMessagesTemplate = ({
  recipientName,
  senderName,
  text,
}: {
  recipientName: string;
  text: string;
  senderName: string;
}) => (
  <div>
    <h1>Hello, {recipientName}!</h1>
    <p>You have new messages from {senderName}:</p>
    <p>{text}</p>
    <p>
      See the chat on{" "}
      <a href="www.roadtrip-germany.de/chat">www.roadtrip-germany.de</a> to
      react on your new messages.
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
