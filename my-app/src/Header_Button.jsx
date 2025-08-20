import React from "react"
import "./HeaderButton.css";

const Header = () => {
    return (
        <>
            <div className="header">
                <button>add</button>
                <button>config</button>
                <button>in development</button>
            </div>
        </>
    )
}

export default Header