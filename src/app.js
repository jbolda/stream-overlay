import React, { Suspense, useState } from "react";
import { useTwitch } from "./context/twitch-inputs";
import { useOperation } from "@effection/react";
import { Canvas } from "@react-three/fiber";
import { Physics, usePlane } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";

// import { Frame } from "./frame.js";
import { TextLayer } from "./alerts/text-layer.js";
import WFlange from "./models/WFlange.js";

import "./global.css";
import * as classes from "./canvas.module.css";

export function App() {
  const twitchStream = useTwitch();
  const [twitch3DCommand, setTwitchCommand] = useState();
  const [twitchRedemption, setTwitchRedemption] = useState();
  if (twitchStream) {
    const channelCommands = twitchStream.filter(
      (twitch) => twitch.event === "onCommand" && twitch.args[1] === "3d"
    );
    useOperation(
      channelCommands.forEach(function* (value) {
        setTwitchCommand(value);
      }),
      [channelCommands]
    );

    const channelPointRedemption = twitchStream.filter(
      (twitch) => twitch.event === "onReward"
    );
    useOperation(
      channelPointRedemption.forEach(function* (value) {
        setTwitchRedemption(value);
      }),
      [channelPointRedemption]
    );
  }

  const textMessage =
    twitch3DCommand?.args?.[1].toLowerCase() === "3d"
      ? twitch3DCommand.args[2]
      : "";
  console.log(twitch3DCommand);
  console.log(twitchRedemption);
  const rewardMessage = twitchRedemption?.args?.[0]
    ? `${twitchRedemption?.args?.[0]} redeemed ${twitchRedemption?.args?.[1]}`
    : "";

  return (
    <>
      <div className={classes.wrapper}>
        <Canvas
          className={classes.canvas}
          camera={{ fov: 90, position: [0, 0, 5] }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <directionalLight />
            <TextLayer {...{ textMessage, setTwitch: setTwitchCommand }} />
            <TextLayer
              {...{
                textMessage: rewardMessage,
                setTwitch: setTwitchRedemption,
              }}
            />
          </Suspense>
        </Canvas>
      </div>
      <div className={classes.wrapper}>
        <Canvas
          className={classes.canvas}
          camera={{ fov: 90, position: [0, 0, 25] }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <OrbitControls makeDefault />
            <Physics>
              {/* <Frame /> */}
              <Plane />
              <WFlange position={[0, 5, 0]} />
              <WFlange position={[0, 35, 0]} />
              <WFlange position={[10, 5, 0]} />
              <WFlange position={[10, 35, 0]} />
              {/* <WFlange position={[2, 200, 0]} /> */}
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
    </mesh>
  );
}
