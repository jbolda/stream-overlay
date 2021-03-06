import React from "react";

import { useTransition, animated } from "@react-spring/three";
import { Text3D, Float, useMatcapTexture } from "@react-three/drei";
// import { Physics, useBox } from "@react-three/cannon";

export const TextLayer = ({ textMessage, setTwitch }) => {
  // const [meshRef] = useBox(() => ({ mass: 1 }));

  const transition = useTransition(textMessage, {
    from: { scale: 0, wait: 0 },
    enter: (item) => async (next, cancel) => {
      await next({ scale: 1 });
      await next({ wait: 1 });
    },
    leave: { scale: 0, wait: 0 },
    config: (item, index, phase) => (key) => {
      return phase === "enter" && key === "wait" ? { duration: 3000 } : {};
    },
    onRest: () => setTwitch({}),
  });

  // we could also look at using these: https://ambientcg.com/
  const [matcap, url] = useMatcapTexture(
    "617586_23304C_1B1E30_4988CF"
    // 0, // index of the matcap texture https://github.com/emmelleppi/matcaps/blob/master/matcap-list.json
    // 1024 // size of the texture ( 64, 128, 256, 512, 1024 )
  );

  return (
    <Float floatIntensity={5} speed={2}>
      {transition(({ scale }, message) => {
        const wordsArray = message.split(" ");
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
                  position={[-0.5 * (numberOfLetters / 2), -index * 0.9, 0]}
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
