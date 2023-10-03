import React, { useState } from "react";
import { useStreamEvents } from "../context/stream-events.jsx";
import { useOperation } from "@effection/react";
import { useTransition, animated } from "@react-spring/three";
import { Text3D, Float, useMatcapTexture } from "@react-three/drei";

// const offsetPosition = { x: 20, y: 20, z: 20 };
const offsetPosition = { x: 0, y: 0, z: 0 };
// const initialRotation = { x: -1.2, y: -2, z: -1.2, w: 1.0 };
export const TextLayer = () => {
  const streamerBotEvents = useStreamEvents();
  const channelAlert = useAlert(
    streamerBotEvents.channel.filter(
      (alert) =>
        alert?.data?.name === "Command" &&
        alert?.data?.arguments?.command === "!3d"
    )
  );

  const transition = useTransition(channelAlert?.arguments?.rawInput, {
    from: { scale: 0, wait: 0 },
    enter: (item) => async (next, cancel) => {
      await next({ scale: 1 });
      await next({ wait: 1 });
      await next({ scale: 0 });
    },
    leave: { scale: 0, wait: 0 },
    config: (item, index, phase) => (key) => {
      return phase === "enter" && key === "wait"
        ? { duration: item.timeout }
        : { duration: 1000 };
    },
  });

  const [matcap] = useDynamicTexture(channelAlert?.arguments?.rawInput);

  return (
    <Float floatIntensity={5} speed={2}>
      {transition(({ scale }, alert) => {
        console.log(alert);
        const wordsArray = alert.split(" ");
        if (wordsArray[0].startsWith("index")) wordsArray.shift();
        const numberOfWords = wordsArray.length + 1;
        const wordsPerLine = Math.floor(numberOfWords / 3);
        const formattedMessage = wordsArray.reduce(
          (messageArray, word, index) => {
            const lineIndex = Math.floor(index / wordsPerLine);
            if (index % wordsPerLine > 0) {
              messageArray[lineIndex] = `${messageArray[lineIndex]} ${word}`;
              return messageArray;
            } else {
              return messageArray.concat([word]);
            }
          },
          []
        );
        return (
          <animated.mesh scale={scale}>
            {formattedMessage.map((messageChunk, index) => {
              const numberOfLetters = messageChunk.split("").length;
              return (
                <Text3D
                  key={index}
                  font={
                    "https://drei.pmnd.rs/fonts/helvetiker_regular.typeface.json"
                  }
                  size={0.6} // default is 1
                  height={0.2} // default is 0.2
                  bevelEnabled
                  bevelSize={0.05}
                  position={[
                    offsetPosition.x + -0.5 * (numberOfLetters / 2),
                    offsetPosition.y + -index * 0.9,
                    offsetPosition.z,
                  ]}
                  // rotation={[
                  //   initialRotation.x,
                  //   initialRotation.y,
                  //   initialRotation.z,
                  // ]}
                >
                  {messageChunk}
                  <meshMatcapMaterial matcap={matcap} />
                </Text3D>
              );
            })}
          </animated.mesh>
        );
      })}
    </Float>
  );
};

export function useDynamicTexture(alert) {
  let matDefault = "617586_23304C_1B1E30_4988CF";
  let matcap;

  let mat = matDefault;
  if (alert?.startsWith("index:")) {
    let matInput = alert?.split(" ")[0];
    console.log(matInput);
    let [indexArg, materialArg] = matInput.split(":");
    if (materialArg) mat = parseInt(materialArg.trim()); // ?? materialArg;
    console.log({ mat });
  }

  // we could also look at using these: https://ambientcg.com/
  const [matcapLoaded] = useMatcapTexture(
    // "617586_23304C_1B1E30_4988CF"
    mat, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
    1024 // size of the texture ( 64, 128, 256, 512, 1024 )
  );
  matcap = matcapLoaded;

  return [matcap];
}

export function useAlert(stream) {
  let [state, setState] = useState({ message: "" });
  useOperation(
    stream.forEach(function* (event) {
      setState({
        ...event.data,
      });
    }),
    [stream]
  );
  return state;
}
