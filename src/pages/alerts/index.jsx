import React, { Suspense, useState } from "react";
import { useTwitch } from "../../context/twitch-inputs";
import { spawn, sleep } from "effection";
import { useOperation } from "@effection/react";
import { Canvas } from "@react-three/fiber";
import { TextLayer } from "./text-layer.jsx";

import * as classes from "../../canvas.module.css";

export default function AlertCanvas() {
  const twitchStream = useTwitch();
  const channelAlert = useAlert(twitchStream);

  return (
    <Canvas
      className={classes.canvas}
      camera={{ fov: 90, position: [0, 0, 5] }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <directionalLight />
        <TextLayer channelAlert={channelAlert} />
      </Suspense>
    </Canvas>
  );
}

export function useAlert(stream) {
  let [state, setState] = useState({ message: "" });
  useOperation(
    stream.forEach(function* (value) {
      setState(value);
    }),
    [stream]
  );
  return state;
}
