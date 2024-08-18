import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessagesDisplay } from "lib/definitions";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function ChatMessages({
  selected,
}: {
  selected: MessagesDisplay[];
}) {
  const session = useSession();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userID = session.data?.user?.id;
  //const [scroll, setScroll] = useState(true);

  /* const [isVisible, setIsVisible] = useState(false); */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: "end", inline: "nearest" });
  };

  const mutation = useMutation({
    mutationFn: (o: { from: number; roadtripId: string }) => {
      return axios.post("api/chat/update", o);
    },
    onSuccess: (data) => {
      // Invalidate and refetch
      if (data.data) {
        queryClient.invalidateQueries({ queryKey: ["messages"] });
      }
    },
  });
  useEffect(() => {
    const message = selected[0];
    const otherUserID = message.otherUserId;
    mutation.mutate({
      from: otherUserID,
      roadtripId: message.roadtripId,
    });
  }, [selected]);

  useEffect(() => {
    if (messagesEndRef.current) scrollToBottom();
  }, [messagesEndRef.current]);

  /*   useEffect(() => {
    const handleScroll = () => {
      if (messagesEndRef.current) {
        const rect = messagesEndRef.current.getBoundingClientRect();
        const isVisible =
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <=
            (window.innerWidth || document.documentElement.clientWidth);
        setIsVisible(isVisible);
      } 
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check on component mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);*/

  /*   const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    console.log(event.currentTarget.scrollTop);
    console.log(event.currentTarget);
    //console.log(event.currentTarget.scrollBy({ top: 900 }));
    //setScroll(false);
  }; */

  //const sorted = sortMessages(selected);
  const endIndex = selected.length - 1;
  const rows = selected.map((message, index) => {
    return (
      <>
        <div
          key={`sorted-${message.id}`}
          className={message.from === Number(userID) ? "me" : "other"}
        >
          {message.text}
        </div>
        {index === endIndex ? (
          <div
            ref={messagesEndRef}
            id="scrollElement"
            key={`scrollIntoViewElement-${message.id}`}
          ></div>
        ) : null}
      </>
    );
  });

  return (
    <>
      <div id="messages" /* onScroll={handleScroll} */>{rows}</div>
    </>
  );
}
