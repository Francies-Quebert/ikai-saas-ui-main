import React, { useEffect, useState } from "react";
import { getRestaurantInvoiceDtl } from "../../../../../services/restaurant-pos";

// class Quantity extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = { value: 1 };
//     this.increment = this.increment.bind(this);
//     this.decrement = this.decrement.bind(this);
//   }

//   render() {
//     return (
//       <div>
//         <p>Set the quantity</p>
//         <div className="quantity-input">
//           <button
//             className="quantity-input__modifier quantity-input__modifier--left"
//             onClick={this.decrement}
//           >
//             &mdash;
//           </button>
//           <input
//             className="quantity-input__screen"
//             type="text"
//             value={this.state.value}
//             readonly
//           />
//           <button
//             className="quantity-input__modifier quantity-input__modifier--right"
//             onClick={this.increment}
//           >
//             &#xff0b;
//           </button>
//         </div>
//       </div>
//     );
//   }
// }

const QuantityComponent = (props) => {
  const [value, setValue] = useState(1);

  const increment = () => {
    let tempValue = value + 1;
    setValue(tempValue);
  };

  const decrement = () => {
    if (value > 1) {
      let tempValue = value - 1;
      setValue(tempValue);
    }
  };

  return (
    <div>
      <p>Set the quantity</p>
      <div className="quantity-input">
        <button
          className="quantity-input__modifier quantity-input__modifier--left"
          onClick={() => decrement()}
        >
          &mdash;
        </button>
        <input
          className="quantity-input__screen"
          type="text"
          value={value}
          readonly
        />
        <button
          className="quantity-input__modifier quantity-input__modifier--right"
          onClick={() => increment()}
        >
          &#xff0b;
        </button>
      </div>
    </div>
  );
};

export default QuantityComponent;
