import React from 'react';
import Navbar from "../Components/Navbar/Navbar.jsx";

function LayoutMobile({children}) {
    return (
        <div>
            <Navbar/>
            <div>
                {children}
            </div>
        </div>
    );
}

export default LayoutMobile;