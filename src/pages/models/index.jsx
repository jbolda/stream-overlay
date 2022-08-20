import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody, Debug } from "@react-three/rapier";
import { Plane } from "@react-three/drei";

import WFlange from "./wflange.jsx";

import * as classes from "../../canvas.module.css";

// position args an array of [x, y, z]
// where y is vertical, x is towards our camera
// and z is side to side relative to our camera

export default function ModelCanvas() {
  return (
    <Canvas
      className={classes.canvas}
      camera={{ fov: 90, position: [15, 9, 0] }}
      onCreated={(three) => {
        three.camera.lookAt(0, 12, 0);
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.0} />
        <Physics colliders="hull">
          {/* <Debug /> */}
          <RigidBody type="fixed">
            <Plane
              args={[1, 100]}
              position={[0, 0, 0]}
              rotation={[1.57, 0, 0]}
            />
          </RigidBody>
          <RigidBody
            position={[0, 5, 0]}
            onCollisionEnter={({ manifold }) => {
              console.log(
                "Collision at world position ",
                manifold.solverContactPoint(0)
              );
            }}
          >
            <WFlange />
          </RigidBody>
          <RigidBody position={[0, 40, 0]}>
            <WFlange />
          </RigidBody>
          <RigidBody position={[0, 40, 3]}>
            <WFlange />
          </RigidBody>
          <RigidBody position={[0, 40, -3]}>
            <WFlange />
          </RigidBody>
          {/* <RigidBody>
            <WFlange position={[100, 5, 20]} />
          </RigidBody>
          <RigidBody>
            <WFlange position={[100, 350, 30]} />
          </RigidBody> */}
        </Physics>
      </Suspense>
    </Canvas>
  );
}
