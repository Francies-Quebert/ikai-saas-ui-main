import React, { useState, useEffect } from "react";
import _ from "lodash";

class columnProps {
  constructor(Id, isValid, value) {
    this.Id = Id;
    this.isValid = isValid;
    this.value = value;
  }
}

const columnObject = [
  new columnProps(1, false, null),
  new columnProps(2, false, null),
  new columnProps(3, false, null),
  new columnProps(4, false, null),
  new columnProps(5, false, null),
  new columnProps(6, false, null),
  new columnProps(7, false, null),
  new columnProps(8, false, null),
  new columnProps(9, false, null),
];

const MyPage = [
  {
    row: 1,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 2,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 3,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 4,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 5,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 6,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 7,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 8,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 9,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 10,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 11,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 12,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 13,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 14,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 15,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 16,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 17,
    randomColIds: [],
    columns: columnObject,
  },
  {
    row: 18,
    randomColIds: [],
    columns: columnObject,
  },
];

const Page1 = (props) => {
  const [arrayOfRandomPages, setArrayOfRandomPages] = useState([]);
  const pgData = _.clone(MyPage);
  return (
    <>
      <div
        onClick={() => {
          setArrayOfRandomPages([]);
          while (arrayOfRandomPages.length < 18) {
            let rand = getUniqueRandomNos(1, 18, arrayOfRandomPages);
            let kkk = arrayOfRandomPages;
            kkk.push(rand);
            setArrayOfRandomPages(kkk);
            let rowId = pgData.findIndex((item) => item.row === rand);
            pgData[rowId].randomColIds = [];
            let i = 0;
            for (i = 0; i < 5; i++) {
              let randCol = getUniqueRandomNos(
                1,
                9,
                pgData[rowId].randomColIds
              );
              pgData[rowId].randomColIds.push(randCol);
            }
          }

          //Convert the same into columanar

          let i = 1;
          for (i = 1; i <= 9; i++) {
            let u = 1;
            for (u = 1; u <= 18; u++) {}
          }

          // setMyPage(MyPage);
        }}
      >
        Click To Regenerate
      </div>
      <table>
        {pgData.map((row) => {
          return (
            <tr>
              {row.columns.map((col) => {
                let inx = row.randomColIds.findIndex((klk) => klk === col.Id);

                return (
                  <td
                    style={{
                      padding: 5,
                      paddingRight: 20,
                      color: inx >= 0 ? "black" : "white",
                      backgroundColor: inx >= 0 ? "yellow" : null,
                    }}
                  >
                    {/* {row.row * col.Id} */}
                    {col.value}
                  </td>
                );
              })}
              {row.row === 3 && <br></br>}
            </tr>
          );
        })}
      </table>
    </>
  );
};

const getUniqueRandomNos = (pFrom, pTo, arrExclusiveList) => {
  let jj = _.random(pFrom, pTo, false);
  if (
    arrExclusiveList.find((ko) => ko === jj) !== undefined &&
    pTo - pFrom >= arrExclusiveList.length
  )
    return jj;
};

const HousiePage = (props) => {
  const [arrayOfRandoms, setArrayOfRandoms] = useState([]);
  const [rand, setRand] = useState();

  return (
    <>
      <div>
        <Page1 />
        <h1>{rand}</h1>
        <h6>Total Count : {arrayOfRandoms.length}</h6>
      </div>
      <div
        onClick={() => {
          if (arrayOfRandoms.length >= 90) {
            return null;
          }
          let rand = getUniqueRandomNos(1, 90, arrayOfRandoms);
          let kkk = arrayOfRandoms;
          kkk.push(rand);
          setArrayOfRandoms(kkk);
          setRand(rand);
        }}
      >
        Click to generate new number
      </div>

      <ul>
        {arrayOfRandoms.map((ii) => (
          <li>{ii}</li>
        ))}
      </ul>
    </>
  );
};

export default HousiePage;
