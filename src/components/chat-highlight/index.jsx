import React, { useState, useRef } from "react";
import { useStreamEvents } from "../../context/stream-events.jsx";
import { useOperation } from "@effection/react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Html, useMatcapTexture } from "@react-three/drei";
import { RigidBody, CuboidCollider, vec3 } from "@react-three/rapier";

import * as messageClasses from "./messages.module.css";
import { useEffect } from "react";

export default function ChatHighlight() {
  const streamerBotEvents = useStreamEvents();
  const highlighted = useHighlight(
    streamerBotEvents.channel.filter(
      (alert) =>
        alert?.event?.source === "Raw" &&
        alert?.event?.type === "Action" &&
        alert?.data?.name === "Highlight"
    )
  );

  return highlighted.map((h) => (
    <ChatBox key={h.timeStamp} highlighted={h.data.arguments} />
  ));
}

function ChatBox({ highlighted }) {
  const [meshHeight, setMeshHeight] = useState(1);
  const [finalPosition, setFinalPosition] = useState(false);
  const [bodyType, setBodyType] = useState("kinematicPosition");
  const rigidBody = useRef(null);
  const meshRef = useRef(null);
  const messageBox = useRef(null);

  const pixelsPerUnit = 28;
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
            x: 25000 * Math.random() * (Math.random() < 0.5 ? -1 : 1),
            y: 35000 * Math.random() * (Math.random() < 0.5 ? -1 : 1),
            z: 0,
          }),
          true
        );
      }, 3000);
    }
  }, [finalPosition]);

  useFrame(() => {
    if (
      messageBox.current &&
      meshRef.current &&
      meshRef.current.scale.y === 1
    ) {
      const { scrollHeight } = messageBox.current;
      const heightMesh = scrollHeight / pixelsPerUnit;
      const descale = 1 / heightMesh;
      meshRef.current.scale.set(1, heightMesh, 1);
      meshRef.current.updateMatrix();
      messageBox.current.style.transform = `scale(1, ${descale})`;
      setMeshHeight(heightMesh);
    }

    if (!finalPosition && meshRef.current && rigidBody.current) {
      if (
        meshRef.current.position.y + rigidBody.current.translation().y >
        finalPositionSpot
      ) {
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

  const [matcap] = useMatcapTexture(
    // https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
    2,
    1024 // size of the texture ( 64, 128, 256, 512, 1024 )
  );

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
      <CuboidCollider args={[box.x / 2, meshHeight / 2, box.z / 2]} />
      <RoundedBox
        args={[box.x, box.y, box.z]}
        key={highlighted?.runningActionId || "none"}
        ref={meshRef}
      >
        <meshMatcapMaterial matcap={matcap} />
        <Html position={[0, 0, box.z / 1.95]} transform={true} occlude={true}>
          <div className={messageClasses.container}>
            <div ref={messageBox}>
              {/* <p>
                <img src={highlighted.userProfileUrl} height="40px" />
              </p> */}
              <p>{highlighted?.displayName}</p>
              <p>{highlighted?.message}</p>
            </div>
          </div>
        </Html>
      </RoundedBox>
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
