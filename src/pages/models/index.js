import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody, Debug } from "@react-three/rapier";
import { OrbitControls, Plane, RoundedBox } from "@react-three/drei";

import WFlange from "./wflange.js";

import * as classes from "../../canvas.module.css";

export function ModelCanvas() {
  return (
    <Canvas
      className={classes.canvas}
      camera={{ fov: 90, position: [0, 0, 25] }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.3} />
        <OrbitControls makeDefault />
        <Physics colliders="hull">
          {/* <Debug /> */}
          {/* <Frame /> */}
          <RigidBody
            onCollisionEnter={({ manifold }) => {
              console.log(
                "Collision at world position ",
                manifold.solverContactPoint(0)
              );
            }}
            type="fixed"
          >
            {/* <Plane
              args={[30, 30]}
              position={[0, -100, 0]}
              rotation={[90, 0, 0]}
            /> */}
            <RoundedBox
              position={[0, -30, 0]}
              args={[10, 10, 10]}
              radius={0.05}
              smoothness={4}
            >
              <meshPhongMaterial color="#f3f3f3" wireframe />
            </RoundedBox>
          </RigidBody>
          <RigidBody>
            <WFlange position={[0, 0, 0]} />
          </RigidBody>
          <RigidBody>
            <WFlange position={[5, 5, 5]} />
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
