import {useRef, useEffect} from "react"
import styleLoaderModule from "../../scss/addSounds/Loader.module.scss"


const Loading = ({width}) => {
    const widthRef = useRef(0)
    const displayRef = useRef(0)

    useEffect(()=> {
        if(width !== 0){
            displayRef.current.style.setProperty('visibility', 'visible')
        }
        widthRef.current.style.setProperty('--set-value', `${width}%`)
        if(width >= 100) {
            setTimeout(()=>{
                displayRef.current.style.setProperty('display', 'none')
            }, 1000)
        }
        
    }, [width])
    
    return (
    <>
        <div ref={displayRef} className={styleLoaderModule.box}>
            <div ref={widthRef} className={styleLoaderModule.boxLoader}></div>
        </div>
    </>
    )
    // style={{width: parseInt(width) + '%'}}
}

export default Loading