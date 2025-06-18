import { useContext, useEffect, useReducer, useRef, useState} from "react"
import {Trash2, Check, X, CirclePlay, VolumeOff, Volume2, Volume1, VolumeX} from 'lucide-react'
import styleMainHeaderModule from '../../scss/main/mainHeader.module.scss'
import { useQuery } from "@tanstack/react-query"
import { ButtonContext } from "../../context/Context"

const reducer = (state, action) => {
    switch (action.type) {
        case 'Add': 
            return {...state, addImage: action.addImageLoader, addText: action.addTextLoader}
        case 'showVolume':
            return {...state, visibleVolume: !state.visibleVolume}
        case 'showNewIcon':
            return {...state, changeIcon: !state.changeIcon}
        case 'showNewVolumeIcon':
            return {...state, changeVolumeIcon: action.newChangeVolumeIcon}
        case 'changeState':
            return {...state, changeStatusButtonPlay: !state.changeStatusButtonPlay}
        case 'showButton':
            return {...state, changeShowButton: action.changeNewShowButton}
        default:  
            throw Error
    }
}

const reqAudioFile = async (id) => {
    const file = await window.api.selectFilesFromDB('fromDB', 'video_file', id)
    const bytesFile = new Blob([file[0].video_file], {type: 'audio/ogg'})
    const url = URL.createObjectURL(bytesFile)
    return url
}

