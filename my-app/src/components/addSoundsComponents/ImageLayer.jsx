import React from "react";
import "../../scss/addSoundsComponentsScss/ImageLayer.scss"


// console.log(window.api.send())

const image = ({imagePath}) => {
    return (
        <>
            <div className="image_space">
                <img className="img" src={imagePath} alt=""/>
            </div>
        </>
    )
}

export default image