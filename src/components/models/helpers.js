import { useState } from "react";
import { useOperation } from "@effection/react";

export const filterModels = (model, message) => {
  if (!message || message === "") {
    return true;
  } else {
    return message.includes(model);
  }
};

export function useAlert(stream, toggleDrop) {
  let [state, setState] = useState({ message: "" });
  useOperation(
    stream.forEach(function* (value) {
      setState(value);
      toggleDrop(true);
    }),
    [stream]
  );
  return state;
}
