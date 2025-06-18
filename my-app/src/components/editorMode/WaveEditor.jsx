import { useState, useEffect, useRef, useMemo, useContext, useCallback, memo } from 'react'
import styleWaveEditor from '../../scss/editorMode/waveEditor.module.scss'
import WaveForm from './WaveFormEditor'
import { ButtonContext } from '../../context/Context'


const WaveEdit = (props) => {
    const {editableState, idValue} = useContext(ButtonContext)
    const mainContainerRef = useRef(null)
    const [progress, setProgress] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [colorBorderImage, setColorBorderImage] = useState(null)
    const [cutTimes, setCutTimes] = useState([0])
    const [catchValueId, setCatchValueId] = useState(0)
    const [effectiveDuration, setEffectiveDuration] = useState(0)
    const [maxWidthMove, setMaxWidthMove] = useState(99)
    const [minWidthMove, setMinWidthMove] = useState(0)
    const [audioSegments, setAudioSegments] = useState([])
    const [removedSegmentIds, setRemovedSegmentIds] = useState([])

    // Atualiza a duração efetiva quando o áudio original é carregado/alterado
    useEffect(() => {
        setEffectiveDuration(props.audioDuration)
        
    }, [props.audioDuration])
    
    // useEffect para calcular o timeArray com base na duração do áudio
    const timeArray = useCallback(() => {
        if (effectiveDuration <= 0) return []
        const numberOfColumns = 8
        const step = effectiveDuration / (numberOfColumns - 1)
        const newTimeArray = []
        for (let i = 0; i < numberOfColumns; i++) {
            newTimeArray.push(Math.floor(i * step))
        }
        return newTimeArray
        
    }, [effectiveDuration])

    const handleMouseDown = useCallback(() => {
        setIsDragging(true)
    }, [])

    const handleMouseUp = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleMouseMove = useCallback((event) => {
        if (isDragging) {
            const containerRect = mainContainerRef.current.getBoundingClientRect()
            // A largura total do conteúdo
            const totalWidth = mainContainerRef.current.scrollWidth
            const mouseX = event.clientX
            
            // Calcula o progresso com base na largura total
            const newProgress = ((mouseX - containerRect.left) / totalWidth) * 100
            
            const clampedProgress = Math.max(minWidthMove, Math.min(maxWidthMove, newProgress))
            setProgress(clampedProgress)
            
            
            // O áudio é atualizado aqui para manter a sincronia em tempo real
            if (props.audio.current && effectiveDuration > 0) {
                const newTime = (clampedProgress / 100) * effectiveDuration
                props.audio.current.currentTime = newTime
            }
            
        }
    }, [isDragging, setProgress, minWidthMove, maxWidthMove, props.audio, effectiveDuration])

    
    const timeValueBar =useMemo(() => timeArray().map((element, index) => {
        const minutes = Math.floor(element / 60).toString().padStart(2, '0')
        const seconds = Math.floor(element % 60).toString().padStart(2, '0')

        return <h1 className={styleWaveEditor.elementsTimeBar} key={index}>{minutes + ':' + seconds}</h1>
    }), [effectiveDuration])

    const selectImage = useCallback((itemId) => {
        setColorBorderImage(prevId => prevId === itemId ? null : itemId)        
        setCatchValueId(itemId)
        
    }, [])

    
    const handleCutButton = useCallback(() => {
        const currentTime = props.audio.current.currentTime
        setCutTimes(prevCutTimes => [...prevCutTimes, currentTime ])
         
    }, [props.audio])


    const handleTrashButton = useCallback(() => {
        // Encontre o segmento completo a ser removido
        const segmentToRemove = audioSegments.find(item => item.id === catchValueId)
        // console.log(segmentToRemove)
        const segment = audioSegments.find(item => item.id !== catchValueId)
        if(segmentToRemove) {
            
            // Adiciona o segmento completo ao histórico de remoções
            setRemovedSegmentIds(prevHistory => [...prevHistory, segmentToRemove.id])
            

            const minPorcentage = (segment.startValue / effectiveDuration) * 100
            const maxPorcentage = (segment.finalValue / effectiveDuration) * 100
            
            // console.log(segmentToRemove.startValue, maxPorcentage, effectiveDuration / 2)
            // if ((segmentToRemove.startValue >= (effectiveDuration / 2)) || segmentToRemove.startValue) {
            // console.log(maxWidthMove, minWidthMove, minPorcentage, maxPorcentage)
            if( maxPorcentage >= 50) {
                // console.log('maximo')
                setMaxWidthMove(maxPorcentage);
                setMinWidthMove(minPorcentage);
            } else if(minPorcentage < 30) {
                // console.log('minimo')
                setMaxWidthMove(maxPorcentage);
                setMinWidthMove(minPorcentage);
            // else if(segmentToRemove.finalValue <= (effectiveDuration / 2)){
            }
            
        }
        
    }, [audioSegments, catchValueId, effectiveDuration, setRemovedSegmentIds, setMaxWidthMove, setMinWidthMove, minWidthMove, maxWidthMove])


    const handleUndoButton = useCallback(() => {

        // Pega o último ID removido do histórico
        const lastRemovedId = removedSegmentIds[removedSegmentIds.length - 1]
        // Verifica se há algo para desfazer
        if (lastRemovedId) {
            
            // console.log(lastRemovedId, minWidthMove, maxWidthMove, removedSegmentIds)
            // Adiciona o segmento de volta à lista de segmentos de áudio
            setAudioSegments(prevSegments => [...prevSegments, lastRemovedId].sort((a, b) => a.startValue - b.startValue))

            // Remove o segmento restaurado do histórico
            setRemovedSegmentIds(prevHistory => prevHistory.slice(0, -1))
            
            // Resetar o estado de seleção
            setCatchValueId(0)

            // const minValue = Math.round((parseInt(lastRemovedId.split('-')[0]) / effectiveDuration) * 100)
            // const maxValue = Math.round((parseInt(lastRemovedId.split('-')[1]) / effectiveDuration) * 100)
            
            // console.log(minWidthMove, maxWidthMove, minValue , maxValue, effectiveDuration, catchValueId)
            setCutTimes([0])
            setRemovedSegmentIds([])
            setMinWidthMove(0)
            setMaxWidthMove(99)
            // if(catchValueId <= 0) {
                // setCutTimes([0])
                // setRemovedSegmentIds([])
                // setMinWidthMove(0)
                // setMaxWidthMove(99)
            // } else if(minValue <= minWidthMove) {
            //     setMinWidthMove(minValue)
                
            // } else if(maxValue <= 99) {
            //     setMaxWidthMove(maxValue)
            // }      
            
        }
    }, [removedSegmentIds, setAudioSegments, setRemovedSegmentIds, setCutTimes, setMinWidthMove, setMaxWidthMove])

    const handleApplyButton = useCallback(() => {
        const startTimeSong = (minWidthMove / 100) * effectiveDuration 
        const endTimeSong = (maxWidthMove / 100) * effectiveDuration
        // console.log(editableState)
        if(editableState) {
            window.api.forDataBase('dataBase', startTimeSong, endTimeSong, idValue)
        }else {
            window.api.forDataBase('dataBase', startTimeSong, endTimeSong)
        }
    }, [minWidthMove, maxWidthMove, effectiveDuration, editableState, idValue])

    
    useMemo(()=> {
        const segments = []
        const allCutTimes = [...cutTimes, effectiveDuration].sort((a,b) => a-b)
        // console.log(allCutTimes)
        for (let i = 0; i < allCutTimes.length - 1; i++) {
            const start = allCutTimes[i]
            const end = allCutTimes[i + 1]
            
            
            const segmentDuration = end - start
            // const segmentWidthPercentage = Math.round((segmentDuration / Math.round(effectiveDuration)) * 100)
            const segmentWidthPercentage = (segmentDuration / effectiveDuration) * 100
        //    console.log(segmentWidthPercentage)
            if (end > start) {
                segments.push({
                    id: `${start}-${end}`, // ID único baseado nos tempos
                    startValue: start,
                    finalValue: end,
                    width: segmentWidthPercentage
                });
            }
        }
        
        setAudioSegments(segments.filter(item => !removedSegmentIds.includes(item.id)))
        
        
    }, [cutTimes, effectiveDuration, removedSegmentIds])

    const updateProgressFromAudio = useCallback(() => {
        if (props.audio.current && effectiveDuration > 0 && !isDragging) {
            const newProgress = Math.min(100,(props.audio.current.currentTime / effectiveDuration) * 100)  
            setProgress(newProgress)        
            
        }
        try {
            // const maxLimitedAudioSegment = audioSegments.find(item => item.id !== catchValueId && item.finalValue > (effectiveDuration/2)).finalValue
            const maxLimitedAudioSegment = (maxWidthMove / 100) * effectiveDuration
            const minLimitedAudioSegment = (minWidthMove / 100) * effectiveDuration 
            // console.log(maxLimitedAudioSegment, props.audio.current.currentTime)
            
            if(props.audio.current.currentTime >= maxLimitedAudioSegment) {
                props.audio.current.pause()
                props.audio.current.currentTime = minLimitedAudioSegment

            }else if(props.audio.current.currentTime <= minLimitedAudioSegment) {
                props.audio.current.currentTime = minLimitedAudioSegment
                
            }

        }catch (err) {
            return err
        }
    }, [props.audio, effectiveDuration])

    // Atualiza a barra de progresso com o tempo atual da música
    // Isso garante que a barra se mova automaticamente se a música estiver tocando
    useEffect(() => {
        
        
        const applyButton = props.applyButton.current
        const undoButton = props.undoButtonRef.current
        const cutButton = props.buttonEditRef.current
        const trashButton = props.trashButtonRef.current
        const audioEl = props.audio.current
        
        if (audioEl) {
            applyButton.addEventListener('click', handleApplyButton)            
            trashButton.addEventListener('click', handleTrashButton)            
            cutButton.addEventListener('click', handleCutButton)
            undoButton.addEventListener('click', handleUndoButton)  
            audioEl.addEventListener('timeupdate', updateProgressFromAudio)
        }
        
        return () => {
            if (audioEl) {
                applyButton.removeEventListener('click', handleApplyButton) 
                cutButton.removeEventListener('click', handleCutButton)
                undoButton.removeEventListener('click', handleUndoButton)
                trashButton.removeEventListener('click', handleTrashButton)
                audioEl.removeEventListener('timeupdate', updateProgressFromAudio)
                }
            }
    }, [
    props.audio, 
    handleApplyButton, 
    handleTrashButton, 
    handleCutButton, 
    handleUndoButton, 
    updateProgressFromAudio // Já está em useCallback
    ])

    // Adiciona e remove os event listeners de 'mousemove' e 'mouseup'
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
        }
    }, [isDragging, maxWidthMove, minWidthMove, catchValueId, audioSegments])  

    const renderAudioSegments = useMemo(() => {
        
        return audioSegments.map((item) => (
            <WaveForm key={item.id} 
            className={`${styleWaveEditor.imageWave} ${ colorBorderImage === item.id ? styleWaveEditor.selectBordercolor : ''}`}  
            clickButton={() => selectImage(item.id)}
            startValue={item.startValue}
            finalValue={item.finalValue}
            width={item.width}
            style={minWidthMove}
            />
        ))
        
    }, [audioSegments, colorBorderImage, selectImage, minWidthMove])
    
    return (
        <footer
        onMouseLeave={handleMouseUp}
        >
            <div className={styleWaveEditor.boxAudioWave} ref={mainContainerRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div id={styleWaveEditor.pointControlWave} style={{ left: `${progress}%`}}></div>
                <div className={styleWaveEditor.boxFromImageWave}
                onMouseLeave={handleMouseUp}
                >
                    { renderAudioSegments }
                </div>
                <div id={styleWaveEditor.boxTimeAudioWav}>{timeValueBar}</div>
            </div>
        </footer>
    )
}

export default memo(WaveEdit)