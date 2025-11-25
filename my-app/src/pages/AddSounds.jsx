import {useContext, useState} from "react"
import {Link} from 'react-router-dom'
import styleAddSoundsModule from "../scss/addSounds/AddSounds.module.scss"
import ImageLayer from "../components/addSounds/ImageLayer"
import Loader from "../components/addSounds/Loader"
import Player from "../components/addSounds/playerAudio"
import ProgressEffect from '../components/Progress'
import { LogIn } from 'lucide-react'
import { editorContext } from "../context/Context"

function AddSounds() {
    const {setClosePage} = useContext(editorContext)
    const [imagePath, setImagePath] = useState(null)
    const [pauseToLeave, setPauseToLeave] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [inputProgress, setInputProgress] = useState(0)
    const [applyButton, setApplyButton] = useState(false)
    const [title, setTitle] = useState('Add Audio')
    const [titleSize, setTitleSize] = useState(`${styleAddSoundsModule.maxFontSize}`)
    const [statusButton, setStatusButton] = useState(false)


    const tempFile = async () => {
        const file = await window.api.getJsonFile('toReact')
        if(file.ERRO) {
            window.api.removeFile('removeTemp', true)
           alert('ERRO: Essa URL não pode ser usada')
        }else {
            setImagePath(file.thumbnail)
            setTitle(file.title)
            
            if(file.title.length >= 20) {
                setTitleSize(`${styleAddSoundsModule.minFontSize}`)
            }
        }
        
    }

    const counter = () => {
        for(let i = 0; i <= 100; i++) {
            setTimeout(() => {
                setInputProgress(i)
                if(i >= 100) {
                    setApplyButton(true)
                    tempFile()
                   
                }
            }, i* 70);
        }
    }

    const handleChange = (event) => {        
        setInputValue(event.target.value)

    }
    
    const handleButtonApply = () => {
        if(applyButton) {
            return `${styleAddSoundsModule.displayOn}` 
        }else {
            return `${styleAddSoundsModule.displayOff}`
        }
    }

    const handleButtonSend = () => {
        if(applyButton) {
            return `${styleAddSoundsModule.displayOff}`
        }else {
            return `${styleAddSoundsModule.displayOn}`
        }
    }
    

    const handleClick = async () => {
        if(inputValue === '') {
            alert('url space is empty')

        }else if(inputValue.includes('www.youtube.com') || inputValue.includes('youtube.com')){
            await window.api.startDownload('toMain', inputValue)
            await counter()
        }
    }

    const handleRemoveFile = async (status) => {
        await window.api.removeFile('removeTemp', status)
    }

    const displaySpecial = () => {
        return handleButtonApply() === `${styleAddSoundsModule.displayOn}` ? `${styleAddSoundsModule.displayFlex}` : `${styleAddSoundsModule.displayOff}`
    }

    const handleReturnPage = () => {
        setPauseToLeave(true)
        handleRemoveFile(false)
    }

    const handleAppliedButton = async () => {
        setStatusButton(true); 
        await window.api.forDataBase('dataBase')
        await setPauseToLeave(true)
    }

    return ( 
        <>
            <header > 
                <Link to='/' className={displaySpecial()}>
                    <h1 className={styleAddSoundsModule.returnPage}
                    onClick={handleReturnPage}>
                        <LogIn style={{ rotate: '180deg'}} strokeWidth={3.5}/>
                        voltar</h1>
                </Link>
                <Link to='/editorMode'>
                    <h1 className={`${styleAddSoundsModule.editorPage} ${displaySpecial()}`} 
                    onClick={() => setPauseToLeave(true)}
                    >
                        editar
                        <LogIn  strokeWidth={3.5}/>
                        </h1>
                </Link>
                
                <div className={styleAddSoundsModule.boxHeader}>
                    <h1 className={`${styleAddSoundsModule.addTitle} ${titleSize}`} >{title}</h1>
                </div>
            </header>
            <ImageLayer imagePath={imagePath}/>
            <Loader width={inputProgress}/>
            
            {statusButton ? <ProgressEffect /> : ''}
            
            <Player progress={inputProgress} pauseToLeave={pauseToLeave}/>
            <div className={styleAddSoundsModule.itens}>
                
                <input 
                type="text" 
                className={`${styleAddSoundsModule.inputText} ${handleButtonSend()}`} 
                placeholder="Cole a Url aqui" 
                onChange={handleChange}/>
                
                <div className={styleAddSoundsModule.buttonPlace}>
                
                    <Link to='/' style={{textDecoration: 'none'}} >
                        <button className={`${styleAddSoundsModule.editar} ${handleButtonSend()}`}
                        onClick={() => setClosePage(true)}
                        >voltar</button>
                    </Link>
                    <button className={`${styleAddSoundsModule.editar} ${handleButtonApply()}`}
                    onClick={() => {handleRemoveFile(true)}}  >cancelar</button>
                    <button className={`${styleAddSoundsModule.enviar} ${handleButtonSend()}`} onClick={handleClick}>enviar</button>
                    <button className={`${styleAddSoundsModule.enviar} ${handleButtonApply()}`}
                    onClick={handleAppliedButton}>aplicar</button>
                </div>
            </div>

        </>
    ) 
}
// export default add
export default AddSounds