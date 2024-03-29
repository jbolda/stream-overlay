import React from "react";
import { useStreamEvents } from "../../context/stream-events.jsx";
import PhysicsCanvas from "../../components/physics.jsx";
import { RigidBody } from "@react-three/rapier";
import { Plane } from "@react-three/drei";

import WFlange from "../../components/models/wflange.jsx";
import Cup from "../../components/models/cup.jsx";
import Star from "../../components/models/star.jsx";
import BumpTorus from "../../components/models/bump-torus.jsx";
import SpikeySphere from "../../components/models/spikey-sphere.jsx";
import Chair from "../../components/models/chair.jsx";

export default function ModelCanvas() {
  const streamerBotEvents = useStreamEvents();
  const dropCommand = streamerBotEvents.channel.filter(
    (event) =>
      event?.data?.name === "Command" &&
      event?.data?.arguments?.command === "!drop"
  );

  return (
    <PhysicsCanvas>
      <RigidBody type="fixed">
        <Plane args={[0.2, 100]} position={[0, 0, 0]} rotation={[1.57, 0, 0]} />
      </RigidBody>
      <WFlange dropCommand={dropCommand} />
      <Cup dropCommand={dropCommand} />
      <Star dropCommand={dropCommand} />
      <BumpTorus dropCommand={dropCommand} />
      <SpikeySphere dropCommand={dropCommand} />
      <Chair dropCommand={dropCommand} />
    </PhysicsCanvas>
  );
}
