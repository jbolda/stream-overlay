import React from "react";
import { Routes, Route } from "react-router-dom";
const DefaultCanvas = React.lazy(() => import("./pages/default/index.jsx"));
const ModelCanvas = React.lazy(() => import("./pages/models/index.jsx"));
const Chat = React.lazy(() => import("./pages/chat/index.jsx"));
const Stats = React.lazy(() => import("./pages/stats/index.jsx"));

import "./global.css";
import * as classes from "./canvas.module.css";

export function App() {
  return (
    <Routes>
      <Route
        index
        element={
          <React.Suspense fallback={<>...</>}>
            <div className={classes.wrapper}>
              <DefaultCanvas />
            </div>
          </React.Suspense>
        }
      />
      <Route
        path="models"
        element={
          <React.Suspense fallback={<>...</>}>
            <div className={classes.wrapper}>
              <ModelCanvas />
            </div>
          </React.Suspense>
        }
      />
      <Route
        path="chat"
        element={
          <React.Suspense fallback={<>...</>}>
            <Chat />
          </React.Suspense>
        }
      />
      <Route
        path="stats"
        element={
          <React.Suspense fallback={<>...</>}>
            <Stats />
          </React.Suspense>
        }
      />
    </Routes>
  );
}
