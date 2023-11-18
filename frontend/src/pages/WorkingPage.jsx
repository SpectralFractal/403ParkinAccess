import React, { useEffect, useState } from "react";
import style from "./Pages.module.css";
import Navbar from "../Components/Navbar/Navbar.jsx";

function WorkingPage(props) {
  const [numarInmatriculare, setNumarInmatriculare] = useState();
  const [error, setError] = useState();

  const parcareCamin1 = [
    { number: 5, status: "occupied" },
    { number: 6, status: "free" },
    { number: 7, status: "occupied" },
    { number: 8, status: "free" },
    { number: 9, status: "free" },
    { number: 10, status: "occupied" },
  ];

  const parcareCamin2 = [
    { number: 1, status: "free" },
    { number: 2, status: "free" },
    { number: 3, status: "free" },
    { number: 4, status: "occupied" },
  ];

  const [currentSpot, setCurrentSpot] = useState();

  const handlecurrentSpotSelection1 = (index) => {
    if (parcareCamin1[index].status === "free") {
      setCurrentSpot(parcareCamin1[index].number);
    } else {
      setError(true);
    }
  };

  const handlecurrentSpotSelection2 = (index) => {
    if (parcareCamin2[index].status === "free") {
      setCurrentSpot(parcareCamin2[index].number);
    } else {
      setError(true);
    }
  };

  function getSpotClass(array, index) {
    if (array[index].number === currentSpot) {
      return "orange";
    } else if (array[index].status === "free") {
      return "#81f381";
    } else {
      return "#f87e7e";
    }
  }

  useEffect(() => {
    if (numarInmatriculare) {
      console.log(numarInmatriculare);
    }
  }, [numarInmatriculare]);

  return (
    <div className={style.wrapper}>
      <div className={style.title}>Parcare Camin 2</div>
      <div className={style.map}>
        {/*<img src="/parcare1.png" alt="parcare1" className={style.mapPng}/>*/}
        <div className={style.colWrapper}>
          <div className={style.col1}>
            {parcareCamin1.map((spot, index) => {
              return (
                <div
                  className={style.spot}
                  style={{
                    backgroundColor: getSpotClass(parcareCamin1, index),
                  }}
                  key={index}
                  onClick={() => handlecurrentSpotSelection1(index)}
                >
                  <div className={style.slotInterior}>
                    {parcareCamin1[index].number}
                  </div>
                </div>
              );
            })}
          </div>
          <div className={style.col2}>
            {parcareCamin2.map((spot, index) => {
              return (
                <div
                  className={style.spot}
                  style={{
                    backgroundColor: getSpotClass(parcareCamin2, index),
                  }}
                  key={index}
                  onClick={() => handlecurrentSpotSelection2(index)}
                >
                  <div className={style.slotInterior}>
                    {parcareCamin2[index].number}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={style.info}>
        <div className={style.step}>
          <img src="/number-1.png" alt="number1" className={style.number} />
          <p>SelecteazĂ un loc dispoibil :</p>
          {error && (
            <div className={style.modalError}>
              <div className={style.modalView}>
                <p className={style.errorText}>Locul este Ocupat !</p>
                <button
                  onClick={() => setError(false)}
                  className={style.errorBtn}
                >
                  Ok
                </button>
              </div>
            </div>
          )}
          {currentSpot && <p>Ati ales locul : {currentSpot}</p>}
        </div>
        {currentSpot && (
          <>
            <div className={style.step}>
              <img src="/number-2.png" alt="number2" className={style.number} />
              <p>Introdu numĂrul de Înmatriculare</p>
              <input
                type="text"
                className={style.input}
                placeholder={"SB 93 MON"}
                onChange={(event) => setNumarInmatriculare(event.target.value)}
              />
            </div>
            <div className={style.buttonContainer}>
              <button className={style.confirmBtn}>ConfirmĂ</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WorkingPage;
