import React from "react";
import { Routes, Route } from "react-router-dom";
const AlertCanvas = React.lazy(() => import("./pages/alerts/index.jsx"));
const ModelCanvas = React.lazy(() => import("./pages/models/index.jsx"));

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
    </Routes>
  );
}
