import React from "react";
import { useStreamEvents } from "../../context/stream-events.jsx";
import PhysicsCanvas from "../../components/physics.jsx";
import { RigidBody } from "@react-three/rapier";

import { Plane } from "@react-three/drei";
import ChatHighlight from "../../components/chat-highlight/index.jsx";
import WFlange from "../../components/models/wflange.jsx";
import Cup from "../../components/models/cup.jsx";
import Star from "../../components/models/star.jsx";
import BumpTorus from "../../components/models/bump-torus.jsx";
import SpikeySphere from "../../components/models/spikey-sphere.jsx";
import Chair from "../../components/models/chair.jsx";

export default function DefaultCanvas() {
  const streamerBotEvents = useStreamEvents();
  const dropCommand = streamerBotEvents.channel.filter(
    (event) =>
      event?.data?.name === "Command" &&
      event?.data?.arguments?.command === "!drop"
  );

  return (
    <PhysicsCanvas>
      <ChatHighlight />
      <RigidBody type="fixed">
        <Plane
          args={[0.5, 150]}
          position={[0, 0, 0]}
          rotation={[1.57, 0.5, 0]}
        />
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
