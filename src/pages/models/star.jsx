/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/
import React, { useRef, useState, useEffect } from "react";
import { useOperation } from "@effection/react";
import { useGLTF, useMatcapTexture } from "@react-three/drei";
import { InstancedRigidBodies } from "@react-three/rapier";
import { filterModels, useAlert } from "./helpers";

import star from "../../assets/gltf/items/star-transformed.glb";

export default function Model({
  position = [0, 0, 0],
  count = 10,
  dropCommand,
  ...props
}) {
  const group = useRef();
  const api = useRef();
  const [drop, toggleDrop] = useState(true);
  useAlert(
    dropCommand.filter(
      (command) =>
        command?.data?.arguments?.input0 === "" ||
        filterModels("star", command?.data?.arguments?.input0)
    ),
    toggleDrop
  );

  // We can set the initial positions, and rotations, and scales, of
  // the instances by providing an array equal to the instance count
  const positions = Array.from({ length: count }, (_, index) => [
    0,
    40 + 50 * Math.random(),
    index * 3 - 5,
  ]);

  useEffect(() => {
    if (drop) {
      api.current.forEach((mesh, index) => {
        // mesh.sleep();
        mesh.setRotation({ x: 0, y: 0, z: 0 });
        mesh.setLinvel({ x: 0, y: 0, z: 0 });
        mesh.setAngvel({ x: 0, y: 0, z: 0 });
        mesh.setTranslation({
          x: 0,
          y: 40 + 50 * Math.random(),
          z: index * 3 - 5,
        });
      });
      toggleDrop(false);
    }
  }, [drop]);

  const [matcap] = useMatcapTexture(
    // https://github.com/emmelleppi/matcaps/blob/master/PAGE-31.md
    "E6BF3C_5A4719_977726_FCFC82",
    1024 // size of the texture ( 64, 128, 256, 512, 1024 )
  );

  const { nodes, materials } = useGLTF(star);
  return (
    <group {...props} dispose={null}>
      <InstancedRigidBodies positions={positions} colliders="hull" ref={api}>
        <instancedMesh
          castShadow
          receiveShadow
          args={[nodes.Cube.geometry, materials.Material, count]}
        >
          <meshMatcapMaterial matcap={matcap} />
        </instancedMesh>
      </InstancedRigidBodies>
    </group>
  );
}

useGLTF.preload(star);
