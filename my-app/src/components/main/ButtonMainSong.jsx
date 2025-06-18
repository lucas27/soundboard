import {CirclePlay, VolumeOff, Volume2, Volume1, VolumeX, Pencil} from 'lucide-react'
import styleMainSongButtonModule from '../../scss/main/buttonMainSong.module.scss'
import { useContext, useEffect, useReducer, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ButtonContext } from '../../context/Context'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const reducer = (state, action) => {
    switch (action.type) {
        case 'showVolume':
            return {...state, visibleVolume: action.visibleNewVolume}
        case 'showNewIcon':
            return {...state, changeIcon: !state.changeIcon}
        case 'showNewVolumeIcon':
            return {...state, changeVolumeIcon: action.newChangeVolumeIcon}
        case 'changeState':
            return {...state, changeStatusButtonPlay: !state.changeStatusButtonPlay}
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
export const SongButton = ({id, thumbnail, title }) => {
    const volumeRef = useRef(null)
    const {configButtonState, setConfigButtonState, setEditButtonState, setIdValue, setEditableState, pauseToLeave, setPauseToLeave} = useContext(ButtonContext)
    const [cacheSearch, setCacheSearch] = useState(false)
    const [currentAudio, setCurrentAudio] = useState(null)
    const [volumeValue, setVolumeValue] = useState(0.5)
    const [changeCursor, setChangeCursor] = useState('grab')
    const [state, dispatch] = useReducer(reducer, {
        visibleVolume: false,
        changeIcon: false,
        changeVolumeIcon: <Volume2 />,
        changeStatusButtonPlay: false,
    })
    
    
    const {data: audioData} = useQuery({
        queryKey: ['audio', id],
        queryFn: () => reqAudioFile(id),
        enabled: cacheSearch,
        // gcTime: 1000 * 30,
        staleTime: 60 * 1000,
    })

    
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
        window.api.virtualCableDevice('changeDevice')
        const audio = new Audio(audioData)
        audio.volume = volumeValue

        if(currentAudio) {
            currentAudio.pause()
        }

        audio.onended = () => {
            setCurrentAudio(null)
            window.api.MainDevice('MainDevice')
        }

        setCurrentAudio(audio)
        audio.play()
    }

    const handleEditButton = () => {
        setIdValue(id)
        setEditButtonState(true)
        setEditableState(true)
    }

    const handleCacheAudio = (state) => {
        if(!configButtonState) {
            setCacheSearch(state)
        }
        
    }

    useEffect(() => {
        if(volumeRef.current) {
            const onchange = {target: { value: state.changeIcon ? 0 : volumeRef.current.value }}
            
            handleVolumeBar(onchange)            
        }
    
    },[state.changeIcon])

    const { attributes, listeners, setNodeRef, transform } = useSortable({ id })

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : {}

    if(pauseToLeave) {
        try {
            currentAudio.pause()
            setPauseToLeave(false)
            window.api.MainDevice('MainDevice')
        }catch{}
    }


    return (
        <div id={styleMainSongButtonModule.firstBox} 
        ref={setNodeRef}
        style={style}
        
        >
            <button
            id={styleMainSongButtonModule.editButton}
            style={{display: `${configButtonState ? 'flex' : 'none'}`}}
            onClick={handleEditButton}
            onMouseUp={() => setConfigButtonState(false)}
            >
                <Pencil id={styleMainSongButtonModule.editIcon} />
            </button>
            <button 
            onMouseDown={()=> {handleCacheAudio(true); setChangeCursor('grabbing')}}
            onMouseUp={() => {handleCacheAudio(false); setChangeCursor('grab')}}
            onMouseOut={() => setChangeCursor('grab')}
            {...configButtonState ? listeners : ''}
            {...attributes}
            style={{
                background: `${state.changeStatusButtonPlay ? '#80e0a5' : ''}`, 
                width: `${configButtonState ? '70%' : ''}`, 
                cursor: `${configButtonState ? changeCursor : 'pointer'}` 
            }}
            id={styleMainSongButtonModule.mainButton}>
                
                <div id={styleMainSongButtonModule.mainBox}
                style={{display: `${configButtonState ? 'none' : 'flex'}`}}
                onMouseEnter={() => dispatch({type: 'showVolume', visibleNewVolume: true})}
                onMouseLeave={() => dispatch({type: 'showVolume', visibleNewVolume: false})}
                >
                    <i
                    id={styleMainSongButtonModule.volume}
                    className={state.changeVolumeIcon}
                    onClick={() => dispatch({type: 'showNewIcon'})}
                    >
                        {state.changeVolumeIcon}

                    </i>

                    <input type="range" id={styleMainSongButtonModule.volumeRange}
                    ref={volumeRef}
                    style={{display: `${state.visibleVolume ? 'initial' : 'none'}`}}
                    min={0}
                    max={100}
                    onChange={handleVolumeBar}
                    />
                </div>

                <img src={thumbnail} id={styleMainSongButtonModule.thumbnail} alt="" />
                
                <CirclePlay 
                size={60}
                strokeWidth={1.4}
                id={styleMainSongButtonModule.playHoverButton}
                style={{display: `${configButtonState ? 'none' : state.visibleVolume ? 'none' : 'initial'}`}}
                onMouseDown={() => dispatch({type: 'changeState'})} 
                onMouseUp={() => dispatch({type: 'changeState'})}
                onMouseOut={() => state.changeStatusButtonPlay ? dispatch({type: 'changeState'}) : null}
                onClick={handleButtonPlay} />
                
                <textarea 
                id={styleMainSongButtonModule.mainTitle} 
                defaultValue={title.slice(0, 12)}
                style={{cursor: 'pointer'}} 
                // maxLength={11}
                disabled
                spellCheck="false"
                ></textarea>
            </button>
        </div>
    )
}