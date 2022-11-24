import React, { Suspense, useState } from "react";
import { useStreamEvents } from "../../context/stream-events.jsx";
import { useOperation } from "@effection/react";
import { Canvas } from "@react-three/fiber";
import { TextLayer } from "./text-layer.jsx";

import * as classes from "../../canvas.module.css";

export default function AlertCanvas() {
  const twitchStream = useStreamEvents();
  const channelAlert = useAlert(
    twitchStream.filter(
      (alert) =>
        alert?.event?.type === "ChatMessage" &&
        alert?.data?.message?.message?.startsWith("!3d ")
    )
  );

  return (
    <Canvas
      className={classes.canvas}
      camera={{ fov: 90, position: [0, 0, 5] }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.2} />
        <directionalLight />
        <TextLayer channelAlert={channelAlert} />
      </Suspense>
    </Canvas>
  );
}

export function useAlert(stream) {
  let [state, setState] = useState({ message: "" });
  useOperation(
    stream.forEach(function* (event) {
      setState({
        ...event.data.message,
        message: event.data.message.message.slice(4),
      });
    }),
    [stream]
  );
  return state;
}
