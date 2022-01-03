import React, { useEffect, useState } from "react";

const CountdownCustom = (props) => {
  const [count, setCount] = useState(props.value);
  const [intervalId, setIntervalId] = useState();
  useEffect(() => {
    let TotalCount = props.value;
    let tempIntervalId = setInterval(() => {
      if (TotalCount >= 1) {
        setCount(TotalCount - 1);
        TotalCount = TotalCount - 1;
        // console.log(TotalCount);
      } else {
        props.onFinish();
        clearInterval(tempIntervalId);
      }
    }, 1000);
    setIntervalId(tempIntervalId);
    return () => {
      clearInterval(tempIntervalId);
    };
  }, []);
  return <span>{count} sec</span>;
};

export default CountdownCustom;
