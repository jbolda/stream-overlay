import React from "react";
import { Routes, Route } from "react-router-dom";
const Monitor = React.lazy(() => import("./pages/monitor/index.jsx"));
const AlertCanvas = React.lazy(() => import("./pages/alerts/index.jsx"));
const ModelCanvas = React.lazy(() => import("./pages/models/index.jsx"));
const ChatCanvas = React.lazy(() => import("./pages/chat/index.jsx"));

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
              <ModelCanvas />
            </div>
            {/* the lowest puts it on top */}
            <div className={classes.wrapper}>
              <AlertCanvas />
            </div>
          </React.Suspense>
        }
      />
      <Route
        path="monitor"
        element={
          <React.Suspense fallback={<>...</>}>
            <Monitor />
          </React.Suspense>
        }
      />
      <Route
        path="alerts"
        element={
          <React.Suspense fallback={<>...</>}>
            <div className={classes.wrapper}>
              <AlertCanvas />
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
            <div className={classes.wrapper}>
              <ChatCanvas />
            </div>
          </React.Suspense>
        }
      />
    </Routes>
  );
}
