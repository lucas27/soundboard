import '../../scss/addSoundsComponentsScss/PlayerAudio.scss'
import {useRef, useEffect, useState} from 'react'
import music from '../../icon/No More Sorrow - Linkin Park (Minutes To Midnight).mp3'


const time = (value) => {
    const minutes = Math.floor(value / 60).toString().padStart(2, '0')
    const seconds = Math.floor(value % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
}


const Player = ({progress}) => {
    
    const progressBarRef = useRef(null)
    const [play, setPlay] = useState(true)
    const audioRef = useRef(new Audio(music))
    const progressBarBackgroundRef = useRef(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [mouseDown, setMouseDown] = useState(false)
    const [display, setDisplay] = useState('playerAudiodisplayHidden')
    const [durationInProgress, setDurationInProgress] = useState(0)
    const [changeButtonIcon, setChangeButtonIcon] = useState('icon-play')
    const [durationFromProgreessBar, setDurationFromProgreessBar] = useState(0)
    
    const className = () => {
        return `playAndPauseButton ${changeButtonIcon}`
    }  

    const audioFunction = () => {
        try {
            const audioCurrent = audioRef.current
            return audioCurrent
        }catch (err) {
            console.log(err)
        }
    }

    const handleMouseDown = () => {
        setMouseDown(true)
    }
    
    const handleBackward = () => {
        const audio = audioFunction()
        audio.currentTime -= 10
    }
    
    const handleForward = () => {
        const audio = audioFunction()
        audio.currentTime += 10
    }
    
    const handlePlay = () => {
        setPlay(true)
    }
    
    const handlePause = () => {
        setPlay(false)
    }
    
    const handlePlayPause = () => {
        const audio = audioFunction()
        // console.log(play)
        if(play) {
            audio.play()
            setChangeButtonIcon('icon-pause')
            handlePause()
        }else {
            audio.pause()
            setChangeButtonIcon('icon-play')
            handlePlay()
        }
    }

    // console.log(duration)
    useEffect(() => {
        const updateValue = (event) => {
            const audio = audioFunction()
            const progressBar = progressBarRef.current;
            const maxWidthX = progressBar.getBoundingClientRect().width
            const offsetX = (event.clientX - progressBar.getBoundingClientRect().left)
            const limitedX = Math.floor(Math.max(0, Math.min(offsetX, maxWidthX)))
            const porcentage = Math.round((limitedX / maxWidthX) * 100)
            // setMousePosition(porcentage)
            // console.log( limitedX,mousePosition, porcentage)
            
            const controlCurrentTime = Math.floor(( porcentage/ 100) * audio.duration) 
            
            if(mouseDown) {
                audio.currentTime = controlCurrentTime
                
            }
        }


        const handleMouseMove = (event) => {
            if(mouseDown) {
                updateValue(event)
            }
        }
        const handleMouseUp = () => {
            setMouseDown(false)
        }
        if(mouseDown) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            document.removeEventListener('mousemup', handleMouseUp)
            document.removeEventListener('mousemove', handleMouseMove)
        }
              
    }, [mouseDown])


    useEffect(()=>{
        const audio = audioFunction()
        
        const handleTimeUpdate = () => {
            const progressTime = audio.currentTime
            const durationPorcentage = Math.round((progressTime/ audio.duration) * 100)
            
            if(durationPorcentage >= 100) {
                setChangeButtonIcon('icon-play')
                handlePlay()
            }

            progressBarBackgroundRef.current.style.setProperty('--progress-bar', `${durationPorcentage}%`)
            setCurrentTime(time(progressTime))
            setDurationInProgress(durationPorcentage)
            // console.log(currentTime, durationInProgress) 
        } 

        const handleAudioDuration = () => {
            setCurrentTime(time(audio.currentTime))
            setDurationFromProgreessBar(time(audio.duration))
        }
        
        audio.addEventListener('timeupdate', handleTimeUpdate)
        audio.addEventListener('loadedmetadata', handleAudioDuration)
       
        // audio.currentTime = 190
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate)
            audio.removeEventListener('loadedmetadata', handleAudioDuration)
        }
    },[currentTime])

    useEffect(() =>{
        if(progress >= 100) {
            setTimeout(()=>{
                setDisplay('playerAudiodisplayShow')
            
            },1000)
        }
        
    }, [progress])
    
    return (
        <>
            {/* <div style={{color: 'blue'}}>{mousePosition}</div> */}
            <div className='box-father'>
                {/* <div ref={refShowPlayer} className="box-player">       */}
                <div  className={`box-player ${display}`}>      
                    <div className="box-bar" onMouseDown={handleMouseDown} ref={progressBarRef}>
                        {/* <progress className='progressBar'  max={100} value={mousePosition} ></progress>
                        <div  className='point' onMouseDown={handleMouseDown} ></div> */}
                        <input type="range" 
                        ref={progressBarBackgroundRef}
                        className='progressBar'  
                        min={0}
                        max={100} 
                        value={durationInProgress} 
                        onChange={handleMouseDown}/>
                    </div>
                    <div className='time'>
                        <i className='currentTime'>{currentTime}</i>
                        <i className='totalTime'>{durationFromProgreessBar}</i>
                    </div>
                    <div className="box-button">
                        <button className="backButton" onClick={handleBackward}></button>
                        <button className={className()} onClick={handlePlayPause}></button>
                        <button className="forwardButton" onClick={handleForward}></button>
                    </div> 
                </div>
            </div>
        </>
    )
}

export default Player