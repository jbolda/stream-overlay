import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Physics,
  RigidBody,
  Debug,
  InstancedRigidBodies,
  CuboidCollider,
} from "@react-three/rapier";
import { Plane } from "@react-three/drei";
import { useSuzanne } from "../models/all-shapes.jsx";

import WFlange from "./wflange.jsx";

import * as classes from "../../canvas.module.css";

// position args an array of [x, y, z]
// where y is vertical, x is towards our camera
// and z is side to side relative to our camera
const COUNT = 1000;
export default function ModelCanvas() {
  const {
    nodes: { Suzanne },
  } = useSuzanne();

  const onCollisionEnter =
    (key) =>
    ({ manifold }) => {
      // if (manifold.solverContactPoint(0).y <= -30) {
      // console.log(`collision(index: ${key})`, manifold.solverContactPoint(0));
      setElements((state) => {
        state.delete(key);
        console.log(`removed(index: ${key})`, state);
        return state;
      });
      // }
    };
  const [elements, setElements] = useState(() => {
    const elementMap = new Map();
    const initial = Array(7)
      .fill(null)
      .flatMap((_, index) => [
        {
          key: index,
          element: (
            <RigidBody
              key={index}
              position={[0, 55, index * 3]}
              onCollisionEnter={onCollisionEnter(index)}
            >
              <WFlange />
            </RigidBody>
          ),
        },
        {
          key: index + 100,
          element: (
            <RigidBody
              key={index + 100}
              position={[0, 35, index * 3]}
              onCollisionEnter={onCollisionEnter(index + 100)}
            >
              <WFlange />
            </RigidBody>
          ),
        },
      ]);

    initial.forEach((element) => elementMap.set(element.key, element.element));

    return elementMap;
  });

  // const handleClickInstance = (evt) => {
  //   if (api.current) {
  //     api.current.at(evt.instanceId).applyTorqueImpulse({ x: 0, y: 100, z: 0 });
  //   }
  // };

  // We can set the initial positions, and rotations, and scales, of
  // the instances by providing an array equal to the instance count
  const positions = Array.from({ length: COUNT }, (_, index) => [
    0,
    40,
    index * 3,
  ]);

  // const rotations = Array.from({ length: COUNT }, (_, index) => [
  //   Math.random(),
  //   Math.random(),
  //   Math.random(),
  // ]);

  // const scales = Array.from({ length: COUNT }, (_, index) => [
  //   Math.random(),
  //   Math.random(),
  //   Math.random(),
  // ]);

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
          {/* {[...elements.entries()].map(([key, value]) => value)} */}
          <InstancedRigidBodies
            positions={positions}
            // rotations={rotations}
            // scales={scales}
            colliders="hull"
          >
            <instancedMesh
              castShadow
              args={[undefined, undefined, COUNT]}
              // onClick={handleClickInstance}
            >
              {/* <WFlange /> */}
              {/* <meshPhysicalMaterial color={"yellow"} /> */}
            </instancedMesh>
          </InstancedRigidBodies>
        </Physics>
      </Suspense>
    </Canvas>
  );
}
