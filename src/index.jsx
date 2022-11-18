import { main } from "effection";
import { EffectionContext } from "@effection/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app.jsx";
import { WithStreamEvents } from "./context/stream-events.jsx";

EffectionContext.displayName = "EffectionScope";

main(function* (scope) {
  const container = document.getElementById("root");
  const root = createRoot(container);
  root.render(
    <EffectionContext.Provider value={scope}>
      <WithStreamEvents>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </WithStreamEvents>
    </EffectionContext.Provider>
  );

  yield;
});
