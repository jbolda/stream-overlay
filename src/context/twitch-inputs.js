import React, { Suspense, createContext, useContext } from "react";
import tmi from "tmi.js";
import { ensure } from "effection";
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
      // https://twitchapps.com/tmi/
      const client = new tmi.Client({
        channels: ["jacobbolda"],
        identity: {
          username: "jacobbolda",
          password: "oauth:guyve6o8uxp3k6rll0pxltzmlp9fxb",
        },
      });

      yield client.connect();

      yield ensure(function* () {
        yield client.disconnect();
      });

      return client;
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
