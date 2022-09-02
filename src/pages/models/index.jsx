import React, { Suspense, useState } from "react";
import { useTwitch } from "../../context/twitch-inputs";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody, Debug } from "@react-three/rapier";
import { Plane } from "@react-three/drei";

import WFlange from "./wflange.jsx";
import Cup from "./cup.jsx";
import Star from "./star.jsx";
import BumpTorus from "./bump-torus.jsx";
import SpikeySphere from "./spikey-sphere.jsx";

import * as classes from "../../canvas.module.css";

// position args an array of [x, y, z]
// where y is vertical, x is towards our camera
// and z is side to side relative to our camera
const COUNT = 25;
export default function ModelCanvas() {
  const twitchStream = useTwitch();

  return (
    <Canvas
      className={classes.canvas}
      camera={{ fov: 90, position: [-15, 9, 22] }}
      onCreated={(three) => {
        three.camera.lookAt(0, 12, 22);
      }}
    >
      <Suspense fallback={null}>
        <directionalLight color={0xffffff} intensity={0.8} />
        <hemisphereLight color={0xffffff} intensity={0.3} />
        <pointLight color={0xffffff} intensity={0.3} />
        <Physics colliders="hull" gravity={[0, -9.81, 0]}>
          {/* <Debug /> */}
          <RigidBody type="fixed">
            <Plane
              args={[0.2, 100]}
              position={[0, 0, 0]}
              rotation={[1.57, 0, 0]}
            />
          </RigidBody>
          <WFlange count={COUNT} twitchStream={twitchStream} />
          <Cup count={COUNT} twitchStream={twitchStream} />
          <Star count={COUNT} twitchStream={twitchStream} />
          <BumpTorus count={COUNT} twitchStream={twitchStream} />
          <SpikeySphere count={COUNT} twitchStream={twitchStream} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}
