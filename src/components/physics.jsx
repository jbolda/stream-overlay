import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { PerspectiveCamera } from "@react-three/drei";

import * as classes from "../canvas.module.css";

// for using the editor in theater.js
// import { getProject } from "@theatre/core";
// import studio from "@theatre/studio";
// import extension from "@theatre/r3f/dist/extension";
// studio.initialize();
// studio.extend(extension);
// import { editable, SheetProvider } from "@theatre/r3f";
// import { PerspectiveCamera } from "@theatre/r3f";

// position args an array of [x, y, z]
// where y is vertical, x is towards our camera
// and z is side to side relative to our camera

export default function PhysicsCanvas({ children }) {
  return (
    <Canvas className={classes.canvas}>
      {/* <SheetProvider sheet={getProject("Demo Project").sheet("Demo Sheet")}> */}
      <PerspectiveCamera
        theatreKey="Camera"
        makeDefault
        fov={45}
        rotation={[1.576, -1.458, 1.576]}
        position={[-37, 10, 26.75]}
      />
      <Suspense fallback={null}>
        <directionalLight color={0xffffff} intensity={0.8} />
        <hemisphereLight color={0xffffff} intensity={0.3} />
        <pointLight theatreKey="Light" color={0xffffff} intensity={0.3} />
        {/* <editable.mesh theatreKey="Corners BL" position={[1, 0, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </editable.mesh>
          <editable.mesh theatreKey="Corners TL" position={[1, 30, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </editable.mesh>
          <editable.mesh theatreKey="Corners BR" position={[1, 0, 53.3]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </editable.mesh>
          <editable.mesh theatreKey="Corners TR" position={[1, 30, 53.3]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </editable.mesh>
          <editable.mesh theatreKey="Center" position={[0, 15, 26.6]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" />
          </editable.mesh> */}
        <Physics colliders="hull" gravity={[0, -9.81, 0]}>
          {children}
        </Physics>
      </Suspense>
      {/* </SheetProvider> */}
    </Canvas>
  );
}

// import mergeRefs from "react-merge-refs";
// import { useThree } from "@react-three/fiber";
// export const PerspectiveCamera = React.forwardRef(
//   ({ makeDefault, ...props }, ref) => {
//     const set = useThree(({ set }) => set);
//     const camera = useThree(({ camera }) => camera);
//     const size = useThree(({ size }) => size);
//     const cameraRef = React.useRef(null);

//     React.useLayoutEffect(() => {
//       if (!props.manual) {
//         cameraRef.current.aspect = size.width / size.height;
//       }
//     }, [size, props]);

//     React.useLayoutEffect(() => {
//       cameraRef.current.updateProjectionMatrix();
//     });

//     React.useLayoutEffect(() => {
//       if (makeDefault) {
//         const oldCam = camera;
//         set(() => ({ camera: cameraRef.current }));
//         return () => set(() => ({ camera: oldCam }));
//       }
//       // The camera should not be part of the dependency list because this components camera is a stable reference
//       // that must exchange the default, and clean up after itself on unmount.
//     }, [cameraRef, makeDefault, set]);

//     return (
//       <editable.perspectiveCamera
//         ref={mergeRefs([cameraRef, ref])}
//         {...props}
//       />
//     );
//   }
// );
