import React, { useRef, useState, useEffect, useMemo } from "react";
import { InstancedRigidBodies } from "@react-three/rapier";
import { useAlert } from "./helpers";

export default function Instances({
  children,
  count = 10,
  commandStream,
  commandFilterFn,
  ...props
}) {
  const group = useRef();
  const rigidBodies = useRef();
  const [drop, toggleDrop] = useState(true);
  useAlert(commandStream.filter(commandFilterFn), toggleDrop);

  useEffect(() => {
    if (drop) {
      rigidBodies.current.forEach((mesh, index) => {
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

  // We can set the initial positions, and rotations, and scales, of
  // the instances by providing an array of InstancedRigidBodyProps
  // which is the same as RigidBodyProps, but with an additional "key" prop.
  const instances = useMemo(() => {
    const instances = [];

    for (let i = 0; i < count; i++) {
      instances.push({
        key: "instance_" + Math.random(),
        position: [0, 40 + 50 * Math.random(), i * 3 - 5],
      });
    }

    return instances;
  }, []);

  return (
    <group ref={group} {...props} dispose={null}>
      <InstancedRigidBodies
        instances={instances}
        colliders="hull"
        ref={rigidBodies}
      >
        {children}
      </InstancedRigidBodies>
    </group>
  );
}
