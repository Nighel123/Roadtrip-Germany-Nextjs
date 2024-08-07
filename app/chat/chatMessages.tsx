import { MessagesDisplay, RoadtripDisplay } from "app/lib/definitions";
import { sortMessages } from "app/lib/utils";
import { useSession } from "next-auth/react";

export default function ChatMessages({
  selected,
}: {
  selected: MessagesDisplay[];
}) {
  const session = useSession();
  const userID = session.data?.user?.id;
  if (!userID) return null;
  const sorted = sortMessages(selected);
  let rows = sorted.map((message) => {
    return (
      <div
        key={`sorted-${message.id}`}
        className={message.from === Number(userID) ? "me" : "other"}
      >
        {message.text}
      </div>
    );
  });

  return (
    <>
      <div id="messages">{rows}</div>
    </>
  );
}
