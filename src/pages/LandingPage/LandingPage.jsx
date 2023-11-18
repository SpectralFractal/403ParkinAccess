import React from 'react';
import style from './LandingPage.module.css'
import Navbar from "../../Components/Navbar/Navbar.jsx";
import {Link} from "react-router-dom";
import WorkingPage from "../WorkingPage.jsx";
import { useHistory } from "react-router-dom";

function LandingPage(props) {
    const history = useHistory();

    return (
        <>
        <Navbar/>
        <div className={style.wrapper}>
            <img src="/sb.png" alt="" className={style.logo}/>
            <div className={style.buttons}>
                <button className={style.confirmBtn} onClick={() => history.push("/main")}>
                    Cauta loc de Parcare
                </button>
                <button className={style.confirmBtn} onClick={() => history.push("/test")}>
                   Test
                </button>
                <button className={style.confirmBtn} onClick={() => history.push("/video")}>
                    view live video
                </button>
            </div>

        </div>

        </>
    );
}

export default LandingPage;