const MainHeader = ({id, stateVisibleButton}) => {
    const {setEditButtonState, pauseToLeave, setPauseToLeave} = useContext(ButtonContext)
    const volumeRef = useRef(null)
    const [cacheSearch, setCacheSearch] = useState(false)
    const [currentAudio, setCurrentAudio] = useState(null)
    const [currentTitle, setCurrentTitle] = useState(null)
    const [volumeValue, setVolumeValue] = useState(0.5)
    const [state, dispatch] = useReducer(reducer, {
        addImage: null,
        addText: '',
        visibleVolume: false,
        changeIcon: false,
        changeVolumeIcon: <Volume2 />,
        changeStatusButtonPlay: false,
        changeShowButton: false
    })
    
    
    const {data: audioData} = useQuery({
        queryKey: ['audio', id],
        queryFn: () => reqAudioFile(id),
        enabled: cacheSearch,
        staleTime: 30 * 1000,
    })

    
    const handleDefaultButton = async () => {
        const file = await window.api.selectFilesFromDB('fromDB', 'thumbnail_link, thumbnail_file, video_title', id)
        let videoFile = file[0].thumbnail_link
        const textVideo = file[0].video_title.slice(0, 12)
        if(videoFile === '0'){
            const bytesFile = new Blob([file[0].thumbnail_file], {type: 'image/webm'})
            const url = URL.createObjectURL(bytesFile)
            videoFile = url
        }
        
        dispatch({type: 'Add', addImageLoader: videoFile , addTextLoader:  textVideo})
    
    }

    const handleVolumeBar = (event) => {
        const volume = event.target.value
        volumeRef.current.style.setProperty('--progress-value', `${volume}%`)
        
        if(volume <= 0  && !state.changeIcon){
            dispatch({type: 'showNewVolumeIcon', newChangeVolumeIcon: <VolumeX />})
        }else if(state.changeIcon && volume <= 0){
           dispatch({type: 'showNewVolumeIcon', newChangeVolumeIcon: <VolumeOff />})
        } else if (volume <= 30) {
            dispatch({type: 'showNewVolumeIcon', newChangeVolumeIcon: <Volume1 />})
        } else if(volume > 0 ) {
            dispatch({type: 'showNewVolumeIcon', newChangeVolumeIcon: <Volume2 />})
            if(state.changeIcon) {
                dispatch({type: 'showNewIcon'})
            }
        } 
    
        setVolumeValue(volume / 100)
    }
    
    
    const handleButtonPlay = async () => {
        const audio = new Audio(audioData)
        audio.volume = volumeValue

        if(currentAudio) {
            currentAudio.pause()
        }

        audio.onended = () => {
            setCurrentAudio(null)
        }

        setCurrentAudio(audio)
        audio.play()
    }

    const handleFileFromDB = async () => {
        const file = await window.api.selectFilesFromDB('fromDB', '*', id)
        const title = file[0].video_title
        if(title !== currentTitle && (currentTitle !== '' && currentTitle !== null)) {
            file[0].video_title = currentTitle
            
            // console.log(currentTitle, file[0])

            window.api.deleteFileFromDB('update', id, file[0])
            window.api.resetPage('reset')
            handleDecisionButton()
        }else {
            alert('não houve nenhuma mudança')
        } 

    }

    const handleDecisionButton = () => {
        if(currentAudio) {
            currentAudio.pause() 
            setCurrentAudio(null)
        }
        dispatch({type: 'showButton', changeNewShowButton: false})
        setEditButtonState(false) 
    }

    const handleDeleteButton = () => {
        handleDecisionButton()
        window.api.deleteFileFromDB('update', id, 0) 
        window.api.resetPage('reset')
    }

 
    useEffect(()=> {
        if(stateVisibleButton) {
            handleDefaultButton()
            dispatch({type: 'showButton', changeNewShowButton: true})
        }
    }, [stateVisibleButton])

    useEffect(() => {
        if(volumeRef.current) {
            const onchange = {target: { value: state.changeIcon ? 0 : volumeRef.current.value }}
            
            handleVolumeBar(onchange)            
        }

    },[state.changeIcon])

    if(pauseToLeave) {
        try {
            currentAudio.pause()
            setPauseToLeave(false)
        }catch{}
    }
    // useEffect(() => {
        
        // },[currentAudio])
         
    return (
        <header
        style={{display: `${state.changeShowButton ? 'flex' : 'none'}`}} 
        id={styleMainHeaderModule.mainHeader}>
            <div id={styleMainHeaderModule.decisionBox}>
                <button
                id={styleMainHeaderModule.applyIcon} 
                className={styleMainHeaderModule.decisionButton}
                onClick={handleFileFromDB}
                >
                    <Check id={styleMainHeaderModule.checkDecision} />
                </button>

                <button
                id={styleMainHeaderModule.cancelButton} 
                className={styleMainHeaderModule.decisionButton}>
                    <X 
                    id={styleMainHeaderModule.cancelDecision} 
                    onClick={() => handleDecisionButton()}/>
                </button>
            </div>

            <button 
            onMouseDown={()=> setCacheSearch(true)}
            onMouseUp={() => setCacheSearch(false)} 
            style={{background: `${state.changeStatusButtonPlay ? '#80e0a5' : ''}`}}
            id={styleMainHeaderModule.mainButton}>
                <div id={styleMainHeaderModule.mainBox}
                onMouseEnter={() => dispatch({type: 'showVolume'})}
                onMouseLeave={() => dispatch({type: 'showVolume'})}
                >
                    <i
                    id={styleMainHeaderModule.volume}
                    className={state.changeVolumeIcon}
                    onClick={() => dispatch({type: 'showNewIcon'})}
                    onMouseUp={() => dispatch({type: 'showVolume'})}
                    >
                        {state.changeVolumeIcon}

                    </i>

                    <input type="range" id={styleMainHeaderModule.volumeRange}
                    ref={volumeRef}
                    style={{display: `${state.visibleVolume ? 'initial' : 'none'}`}}
                    min={0}
                    max={100}
                    onChange={handleVolumeBar}
                    />
                </div>

                <img src={state.addImage} id={styleMainHeaderModule.thumbnail} alt="" />
                <CirclePlay 
                size={60}
                strokeWidth={1.4}
                id={styleMainHeaderModule.playHoverButton}
                style={{display: `${state.visibleVolume ? 'none' : 'initial'}`}}
                onMouseDown={() => dispatch({type: 'changeState'})} 
                onMouseUp={() => dispatch({type: 'changeState'})}
                onMouseOut={() => state.changeStatusButtonPlay ? dispatch({type: 'changeState'}) : null}
                onClick={handleButtonPlay} />
                
                <textarea 
                id={styleMainHeaderModule.mainTitle} 
                defaultValue={state.addText} 
                maxLength={18}
                onChange={(event) => setCurrentTitle(event.target.value)}
                spellCheck="false"
                ></textarea>
            </button>
            <button 
            id={styleMainHeaderModule.trashButton}
            onClick={handleDeleteButton}
            >
            
                <Trash2 id={styleMainHeaderModule.trashIcon} />
            </button>
        </header>
    )
}

export default MainHeader