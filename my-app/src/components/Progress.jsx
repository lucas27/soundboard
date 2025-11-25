import { useMemo, useState } from 'react'
import styleProgressBar from '../scss/progress.module.scss'
import { useNavigate } from 'react-router-dom'

const ProgressEffect = () => {
    const [changeValueBar, setChangeValueBar] = useState(0)
    const navegate = useNavigate()

    useMemo(() => {
        for(let i =0; i <= 100; i++) {
            setTimeout(()=> {
                setChangeValueBar(i)
                if(i >= 100) {
                    window.api.removeFile('removeTemp', false)
                    navegate('/')
                }
            }, i *100)    
        }

    }, [])
    
    return (
        <div className={styleProgressBar.progressBar} style={{display: `${(changeValueBar >= 100) ? 'none' : 'flex'}`  }}>
            <div className={styleProgressBar.w3Border} >
                <div className={styleProgressBar.w3} style={{width:`${changeValueBar}%`}}>{changeValueBar}%</div>
            </div>
        </div>
    )
}

export default ProgressEffect