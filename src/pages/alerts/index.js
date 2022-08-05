import React, { Suspense, useState } from "react";
import { useTwitch } from "../../context/twitch-inputs";
import { useOperation } from "@effection/react";
import { Canvas } from "@react-three/fiber";
import { TextLayer } from "./text-layer.js";

import * as classes from "../../canvas.module.css";

export function AlertCanvas() {
  const twitchStream = useTwitch();
  const [twitch3DCommand, setTwitchCommand] = useState();
  const [twitchFollow, setTwitchFollow] = useState();
  const [twitchRedemption, setTwitchRedemption] = useState();
  const [twitchRaid, setTwitchRaid] = useState();
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

    const channelFollow = twitchStream.filter(
      (twitch) =>
        twitch.event === "onChat" &&
        (twitch.args[0] === "JacobBolda" ||
          twitch.args[0] === "StreamElements") &&
        twitch.args[1].includes("following")
    );
    useOperation(
      channelFollow.forEach(function* (value) {
        setTwitchFollow(value);
      }),
      [channelFollow]
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

    const channelRaid = twitchStream.filter(
      (twitch) => twitch.event === "onRaid"
    );
    useOperation(
      channelRaid.forEach(function* (value) {
        setTwitchRaid(value);
      }),
      [channelRaid]
    );
  }

  const textMessage =
    twitch3DCommand?.args?.[1].toLowerCase() === "3d"
      ? twitch3DCommand.args[2]
      : "";
  console.log(twitch3DCommand);
  console.log(twitchRedemption);
  const followMessage = twitchFollow?.args?.[0]
    ? `${twitchFollow?.args?.[1]}`
    : "";
  const rewardMessage = twitchRedemption?.args?.[0]
    ? `${twitchRedemption?.args?.[0]} redeemed ${twitchRedemption?.args?.[1]}`
    : "";
  const raidMessage = twitchRaid?.args?.[0]
    ? `${twitchRaid?.args?.[0]} raided with ${twitchRaid?.args?.[1]} viewers`
    : "";
  console.log(followMessage);
  return (
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
            textMessage: followMessage,
            setTwitch: setTwitchFollow,
          }}
        />
        <TextLayer
          {...{
            textMessage: rewardMessage,
            setTwitch: setTwitchRedemption,
          }}
        />
        <TextLayer
          {...{
            textMessage: raidMessage,
            setTwitch: setTwitchRedemption,
          }}
        />
      </Suspense>
    </Canvas>
  );
}
