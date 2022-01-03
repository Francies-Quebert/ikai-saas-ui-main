import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const HotKeys = () => {
  const [count, setCount] = useState(0);

  useHotkeys("F1", (a, s, d) => {
    a.preventDefault();
    setCount((prevCount) => prevCount + 1);
  });

  useHotkeys("ctrl+down", () => setCount((prevCount) => prevCount - 1));

  return <div>Pressed {count} times.</div>;
};

export default HotKeys;
