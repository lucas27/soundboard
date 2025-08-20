import {useState, useEffect, useRef} from 'react'
import image from '../../icon/Spectrogram.png'
import '../../scss/editorModeComponentsScss/waveEditor.scss'
import image2 from '../../icon/Spectrogram2.PNG'



const WaveEdit = () => {
    const sliderBarRef = useRef(null)
    const [progressBar,setProgressBar] = useState(0)
    const timeArray = [0, 30, 60, 90, 120, 150, 180, 222]
    // const [timeValueBar, settimeValueBar] = useState([])
    
    useEffect(() => {
        const movementBar = (event) => {
            
            const maxWidth = Math.round(sliderBarRef.current.getBoundingClientRect().width)
            const maxMovement = sliderBarRef.current.getBoundingClientRect().left
            const sliderValue = (event.clientX - maxMovement)
            const percentage = Math.floor(Math.min((sliderValue / maxWidth), 0.98)* 100)
           
            const limite = Math.floor(Math.max(0, percentage))
     
            setProgressBar(limite)
            console.log(progressBar,limite, maxWidth, maxMovement)
        }

        document.addEventListener('mousemove',movementBar)

        return () => {
            document.removeEventListener('mousemove',movementBar)
        }
    }, [progressBar])


    const timeValueBar = timeArray.map(element => {
        const minutes = Math.floor(element / 60).toString().padStart(2, '0')
        const seconds = Math.floor(element % 60).toString().padStart(2, '0')
        // const seconds = element.toString().padStart(2, '0')        
        // const minutes = () => {
        //     return (element > 60) ? Math.floor(element/60).toString().padStart(2, '0') +':' : '00:'
        // }
        return <h1 className='elements-timeBar'>{minutes + ':'+seconds}</h1>
    });
    
    return (
        <main>
            <div className='box-audioWave'>
                {/* <input type="range" id="" /> */}
                <div id='point-control-wave' style={{left:`${progressBar}%`}}>
                    {/* <h1>00:00</h1> */}
                </div>
                <div ref={sliderBarRef} className='box-from-image-wave'>
                    {/* <img id='image-wave' src={image2} alt=""/>
                    <img id='image-wave' src={image2} alt=""/> */}
                    <img id='image-wave' src={image} alt=""/>
                </div>
                <div id='box-time-audioWav'>{timeValueBar}</div>
            </div>

        </main>
    )
}

export default WaveEdit