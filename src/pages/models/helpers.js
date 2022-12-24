export const filterModels = (model, message) => {
  switch (true) {
    case message.includes(model):
      return true;
  }
};

export function useAlert(stream, toggleDrop) {
  let [state, setState] = useState({ message: "" });
  useOperation(
    stream.forEach(function* (value) {
      console.log(value);
      setState(value);
      toggleDrop(true);
    }),
    [stream]
  );
  return state;
}
