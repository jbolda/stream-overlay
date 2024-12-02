import React, { useState } from "react";
import { useStreamEvents } from "../../context/stream-events.jsx";
import { useOperation } from "@effection/react";

import "./messages.css";

export default function ChatCanvas() {
  const streamerBotEvents = useStreamEvents();
  const chatEvents = useAlert(
    streamerBotEvents.channel.filter(
      (alert) =>
        alert?.event?.source === "Raw" &&
        alert?.event?.type === "Action" &&
        alert?.data?.name === "Chat Event"
    )
  );

  return (
    <ul className="streamchat-chat">
      {chatEvents
        .sort(
          (chatEventA, chatEventB) =>
            -chatEventA.timeStamp.localeCompare(chatEventB.timeStamp)
        )
        .reverse()
        .map((chatEvent) =>
          chatEvent !== "" ? (
            <li
              key={chatEvent.timeStamp}
              data-streamchat-message="extra.id"
              data-streamchat-sender="user"
              data-streamchat-sender-first-message="true"
            >
              <div
                className="streamchat-chat-sender"
                data-streamchat-sender-inner="user"
              >
                {chatEvent.data?.user?.display}
              </div>
              <div className="streamchat-chat-message">
                {chatEvent.data?.arguments?.message}
              </div>
            </li>
          ) : null
        )}
    </ul>
  );
}

export function useAlert(stream) {
  let [state, setState] = useState([]);
  useOperation(
    stream.forEach(function* (event) {
      if (event?.data?.arguments?.triggerName === "Super Sticker") {
        event.data.arguments.message = `_says thanks by sticking ${event?.data?.arguments?.amount ?? "money"} to the wall_`;
        setState((currentState) => currentState.concat([event]));
      } else {
        if (!event?.data?.arguments?.message)
          event = defaultChatEvent({
            timeStamp: event.timeStamp,
          });
        console.log(event);
        setState((currentState) => currentState.concat([event]));
      }
    }),
    [stream]
  );
  return state;
}

export function useHighlight(stream) {
  let [state, setState] = useState({ messageId: "" });
  useOperation(
    stream.forEach(function* (event) {
      setState(event.data.arguments);
    }),
    [stream]
  );
  return state;
}
