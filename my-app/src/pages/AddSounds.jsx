import React, {useState} from "react"
import "../scss/addSoundsComponentsScss/Add_Sounds.scss"
import ImageLayer from "../components/addSoundsComponents/ImageLayer"
import Loader from "../components/addSoundsComponents/Loader"
import Player from "../components/addSoundsComponents/playerAudio"


function AddSounds() {
    const [imagePath, setImagePath] = useState("/styles/images/sound-wave-angle-text-rectangle.png")

    const [inputValue, setInputValue] = useState('')

    const [inputProgress, setInputProgress] = useState(0)
    const [applyButton, setApplyButton] = useState(false)

    const [title, setTitle] = useState('Add Audio')

    const handleChange = (event) => {        
        setInputValue(event.target.value)

    }
    
    const handleButtonApply = () => {
        if(applyButton) {
            return 'displayOn'
        }else {
            return 'displayOff'
        }
    }

    const handleButtonSend = () => {
        if(applyButton) {
            return 'displayOff'
        }else {
            return 'displayOn'
        }
    }
    
    const handleClick = async () => {
        try{
            await window.api.receive('download-progress', (progressData)=> {
                setInputProgress(progressData)
                if(progressData >= 100) {
                    setApplyButton(true)
                }
            })
            await window.api.startDownload('toMain', inputValue)
            const thumbnail = await window.api.getThumbnailUrl('toReact', inputValue)
            setImagePath(thumbnail)
        } catch (err) {
            alert('url space is empty')
        }
        setInputValue('')
    }

    return (
        <>
            <header>
                <h1 className="returnPage">voltar</h1>
                <h1 className="addTitle">{title}</h1>
            </header>
            <ImageLayer imagePath={imagePath}/>
            <Loader width={inputProgress}/>
            <Player progress={inputProgress}/>
            <div className="itens">
                <input type="text" class='input-text' placeholder="Cole a Url aqui" value={inputValue} onChange={handleChange}/>
                <div class='button_place'>
                    <button class='editar'>editar</button>
                    <button class={`enviar ${handleButtonSend()}`} onClick={handleClick}>enviar</button>
                    <button className={`enviar ${handleButtonApply()}`}>aplicar</button>
                </div>
            </div>
        </>
    ) 
}
// export default add
export default AddSounds