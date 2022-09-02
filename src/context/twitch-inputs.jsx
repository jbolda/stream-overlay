import React, { createContext, useContext } from "react";
import { ensure, createChannel } from "effection";
import { useResource } from "@effection/react";

export const TwitchContext = createContext(null);
TwitchContext.displayName = "TwitchContext";

export function useTwitch() {
  return useContext(TwitchContext);
}

export const WithTwitch = ({ children }) => {
  let client = useResource({
    name: "TwitchClient",
    *init() {
      // ugh... but the bundling of this is awful
      const comfyjs = window["ComfyJS"];
      const channel = createChannel();

      // Comfyjs has an object of functions that is
      // to be overloaded with handles instead of the
      // event system of TMI.js that it is built upon.
      // An event returns a stream, instead of dynamically
      // overload all events and pass them to a channel
      // which returns a stream in the same manner.
      Object.keys(comfyjs).forEach((event) => {
        if (event.startsWith("on")) {
          comfyjs[event] = (...args) => {
            channel.send(buildEvent({ event, args }));
          };
        }
      });

      let params = new URL(document.location).searchParams;
      let channelName = params.get("channel") || "jacobbolda";
      let password = params.get("password");
      if (!password) {
        password = import.meta.env.VITE_TWITCH_PASSWORD;
      }

      // https://github.com/instafluff/ComfyJS#channel-point-reward-redemptions
      // https://twitchapps.com/tmi/ or
      // https://twitchapps.com/tokengen/ for additional scopes
      // https://dev.twitch.tv/docs/authentication/register-app
      // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth
      const client = comfyjs.Init(channelName, password);

      yield ensure(function* () {
        yield client.disconnect();
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
      <TwitchContext.Provider value={client.value}>
        {children}
      </TwitchContext.Provider>
    );
  }
};

const buildEvent = ({ event, args }) => {
  let timeout = 0;

  let message = "";
  switch (event) {
    case "onCommand":
      message = args[2];
      timeout = 3000;
      break;
    // case "onChat":
    //   message = `${args?.[1]}`;
    //   timeout = 3000;
    //   break;
    case "onReward":
      message = `${args?.[0]} redeemed ${args?.[1]}`;
      timeout = 3000;
      break;
    case "onRaid":
      message = `${args?.[0]} raided with ${args?.[1]} viewers`;
      timeout = 3000;
      break;
  }

  return { event, args, timeout, message };
};
