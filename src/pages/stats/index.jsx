import React, { useEffect, useState, useRef } from "react";
import { useStreamEvents } from "../../context/stream-events.jsx";
import { useOperation } from "@effection/react";

import * as classes from "./stats.module.css";

export default function AlertCanvas() {
  const streamerBotEvents = useStreamEvents();
  const commandHandler = useCommand(
    streamerBotEvents.channel.filter(({ data }) => {
      return data?.arguments?.eventSource === "command";
    })
  );

  return (
    <ul className={classes.stats}>
      {Object.entries(commandHandler).map(([command, counter]) => (
        <li key={command} className={classes.commandGroup}>
          <span className={classes.commandName}>{command}: </span>
          <Counter text={counter} />
        </li>
      ))}
    </ul>
  );
}

function Counter({ text }) {
  const counterRef = useRef(null);
  useEffect(() => {
    counterRef.current.classList.add(classes.commandTransition);
    let transitionDelay = setTimeout(() => {
      counterRef.current.classList.remove(classes.commandTransition);
    }, 1000);
    return () => {
      clearTimeout(transitionDelay);
    };
  }, [text]);
  return (
    <span ref={counterRef} className={classes.commandCounter}>
      {text}
    </span>
  );
}

export function useCommand(stream) {
  let [state, setState] = useState({ ["!drop"]: 0, ["!3d"]: 0 });
  useOperation(
    stream.forEach(function* (event) {
      setState((prevState) => ({
        ...prevState,
        [event.data.arguments.command]: event.data.arguments.counter,
      }));
    }),
    [stream]
  );
  return state;
}
