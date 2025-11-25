import stylePlayerAudioModule from '../../scss/addSounds/PlayerAudio.module.scss'
import {useRef, useEffect, useState, useCallback, memo} from 'react'
import { Play, Pause, FastForward } from 'lucide-react'

const Player = ({progress, pauseToLeave}) => {
    const progressBarRef = useRef(null)
    const [play, setPlay] = useState(true)
    const audioRef = useRef(null)
    const progressBarBackgroundRef = useRef(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [mouseDown, setMouseDown] = useState(false)
    const [display, setDisplay] = useState(`${stylePlayerAudioModule.playerAudiodisplayHidden}`)
    const [durationInProgress, setDurationInProgress] = useState(0)
    const [changeButtonIcon, setChangeButtonIcon] = useState(<Play />)
    const [durationFromProgreessBar, setDurationFromProgreessBar] = useState(0)

    if(pauseToLeave) {
        audioRef.current.pause()
    }

    const audioBlobData = useCallback(async () => {
        let audioInBytes = await window.api.tempAudioFile('audioTemp')
        const blob = new Blob([audioInBytes], {type: 'audio/wav'})
        const url = URL.createObjectURL(blob)    
        const audio = new Audio(url) 
        audioRef.current = audio
    
    }, [audioRef, display])
    
    const time = useCallback((value) => {
        const minutes = Math.floor(value / 60).toString().padStart(2, '0')
        const seconds = Math.floor(value % 60).toString().padStart(2, '0')
        return `${minutes}:${seconds}`
    }, [display])


    const handleBackward = () => {
        const audio = audioRef.current
        audio.currentTime -= 10
    }
    
    const handleForward = () => {
        const audio = audioRef.current
        audio.currentTime += 10
    }
    
    const handlePlayPause = () => {
        const audio = audioRef.current
        if(play) {
            audio.play()
            setChangeButtonIcon(<Pause />)
            setPlay(false)
        }else if(!play){
            audio.pause()
            setChangeButtonIcon(<Play />)
            setPlay(true)
        }
    }
    
    const updateValue = useCallback((event) => {
        const audio = audioRef.current
        const progressBar = progressBarRef.current;
        const maxWidthX = progressBar.getBoundingClientRect().width
        const offsetX = (event.clientX - progressBar.getBoundingClientRect().left)
        const limitedX = Math.floor(Math.max(0, Math.min(offsetX, maxWidthX)))
        const porcentage = Math.round((limitedX / maxWidthX) * 100)
        
        const controlCurrentTime = Math.floor(( porcentage/ 100) * audio.duration) 
        
        if(mouseDown) {
            audio.currentTime = controlCurrentTime
        }
    }, [audioRef, handlePlayPause, audioBlobData])

    useEffect(() =>{
        
        if(progress >= 100) {
            audioBlobData().then(() => {
                setDisplay(`${stylePlayerAudioModule.playerAudiodisplayShow}`)
            })
            
        }
        return ()=> {
            // Limpar a URL do Blob para evitar vazamento de memória
            if (audioRef.current) {
                URL.revokeObjectURL(audioRef.current.src)
            }
        }
    }, [progress])
    
    useEffect(() => {
        const audio = audioRef.current
        
        if(!audio) return


        const handleTimeUpdate = () => {
            const progressTime = audio.currentTime
            const durationPorcentage = Math.round((progressTime/ audio.duration) * 100)

            progressBarBackgroundRef.current.style.setProperty('--progress-bar', `${durationPorcentage}%`)
            setCurrentTime(time(progressTime))
            setDurationInProgress(durationPorcentage)
        } 

        const handleAudioDuration = () => {
            setCurrentTime(time(audio.currentTime))
            setDurationFromProgreessBar(time(audio.duration))
        }
        
        const handleEndAudio = () => {
            setChangeButtonIcon(<Play/>)
            setPlay(true)
            audioRef.current.currentTime = 0
        }
        // if(audio) {
            audio.addEventListener('timeupdate', handleTimeUpdate)
            audio.addEventListener('loadedmetadata', handleAudioDuration)
            audio.addEventListener('ended', handleEndAudio)
        // }
        return () => {
            // if(audio){
                audio.removeEventListener('timeupdate', handleTimeUpdate)
                audio.removeEventListener('loadedmetadata', handleAudioDuration)
                audio.removeEventListener('ended', handleEndAudio)
            // }
        }
    },[display, time]) 

    
    
    return (
        <>
            <div className={stylePlayerAudioModule.boxFather}>
                <div  className={`${stylePlayerAudioModule.boxPlayer} ${display}`}>      
                    <div className={stylePlayerAudioModule.boxBar} onMouseDown={() => {setMouseDown(true)}} ref={progressBarRef}>
                        <input type="range" 
                        ref={progressBarBackgroundRef}
                        className={stylePlayerAudioModule.progressBar}  
                        min={0}
                        max={100} 
                        value={durationInProgress} 
                        onChange={() => {setMouseDown(true)}}
                        onMouseUp={() => {setMouseDown(false)}}
                        onMouseMove={updateValue}
                        />
                    </div>
                    <div className={stylePlayerAudioModule.time}>
                        <i className={stylePlayerAudioModule.currentTime}>{currentTime}</i>
                        <i className={stylePlayerAudioModule.totalTime}>{durationFromProgreessBar}</i>
                    </div>
                    <div className={stylePlayerAudioModule.boxButton}>
                        <button className={stylePlayerAudioModule.backButton} onClick={handleBackward}>
                            <FastForward strokeWidth={3.3} size={30} style={{rotate: '180deg'}}/>
                        </button>
                        <button className={stylePlayerAudioModule.playAndPauseButton} onClick={handlePlayPause}>
                            {changeButtonIcon}
                        </button>
                        <button className={stylePlayerAudioModule.forwardButton} onClick={handleForward}>
                            <FastForward strokeWidth={3.3} size={30} />
                        </button>
                    </div> 
                </div>
            </div>
        </>
    )
}

export default memo(Player)