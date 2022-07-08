import React, { Suspense, createContext, useContext } from "react";
import comfyjs from "comfy.js";
import { ensure, createChannel } from "effection";
import { useResource } from "./use-resource";

export const TwitchContext = createContext(null);
TwitchContext.displayName = "TwitchContext";

export function useTwitch() {
  return useContext(TwitchContext);
}

export const WithTwitch = ({ children }) => {
  let client = useResource({
    name: "TwitchClient",
    *init() {
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
            channel.send({ event, args });
          };
        }
      });

      let params = new URL(document.location).searchParams;
      let channelName = params.get("channel") || "jacobbolda";
      let password = params.get("password");
      // if (!password && window) {
      //   const { constants } = yield import("../../constants.js");
      //   password = constants.password;
      // }

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

  if (client.type === "pending") {
    return <h1>loading...</h1>;
  } else if (client.type === "rejected") {
    return (
      <React.Fragment>
        <h1>error.....</h1>
        <pre>{client.error}</pre>
      </React.Fragment>
    );
  } else {
    return (
      <TwitchContext.Provider value={client.value}>
        {children}
      </TwitchContext.Provider>
    );
  }
};
