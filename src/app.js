import React, { Suspense, useState } from "react";
import { useTwitch } from "./context/twitch-inputs";
import { useOperation } from "@effection/react";
import { Canvas } from "@react-three/fiber";
// import { Physics } from "@react-three/cannon";

import { Frame } from "./frame.js";
import { TextLayer } from "./text-layer.js";

import "./global.css";
import * as classes from "./text-layer.module.css";

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
    <div style={{ height: 1080, width: 1920 }}>
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
          {/*
          <Physics>
           <Frame />
          </Physics>
          */}
        </Suspense>
      </Canvas>
    </div>
  );
}
