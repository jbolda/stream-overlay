import React, { useState, useRef, useEffect } from "react";
import { useStreamEvents } from "../../context/stream-events.jsx";
import { useOperation } from "@effection/react";

import * as classes from "../../canvas.module.css";
import * as messageClasses from "./messages.module.css";

export default function Monitor() {
  let [chatEvents, setEventList] = useState(defaultTestState);
  const streamerBotEvents = useStreamEvents();
  useAlert(
    streamerBotEvents.channel.filter(
      (alert) =>
        alert?.event?.source === "Raw" &&
        alert?.event?.type === "Action" &&
        alert?.data?.name === "Chat Event"
    ),
    setEventList
  );

  const handleHighlight = (event, chatEvent) => {
    const highlight = !chatEvent.isHighlighted
      ? { isHighlighted: true, messageId: chatEvent.messageId }
      : { isHighlighted: false, messageId: "none" };

    setEventList((currentState) =>
      currentState.map((eventState) => {
        if (eventState.messageId === chatEvent.messageId) {
          eventState.isHighlighted = highlight.isHighlighted;
        } else {
          eventState.isHighlighted = false;
        }
        return eventState;
      })
    );
    streamerBotEvents.client.send({
      request: "DoAction",
      action: {
        id: "c8fa224d-3c4f-47a8-9dda-8c1a849c28b9",
        name: "Highlight",
      },
      args: {
        messageId: highlight.messageId,
      },
      id: "c8fa224d-3c4f-47a8-9dda-8c1a849c28b9",
    });
  };

  return (
    <div>
      {chatEvents
        .sort(
          (chatEventA, chatEventB) =>
            -chatEventA.timeStamp.localeCompare(chatEventB.timeStamp)
        )
        .map((chatEvent) =>
          chatEvent !== "" ? (
            <ChatBox
              key={chatEvent.timeStamp}
              chatEvent={chatEvent}
              handleHighlight={handleHighlight}
            />
          ) : null
        )}
    </div>
  );
}

function ChatBox({ chatEvent, handleHighlight }) {
  return (
    <div
      style={{
        backgroundColor: chatEvent.isHighlighted ? "tomato" : "inherit",
      }}
    >
      <button>delete</button>
      <button onClick={(event) => handleHighlight(event, chatEvent)}>
        highlight
      </button>
      <pre>{JSON.stringify(chatEvent, null, 2)}</pre>
    </div>
  );
}

export function useAlert(stream, setState) {
  useOperation(
    stream.forEach(function* (event) {
      if (!event?.data?.arguments?.message)
        event = defaultChatEvent({
          timeStamp: event.timeStamp,
        });
      const eventData = {
        ...event.data.arguments,
        physicsType: "kinematicPosition",
        isHighlighted: false,
        timeStamp: event.timeStamp,
      };
      console.log(eventData);
      setState((currentState) =>
        (currentState.length > 15 ? [...currentState].slice(1) : currentState)
          .map((chatEvent) => {
            chatEvent.physicsType = "dynamic";
            return chatEvent;
          })
          .concat([eventData])
      );
    }),
    [stream]
  );
}

let defaultChatEvent = ({ timeStamp }) => ({
  timeStamp,
  event: {
    source: "Raw",
    type: "Action",
  },
  data: {
    id: "xxxxxxxxx",
    name: "Chat Event",
    arguments: {
      messageId: `messageId ${timeStamp}`,
      message: "boop",
      publishedAt: "2022-12-23T12:08:23.438531-06:00",
      userProfileUrl:
        "https://yt3.ggpht.com/9MxQdiPjvL9a0gB3yRxItAn9j7rHrR2Vhhr3BgOZgn-QkVT1pT1vBw--aRQalwc-TMAmR0pNHA=s88-c-k-c0x00ffffff-no-rj",
      actionId: "00325581-2ee4-4240-9248-093788a7c393",
      actionName: "Chat Event",
      user: "Jacob Bolda",
      userName: "Jacob Bolda",
      userId: "userId",
      userType: "youtube",
      isSubscribed: false,
      isModerator: true,
      isVip: false,
      eventSource: "youtube",
      broadcastUserName: "Jacob Bolda",
      broadcastUserId: "userId",
      broadcastUserProfileImage:
        "https://yt3.ggpht.com/9MxQdiPjvL9a0gB3yRxItAn9j7rHrR2Vhhr3BgOZgn-QkVT1pT1vBw--aRQalwc-TMAmR0pNHA=s88-c-k-c0x00ffffff-no-rj",
      runningActionId: "99d3253d-6c81-4e5a-b5d7-dc9918d27fb4",
      requeuedAction: false,
    },
    user: {
      display: "Jacob Bolda",
      id: "userId",
      name: "Jacob Bolda",
      role: 4,
      subscribed: false,
      type: "youtube",
    },
  },
});

let defaultTestState = [
  // {
  //   message:
  //     "1 how about some more text here, but this one is much longer than the others",
  //   eventId: "default1",
  // },
  // {
  //   message: "2 how about some more text here, this has more but less",
  //   eventId: "default2",
  // },
  // { message: "3 how about some more text here", eventId: "default3" },
  // { message: "4 how about some text", eventId: "default4" },
  // { message: "5 how about some more text here", eventId: "default5" },
  // { message: "6 how about some more text here", eventId: "default6" },
  // { message: "7 how about some more text here", eventId: "default7" },
  // { message: "8 how about some more text here", eventId: "default8" },
  // {
  //   message:
  //     "9 how about some more text here, but quite a bit longer but not the longest",
  //   eventId: "default9",
  // },
  // { message: "10 helllooo", eventId: "default10" },
  // { message: "11 how about some more text here", eventId: "default11" },
];
