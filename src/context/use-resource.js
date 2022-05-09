import React, { useState, ErrorBoundary } from "react";
import { useOperation } from "@effection/react";

export function useResource(resource, deps = []) {
  let [state, setState] = useState({ type: "pending" });

  useOperation(function* () {
    try {
      yield function* ErrorBoundary() {
        setState({ type: "resolved", value: yield resource });
        yield;
      };
    } catch (error) {
      setState({ type: "rejected", error: error });
    }
  }, deps);

  return state;
}
