import { Img } from "@react-email/components";

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
