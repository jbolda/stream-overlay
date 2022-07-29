import React from "react";
import { Routes, Route } from "react-router-dom";
import { AlertCanvas } from "./pages/alerts/index.js";
import { ModelCanvas } from "./pages/models/index.js";

import "./global.css";
import * as classes from "./canvas.module.css";

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <div className={classes.wrapper}>
              <ModelCanvas />
            </div>
            {/* the lowest puts it on top */}
            <div className={classes.wrapper}>
              <AlertCanvas />
            </div>
          </>
        }
      />
      <Route
        path="alerts"
        element={
          <div className={classes.wrapper}>
            <AlertCanvas />
          </div>
        }
      />
      <Route
        path="models"
        element={
          <div className={classes.wrapper}>
            <ModelCanvas />
          </div>
        }
      />
    </Routes>
  );
}
