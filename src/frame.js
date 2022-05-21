import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import { useTwitch } from "./context/twitch-inputs";
import { useStream } from "@effection/react";

import * as classes from "./frame.module.css";
import Model from "./model.js";

export function Frame(props) {
  const twitchClient = useTwitch();
  let twitchEvent;
  if (twitchClient) {
    twitchEvent = useStream(twitchClient);
  }

  return (
    <Canvas className={classes.canvas}>
      <ambientLight intensity={1.0} />
      <OrbitControls makeDefault />
      <Suspense fallback={null}>
        <Model twitchEvent={twitchEvent} />
      </Suspense>
    </Canvas>
  );
}
