/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import React from "react";
import { useGLTF } from "@react-three/drei";
import Instances from "./instances";
import { filterModels } from "./helpers";

import sphere from "../../assets/gltf/items/spikey-sphere-transformed.glb";

const COUNT = 25;
export default function Model({ position = [0, 0, 0], dropCommand, ...props }) {
  const { nodes, materials } = useGLTF(sphere);
  return (
    <Instances
      commandStream={dropCommand}
      commandFilterFn={(command) =>
        filterModels("spheres", command?.data?.arguments?.input0) ||
        filterModels("spikey", command?.data?.arguments?.input0)
      }
      count={COUNT}
      {...props}
    >
      <instancedMesh
        castShadow
        receiveShadow
        args={[nodes.Cube.geometry, materials["Material 1"], COUNT]}
        count={COUNT}
      />
    </Instances>
  );
}

useGLTF.preload(sphere);
