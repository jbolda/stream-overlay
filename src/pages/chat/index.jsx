import React, { Suspense, useState, useRef, useEffect } from "react";
import { useStreamEvents } from "../../context/stream-events.jsx";
import { useOperation } from "@effection/react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  RoundedBox,
  Html,
  useMatcapTexture,
} from "@react-three/drei";
import {
  Physics,
  RigidBody,
  MeshCollider,
  CuboidCollider,
  Debug,
} from "@react-three/rapier";

import * as classes from "../../canvas.module.css";
import * as messageClasses from "./messages.module.css";

export default function ChatCanvas() {
  const groupRef = useRef(null);
  const streamerBotEvents = useStreamEvents();
  const chatEvents = useAlert(
    streamerBotEvents.channel.filter(
      (alert) =>
        alert?.event?.source === "Raw" &&
        alert?.event?.type === "Action" &&
        alert?.data?.name === "Chat Event"
    )
  );
  // const highlighted = useHighlight(
  //   streamerBotEvents.channel.filter(
  //     (alert) =>
  //       alert?.event?.source === "Raw" &&
  //       alert?.event?.type === "Action" &&
  //       alert?.data?.name === "Highlight"
  //   )
  // );

  return (
    <Canvas
      className={classes.canvas}
      camera={{ fov: 90, position: [0, 0, 5] }}
    >
      <Suspense fallback={null}>
        <Physics colliders="hull" gravity={[0, 9.81, 0]}>
          {/* <Debug /> */}
          <OrbitControls />
          <directionalLight color={0xffffff} intensity={0.8} />
          <hemisphereLight color={0xffffff} intensity={0.3} />
          <pointLight theatreKey="Light" color={0xffffff} intensity={0.3} />
          <group ref={groupRef}>
            {chatEvents
              .sort(
                (chatEventA, chatEventB) =>
                  -chatEventA.timeStamp.localeCompare(chatEventB.timeStamp)
              )
              .map((chatEvent) =>
                chatEvent !== "" ? (
                  <ChatBox
                    key={chatEvent.timeStamp}
                    channelAlert={chatEvent}
                    // highlighted={highlighted.messageId === chatEvent.messageId}
                    // anyMessageHighlighted={highlighted.messageId !== ""}
                  />
                ) : null
              )}
          </group>
        </Physics>
      </Suspense>
    </Canvas>
  );
}

function ChatBox({
  channelAlert,
  highlighted = false,
  anyMessageHighlighted = false,
}) {
  const [isAsleep, setIsAsleep] = useState(false);
  const api = useRef(null);
  const meshRef = useRef(null);
  const messageBox = useRef(null);

  const pixelsPerUnit = 28;
  const box = { x: 5.5, y: 1, z: 0.1 };
  const [boxScale, setBoxScale] = useState(1);
  const [staticPositionY, setPositionY] = useState();
  const boxXLocation = 12 + box.x / 2;
  const boxZLocation = -5;
  const gap = 0.1;
  const initialPosition = 12;
  const topOfView = 10 - gap;

  const impulse = () => {
    api.current.applyImpulse({ x: 7000, y: 0, z: 0 });
  };

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
      setBoxScale(heightMesh);
    }

    if (
      meshRef.current.position.y + api.current.translation().y + boxScale / 2 >
      topOfView
    ) {
      const translateStep = 0.1;
      const nextPosition = api.current.translation().y - translateStep;

      api.current.setNextKinematicTranslation({
        x: 0,
        y: nextPosition,
        z: 0,
      });
    }

    // we may trash highlighting here for the moment as this don't
    // seem to work, and possibly due to upstream expectations / limitations
    // if (highlighted) {
    //   const translateStep = 0.1;
    //   const { x, y, z } = api.current.translation();
    //   console.log({ x, y, z, api, meshRef, isAsleep });

    //   const finalPosition = {
    //     x: -2,
    //     y: -5,
    //     z: 0,
    //   };
    //   api.current.setNextKinematicTranslation({
    //     x:
    //       api.current.translation().x > finalPosition.x
    //         ? finalPosition.x
    //         : api.current.translation().x - translateStep,
    //     y:
    //       api.current.translation().y === finalPosition.y
    //         ? finalPosition.y
    //         : api.current.translation().y - translateStep,
    //     z: 0,
    //   });
    // }
    // else {
    // console.dir({ x, y, z });
    // api.current.setNextKinematicTranslation({
    //   x: x - 2,
    // });
    // }
  });

  const [matcap] = useMatcapTexture(
    // https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
    highlighted ? 7 : "537387_75BBB9_152E5B_0E85E8",
    1024 // size of the texture ( 64, 128, 256, 512, 1024 )
  );

  return (
    <RigidBody
      colliders={false}
      onSleep={() => setIsAsleep(true)}
      onWake={() => setIsAsleep(false)}
      canSleep={false}
      type={physicsDetermination({
        anyMessageHighlighted,
        highlighted,
        physicsType: channelAlert.physicsType,
      })}
      enabledRotations={[false, false, false]}
      enabledTranslations={[true, true, false]}
      density={50}
      linearDamping={10}
      ref={api}
    >
      <ChatColliders
        position={[boxXLocation, initialPosition, boxZLocation]}
        box={box}
        gap={gap}
        boxScale={boxScale}
      />
      <RoundedBox
        args={[box.x, box.y, box.z]}
        position={[boxXLocation, initialPosition, boxZLocation]}
        onClick={(e) => {
          console.log(e);
          impulse();
        }}
        ref={meshRef}
        dispose={null}
      >
        <meshMatcapMaterial matcap={matcap} />
        <Html position={[0, 0, box.z]} transform={true} occlude={true}>
          <div className={messageClasses.container}>
            <div ref={messageBox}>
              {/* <p>
                <img src={channelAlert.userProfileUrl} height="40px" />
              </p> */}
              <p>{channelAlert.userName}:</p>
              <p>{channelAlert.message}</p>
            </div>
          </div>
        </Html>
      </RoundedBox>
    </RigidBody>
  );
}

