/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export default function Model({ position = [0, 0, 0], ...props }) {
  const group = useRef();

  const { nodes, materials } = useGLTF(
    "../../assets/gltf/structure/w-flange.gltf"
  );
  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.Plane.geometry}
        material={materials["Material.001"]}
      />
    </group>
  );
}

useGLTF.preload("../../assets/gltf/structure/w-flange.gltf");
