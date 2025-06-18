import {memo, useCallback, useContext, useEffect, useRef} from "react";
import { ButtonContext } from "../../context/Context";

const WaveForm = ({ startValue, finalValue, width, style, clickButton, className }) => {
   const canvasRef = useRef(null)
   const {idValue, editableState} = useContext(ButtonContext)

   
   const waveFormCanvas = useCallback(async (startValue, finalValue, currentWidth) => {
       if(editableState) {
           const audioFile = await window.api.selectFilesFromDB('fromDB', 'video_file', idValue)
           window.api.createAudioFile('createAudio', audioFile[0].video_file)
       }
       
       const bufferWaveForm = await window.api.waveForm('createWaveForm', startValue, finalValue) 
       const blobWaveForm = new Blob([bufferWaveForm])
       const imageUrl = URL.createObjectURL(blobWaveForm)

       const canvas = canvasRef.current
       const ctx = canvas.getContext('2d')
       const image = new Image()
       
       image.src = imageUrl
       
       image.onload = () => {
           
           canvas.width = image.width;
           canvas.height = image.height;

           
           canvas.style.width = `${currentWidth}%`
           // canvas.style.marginLeft = `${100 - currentWidth}%`
           // console.log(canvas.style.marginLeft)

           ctx.clearRect(0, 0, canvas.width, canvas.height);
           // Desenha a imagem completa no canvas, ajustando ao tamanho do canvas
           
           // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
           ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
           // console.log(porcentage)
           // Importante: Libere a URL de objeto para evitar vazamentos de memória
           URL.revokeObjectURL(imageUrl);
           
       }
   }, [startValue, finalValue])

    useEffect(() => {
        
        waveFormCanvas(startValue, finalValue, width)
    }, [startValue, finalValue])
   
    return (
        <canvas ref={canvasRef}
            // style={{marginLeft: `${100 - props.width}%`}} 
            style={{left: `${style}%`}}
            onClick={clickButton}
            className={className}>
        </canvas>
    ) 
}

export default memo(WaveForm)