const physicsDetermination = ({
  anyMessageHighlighted,
  highlighted,
  physicsType,
}) => {
  if (anyMessageHighlighted) {
    if (!highlighted) {
      return "fixed";
    } else {
      return "kinematicPosition";
    }
  } else {
    return physicsType;
  }
};

const ChatColliders = ({ position, gap, box, boxScale }) => {
  const chatY = (box.y * boxScale) / 2;
  return boxScale === 1 ? null : (
    <>
      <CuboidCollider // this is serving similar to a margin
        args={[box.x / 2, gap, box.z]}
        position={[position[0], position[1] + chatY + gap / 2, position[2]]}
        friction={0}
      />
      <CuboidCollider // this acts as the collider for the mesh
        args={[box.x / 2, chatY, box.z]}
        position={position}
        friction={0}
      />
    </>
  );
};

export function useAlert(stream) {
  let [state, setState] = useState(defaultTestState);
  useOperation(
    stream.forEach(function* (event) {
      if (!event?.data?.arguments?.message)
        event = defaultChatEvent({
          timeStamp: event.timeStamp,
        });
      const eventData = {
        ...event.data.arguments,
        physicsType: "kinematicPosition",
        timeStamp: event.timeStamp,
      };
      console.log(eventData);
      setState((currentState) =>
        (currentState.length > 15 ? [...currentState].slice(1) : currentState)
          .map((chatEvent) => {
            chatEvent.physicsType = "dynamic";
            return chatEvent;
          })
          .concat([eventData])
      );
    }),
    [stream]
  );
  return state;
}

export function useHighlight(stream) {
  let [state, setState] = useState({ messageId: "" });
  useOperation(
    stream.forEach(function* (event) {
      console.log(event);
      setState(event.data.arguments);
    }),
    [stream]
  );
  return state;
}

let defaultChatEvent = ({ timeStamp }) => ({
  timeStamp,
  event: {
    source: "Raw",
    type: "Action",
  },
  data: {
    id: "xxxxxxxxx",
    name: "Chat Event",
    arguments: {
      messageId: `messageId ${timeStamp}`,
      message: "boop",
      publishedAt: "2022-12-23T12:08:23.438531-06:00",
      userProfileUrl:
        "https://yt3.ggpht.com/9MxQdiPjvL9a0gB3yRxItAn9j7rHrR2Vhhr3BgOZgn-QkVT1pT1vBw--aRQalwc-TMAmR0pNHA=s88-c-k-c0x00ffffff-no-rj",
      actionId: "00325581-2ee4-4240-9248-093788a7c393",
      actionName: "Chat Event",
      user: "Jacob Bolda",
      userName: "Jacob Bolda",
      userId: "userId",
      userType: "youtube",
      isSubscribed: false,
      isModerator: true,
      isVip: false,
      eventSource: "youtube",
      broadcastUserName: "Jacob Bolda",
      broadcastUserId: "userId",
      broadcastUserProfileImage:
        "https://yt3.ggpht.com/9MxQdiPjvL9a0gB3yRxItAn9j7rHrR2Vhhr3BgOZgn-QkVT1pT1vBw--aRQalwc-TMAmR0pNHA=s88-c-k-c0x00ffffff-no-rj",
      runningActionId: "99d3253d-6c81-4e5a-b5d7-dc9918d27fb4",
      requeuedAction: false,
    },
    user: {
      display: "Jacob Bolda",
      id: "userId",
      name: "Jacob Bolda",
      role: 4,
      subscribed: false,
      type: "youtube",
    },
  },
});

let defaultTestState = [
  // {
  //   message:
  //     "1 how about some more text here, but this one is much longer than the others",
  //   eventId: "default1",
  // },
  // {
  //   message: "2 how about some more text here, this has more but less",
  //   eventId: "default2",
  // },
  // { message: "3 how about some more text here", eventId: "default3" },
  // { message: "4 how about some text", eventId: "default4" },
  // { message: "5 how about some more text here", eventId: "default5" },
  // { message: "6 how about some more text here", eventId: "default6" },
  // { message: "7 how about some more text here", eventId: "default7" },
  // { message: "8 how about some more text here", eventId: "default8" },
  // {
  //   message:
  //     "9 how about some more text here, but quite a bit longer but not the longest",
  //   eventId: "default9",
  // },
  // { message: "10 helllooo", eventId: "default10" },
  // { message: "11 how about some more text here", eventId: "default11" },
];
