import React, { createContext, useContext } from "react";
import { createChannel, spawn, on, once, ensure } from "effection";
import { useResource } from "@effection/react";

export const StreamEventsContext = createContext(null);
StreamEventsContext.displayName = "StreamEventsContext";

export function useStreamEvents() {
  return useContext(StreamEventsContext);
}

export function createSocket(port, host) {
  const readyState = new Map();
  readyState.set(0, "CONNECTING");
  readyState.set(1, "OPEN");
  readyState.set(2, "CLOSING");
  readyState.set(3, "CLOSED");

  return {
    *init() {
      let socket = new WebSocket(`ws://${host}:${port}`);

      console.log(readyState.get(socket.readyState));
      yield ensure(function* () {
        yield socket.close();
      });

      yield spawn(
        on(socket, "error").forEach((message) => {
          console.log(readyState.get(socket.readyState));
          console.error(message);
        })
      );
      yield spawn(
        on(socket, "close").forEach((message) => {
          console.log(readyState.get(socket.readyState));
          console.log(message);
        })
      );

      yield once(socket, "open");
      console.log(readyState.get(socket.readyState));

      return {
        send: (message) => socket.send(JSON.stringify(message)),
        subscribe: ({ id, list, channel }) => {
          socket.send(
            JSON.stringify({
              request: "Subscribe",
              events: list,
              id,
            })
          );

          return spawn(
            on(socket, "message").forEach(function* (message) {
              const event = JSON.parse(message.data);
              console.log(event);
              channel.send(event);
            })
          );
        },
      };
    },
  };
}

export const WithStreamEvents = ({ children }) => {
  let client = useResource({
    name: "StreamEventsClient",
    *init() {
      const socket = yield createSocket(7890, "127.0.0.1");
      const channel = createChannel();

      // const eventList = socket.send({
      //   request: "GetEvents",
      //   id: "1",
      // });
      // console.log(eventList);

      yield socket.subscribe({
        id: "0",
        list: {
          command: ["Message"],
          youtube: ["Message", "MessageDeleted", "UserBanned"],
          raw: ["Action"],
        },
        channel,
      });

      return channel;
    },
  });

  if (!client || !client.type || client.type === "rejected") {
    return (
      <React.Fragment>
        <h1>error.....</h1>
        <pre>
          {client && client.error ? JSON.stringify(client.error, null, 2) : ""}
        </pre>
      </React.Fragment>
    );
  } else if (client.type === "pending") {
    return <h1>loading...</h1>;
  } else {
    return (
      <StreamEventsContext.Provider value={client.value}>
        {children}
      </StreamEventsContext.Provider>
    );
  }
};
