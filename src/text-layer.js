import React, { Suspense } from "react";
import { useTwitch } from "./context/twitch-inputs";
import { useStream } from "@effection/react";
import { Canvas } from "@react-three/fiber";
import { Text3D, Float, Center } from "@react-three/drei";

import * as classes from "./text-layer.module.css";

export function TextLayer() {
  const twitchStream = useTwitch();
  let twitchEvent;
  if (twitchStream) {
    twitchEvent = useStream(twitchStream);
  }

  const textMessage =
    twitchEvent?.event === "onCommand" &&
    twitchEvent.args[1].toLowerCase() === "3d"
      ? twitchEvent.args[2]
      : "";
  console.log(twitchEvent);
  return (
    <Canvas
      className={classes.canvas}
      camera={{
        position: [0, 0.5, 4],
      }}
    >
      <Suspense fallback={null}>
        <Center>
          <Float floatIntensity={5} speed={2}>
            <Text3D
              font={
                "https://drei.pmnd.rs/fonts/helvetiker_regular.typeface.json"
              }
              bevelEnabled
              bevelSize={0.05}
            >
              {textMessage}
              <meshNormalMaterial />
            </Text3D>
          </Float>
        </Center>
      </Suspense>
    </Canvas>
  );
}
