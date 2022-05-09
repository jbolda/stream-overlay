import { main } from "effection";
import { EffectionContext } from "@effection/react";
import ReactDOM from "react-dom";
import { App } from "./app.js";
import { WithTwitch } from "./context/twitch-inputs.js";

EffectionContext.displayName = "EffectionScope";

main(function* (scope) {
  const app = document.getElementById("app");
  ReactDOM.render(
    <EffectionContext.Provider value={scope}>
      <WithTwitch>
        <App />
      </WithTwitch>
    </EffectionContext.Provider>,
    app
  );

  yield;
});
