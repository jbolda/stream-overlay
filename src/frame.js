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
    const [channel, tags, message, self] = useStream(
      onEmit(twitchClient, "message"),
      [null, {}, null, null]
    );

    console.log(`${tags["display-name"]}: ${message}`);
    console.log(channel, tags, message, self);
  }

  return (
    <Canvas className={classes.canvas}>
      <ambientLight intensity={1.0} />
      <TransformControls mode="translate" />
      <OrbitControls makeDefault />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}
