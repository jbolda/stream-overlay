import React, { useState, useRef } from "react";
import { useStreamEvents } from "../../context/stream-events.jsx";
import { useOperation } from "@effection/react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Html, useMatcapTexture } from "@react-three/drei";
import { RigidBody, CuboidCollider, vec3 } from "@react-three/rapier";
import { Root, Container, Text } from "@react-three/uikit";
import { Card, CardHeader, CardTitle, CardContent } from "../default/card.tsx";
import { Box3, Vector3 } from "three";

import * as messageClasses from "./messages.module.css";
import { useEffect } from "react";

export default function ChatHighlight() {
  const streamerBotEvents = useStreamEvents();
  const highlighted = useHighlight(
    streamerBotEvents.channel.filter(filterEvents)
  );

  return (
    <>
      {highlighted.map((h) => (
        <ChatBox key={h.timeStamp} highlighted={eventDataNormalize(h)} />
      ))}
    </>
  );
}

const filterEvents = (alert) => {
  if (alert?.event?.source === "Raw" && alert?.event?.type === "Action") {
    if (alert?.data?.name === "Highlight" || alert?.data?.name === "Follow") {
      return true;
    } else if (
      alert?.data?.name === "Chat Event" &&
      (alert?.data?.arguments?.triggerName === "Super Chat" ||
        alert?.data?.arguments?.triggerName === "Super Sticker")
    ) {
      return true;
    }
  }
  return false;
};

const eventDataNormalize = (highlight) => {
  console.log({ highlight });
  switch (highlight?.data?.name) {
    case "Highlight":
      return {
        runningActionId: highlight?.data?.arguments?.runningActionId,
        title: highlight?.data?.arguments?.displayName,
        message: highlight?.data?.arguments?.message,
      };
    case "Follow":
      return {
        runningActionId: highlight?.data?.arguments?.runningActionId,
        title: highlight?.data?.arguments?.triggerName,
        message: `Thanks ${highlight?.data?.user?.display}!`,
      };
    case "Chat Event":
      if (highlight?.data?.arguments?.triggerName === "Super Chat") {
        return {
          runningActionId: highlight?.data?.arguments?.runningActionId,
          title: `${highlight?.data?.user?.display} super chats ${highlight?.data?.arguments?.amount}`,
          message: highlight?.data?.arguments?.message,
        };
      } else if (highlight?.data?.arguments?.triggerName === "Super Sticker") {
        return {
          runningActionId: highlight?.data?.arguments?.runningActionId,
          title: highlight?.data?.user?.display,
          message: `_sticks ${highlight?.data?.arguments?.amount} to the wall_`,
        };
      }
  }
  return {};
};

function ChatBox({ highlighted }) {
  const [meshHeight, setMeshHeight] = useState(1);
  const [finalPosition, setFinalPosition] = useState(false);
  const [bodyType, setBodyType] = useState("kinematicPosition");
  const rigidBody = useRef(null);
  const meshRef = useRef(null);
  const messageBox = useRef(null);

  const meshScale = 0.003;
  const box = { x: 12, y: 1, z: 1 };
  const boxInitialRotation = { x: -1.2, y: -2, z: -1.2, w: 1.0 };
  const topOfView = 28;
  const finalPositionSpot = 20;

  useEffect(() => {
    if (finalPosition) {
      console.log(rigidBody.current);
      console.log(`let the event drop: ${highlighted.runningActionId}`);
      rigidBody.current.setEnabled(false);
      setBodyType("dynamic");
      rigidBody.current.setBodyType("dynamic");
      rigidBody.current.setEnabled(true);
      rigidBody.current.setLinearDamping(1);
      setTimeout(() => {
        console.log(`now gravity: ${highlighted.runningActionId}`);
        rigidBody.current.setAngularDamping(1);
        rigidBody.current.setGravityScale(9.81);

        rigidBody.current.applyTorqueImpulse(
          vec3({
            x: 35000 * Math.random() * (Math.random() < 0.5 ? -1 : 1),
            y: 85000 * Math.random() * (Math.random() < 0.5 ? -1 : 1),
            z: 0,
          }),
          true
        );
      }, 3000);
    }
  }, [finalPosition]);

  useFrame(() => {
    if (messageBox.current && messageBox.current !== null && meshRef.current) {
      const currentSize = messageBox.current.size.v;
      if (meshHeight !== currentSize[0]) {
        setMeshHeight(currentSize[0]);
      }
    }

    if (!finalPosition && rigidBody.current) {
      if (rigidBody.current.translation().y > finalPositionSpot) {
        const translateStep = 0.1;
        const nextPosition = rigidBody.current.translation().y - translateStep;

        rigidBody.current.setNextKinematicTranslation({
          x: 0,
          y: nextPosition,
          z: 30,
        });
      } else {
        console.log(`final position reached: ${highlighted.runningActionId}`);
        setFinalPosition(true);
      }
    }
  });

  return (
    <RigidBody
      name={highlighted.runningActionId ?? "none"}
      colliders={false}
      onSleep={() => console.log(`sleeping: ${highlighted.runningActionId}`)}
      onWake={() => console.log(`awake: ${highlighted.runningActionId}`)}
      type={bodyType}
      position={[0, topOfView, 30]}
      rotation={[
        boxInitialRotation.x,
        boxInitialRotation.y,
        boxInitialRotation.z,
      ]}
      density={50}
      gravityScale={0}
      linearDamping={10}
      angularDamping={50}
      ref={rigidBody}
    >
      <CuboidCollider
        ref={meshRef}
        args={[box.x / 2, meshHeight * meshScale, box.z / 2]}
      />
      <Root key={highlighted?.runningActionId || "none"} ref={messageBox}>
        <Card maxWidth={1100} backgroundColor="teal">
          <CardHeader>
            <CardTitle>
              <Text fontWeight="bold" fontSize={96}>
                {highlighted.title}
              </Text>
            </CardTitle>
          </CardHeader>
          <CardContent flexDirection="column" gap={16}>
            <Container flexDirection="column">
              <Text fontSize={64}>{highlighted.message}</Text>
            </Container>
          </CardContent>
        </Card>
      </Root>
      {/* <RoundedBox
        args={[box.x, box.y, box.z]}
        key={highlighted?.runningActionId || "none"}
        ref={meshRef}
      >
        <meshMatcapMaterial matcap={matcap} />
        <Html position={[0, 0, box.z / 1.95]} transform={true} occlude={true}>
          <div className={messageClasses.container}>
            <div ref={messageBox}>
              <p>{highlighted?.displayName}</p>
              <p>{highlighted?.message}</p>
            </div>
          </div>
        </Html>
      </RoundedBox> */}
    </RigidBody>
  );
}

export function useHighlight(stream) {
  let [state, setState] = useState([]);
  useOperation(
    stream.forEach(function* (event) {
      console.log(event);
      setState((prevState) => prevState.concat([event]));
      setTimeout(() => {
        setState((prevState) => {
          console.log(
            `old event removed: ${event.timeStamp} || ${event.data.arguments.runningActionId}`
          );
          return prevState.filter((e) => e.timeStamp !== event.timeStamp);
        });
      }, 15000);
    }),
    [stream]
  );
  return state;
}
