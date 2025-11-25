import { useContext, useEffect, useRef, useState } from 'react'
import ImageEdit from '../components/editorMode/ImageEditor'
import WaveEdit from '../components/editorMode/WaveEditor'
import ButtonEdit from '../components/editorMode/ButtonEditor'
import { ButtonContext, EditorProvider } from '../context/Context'

const Editor = () => {
    const {idValue, editableState} = useContext(ButtonContext)
    const audioRef = useRef(null)
    const buttonEditRef = useRef(null)
    const trashButtonRef = useRef(null)
    const undoButtonRef = useRef(null)
    const applyButton = useRef(null)
    const [audioDurationValue, setAudioDurationValue] = useState(0)
    
    const getDuration = () => {
        setAudioDurationValue(audioRef.current.duration)
    }

    useEffect(()=> {
        const audioFile = async () => {
            let audioBytes = null
            if(editableState) {
                const file = await window.api.selectFilesFromDB('fromDB', 'video_file', idValue)
                audioBytes = file[0].video_file
                // console.log('file')
            }else {
                audioBytes = await window.api.tempAudioFile('audioTemp')
            }
            const blob = new Blob([audioBytes], {type: 'audio/wav'})
            const url = URL.createObjectURL(blob)
            const audio = new Audio(url)
            audioRef.current = audio
            
             
            audioRef.current.addEventListener('loadedmetadata', getDuration)
            return () => {
                audioRef.current.removeEventListener('loadedmetadata', getDuration)
            }
            
        }
        audioFile()
        
        
    }, [audioRef])

    return (
        <EditorProvider>
            <div style={{ position: 'relative', top: '30px'}}>
                <ImageEdit />
                
                <ButtonEdit 
                audio={audioRef} 
                ref={buttonEditRef} 
                trashButtonRef={trashButtonRef}
                undoButtonRef={undoButtonRef}
                applyButton={applyButton}/>
                
                <WaveEdit 
                audioDuration={audioDurationValue} 
                audio={audioRef} 
                buttonEditRef={buttonEditRef} 
                trashButtonRef={trashButtonRef}
                undoButtonRef={undoButtonRef}
                applyButton={applyButton}/>

            </div>
        </EditorProvider>
    )
}


export default Editor