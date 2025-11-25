import styleButtonEditor from '../../scss/editorMode/buttonEditor.module.scss'
import { Link } from 'react-router-dom'
import { Check, LogIn, Trash2, Scissors, Undo2, Play, Pause, FastForward } from 'lucide-react'
import { forwardRef, memo, useContext, useEffect, useState } from 'react'
import ProgressEffect from '../Progress'
import { editorContext } from '../../context/Context'

const ButtonEdit = forwardRef((props, ref) => {
    const {playAudio, setPlayAudio, setClosePage} = useContext(editorContext)
    const [clickApplyButton, setClickApplyButton] = useState(false)
    
    const audioEl = props.audio.current;
    
    useEffect(()=>{
        
        const finishAudio = () => {
            setPlayAudio(true)
            audioEl.currentTime = 0
        }

        if (audioEl) {
            audioEl.addEventListener('ended', finishAudio);
        }

        return () => {
            if (audioEl) {
                audioEl.removeEventListener('ended', finishAudio);
            }
        };
    }, [audioEl])
    
    const playerAudio = () => {
        const songControl = props.audio.current
        setPlayAudio(play => !play )
        playAudio ? songControl.play() : songControl.pause()
        
    }
    
    const changeButtonPlayer = () => {
        return playAudio ? <Play /> : <Pause />
    }

    const handleBackward = () => {
        props.audio.current.currentTime -= 10
    }
    
    const handleForward = () => {
        props.audio.current.currentTime += 10
    }

    const handleApplyButton = () => {
        audioEl.pause()
        setClickApplyButton(status => !status)
    }
   
    const handleReturnButton = () => {
        window.api.removeFile('removeTemp', false)
        setClosePage(true)
    }

    const handleApply = () => { 
        if(clickApplyButton) {
            return <ProgressEffect/>
        }
    }

    return (
        <>
        { handleApply()}
        <div id={styleButtonEditor.configButtons}>
            <Link to='/' id={styleButtonEditor.returnButton} style={{textDecoration: 'none'}} onClick={handleReturnButton}>
                <LogIn className={styleButtonEditor.applyConfigImg} style={{rotate: '180deg'}} strokeWidth={3.7}/>
                <h1 className={styleButtonEditor.applyConfigText} >voltar</h1>
            </Link>
                
            <button id={styleButtonEditor.applyConfig} ref={props.applyButton} onClick={ handleApplyButton}>
                <Check className={styleButtonEditor.applyConfigImg}/>
               <h1 className={styleButtonEditor.applyConfigText}>aplicar</h1> 
            </button>
        </div>
        <div className={styleButtonEditor.boxButtonVerticalEdit}>
            <button id={styleButtonEditor.trashButton} ref={props.trashButtonRef}>
                <Trash2 size={18}/>
            </button>
            <button 
            id={styleButtonEditor.scissorsButton} ref={ref} >
                <Scissors size={18}/>
            </button>
            <button id={styleButtonEditor.undoButton} ref={props.undoButtonRef}>
                <Undo2 size={18}/>
            </button>
        
        </div>
        <main id={styleButtonEditor.main} className={styleButtonEditor.display}>
            <div className={styleButtonEditor.boxButtonHorizontalEdit}>
                <button id={styleButtonEditor.backwardButton} onClick={handleBackward}>
                    <FastForward />
                </button>
                <button id={styleButtonEditor.playAndPauseButton} onClick={playerAudio}>
                    {changeButtonPlayer()}
                </button>
                <button id={styleButtonEditor.forwardButton} onClick={handleForward}>
                    <FastForward />
                </button>
            </div>
        </main>
    </>
    )
})

export default memo(ButtonEdit)