import React from "react";
import style from "./Navbar.module.css";
import { useHistory } from "react-router-dom";

function Navbar(props) {
  const history = useHistory();

  return (
    <div className={style.navbar}>
      <div className={style.logo} onClick={() => history.push("/")}>
        <img src="/sb.png" alt="" className={style.stema} />
        <div className={style.text}>
          <p>Sibiu</p>
          <p>SMART</p>
        </div>
      </div>
      <div className={style.menu}>
        <img src="/menu.png" alt="" className={style.stema} />
      </div>
    </div>
  );
}

export default Navbar;
