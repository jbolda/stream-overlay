import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, usePlane } from "@react-three/cannon";
import { OrbitControls } from "@react-three/drei";

import WFlange from "./WFlange.js";

import * as classes from "../../canvas.module.css";

export function ModelCanvas() {
  return (
    <Canvas
      className={classes.canvas}
      camera={{ fov: 90, position: [0, 0, 25] }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <OrbitControls makeDefault />
        <Physics>
          {/* <Frame /> */}
          <Plane />
          <WFlange position={[0, 5, 0]} />
          <WFlange position={[0, 35, 0]} />
          <WFlange position={[10, 5, 0]} />
          <WFlange position={[10, 35, 0]} />
          {/* <WFlange position={[2, 200, 0]} /> */}
        </Physics>
      </Suspense>
    </Canvas>
  );
}

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref}>
      <planeGeometry args={[100, 100]} />
    </mesh>
  );
}
