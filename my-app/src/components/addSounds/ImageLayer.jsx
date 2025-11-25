import React from "react";
import styleImageLayerModule from "../../scss/addSounds/ImageLayer.module.scss"
import { AudioLines } from 'lucide-react'

// console.log(window.api.send())

const image = ({imagePath}) => {
   const defaultImage = () => {
        if(imagePath !== null) {
            return <img className={styleImageLayerModule.img} src={imagePath} alt=""/>
        }else {
            return <AudioLines className={styleImageLayerModule.img}/>
        }    
   }

    return (
        <>
            <div className={styleImageLayerModule.imageSpace}>
                {defaultImage()}
            </div>
        </>
    )
}

export default image