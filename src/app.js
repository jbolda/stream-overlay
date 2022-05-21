import React from "react";
import { Frame } from "./frame.js";
import { TextLayer } from "./text-layer.js";

import "./global.css";

export function App() {
  return (
    <div style={{ backgroundColor: "black", height: "100vh" }}>
      <div style={{ backgroundColor: "white", height: 1080, width: 1920 }}>
        <TextLayer />
        {/* <Frame /> */}
      </div>
    </div>
  );
}
