import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { TextLayer } from "../../components/text-layer.jsx";

import * as classes from "../../canvas.module.css";

export default function AlertCanvas() {
  return (
    <Canvas
      className={classes.canvas}
      camera={{ fov: 90, position: [0, 0, 5] }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <directionalLight />
        <TextLayer />
      </Suspense>
    </Canvas>
  );
}
