import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { TransformControls, OrbitControls } from "@react-three/drei";

import { useTwitch } from "./context/twitch-inputs";
import { onEmit } from "effection";
import { useStream } from "@effection/react";

import * as classes from "./frame.module.css";
import Model from "./model.js";

export function Frame(props) {
  const twitchClient = useTwitch();
  if (twitchClient) {
    const twitchEvent = useStream(twitchClient);

    console.log(twitchEvent);
  }

  return (
    <Canvas className={classes.canvas}>
      <ambientLight intensity={1.0} />
      <OrbitControls makeDefault />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}
