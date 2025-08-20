import React from 'react'
import ImageEdit from '../components/editorModeComponents/ImageEditor'
import WaveEdit from '../components/editorModeComponents/WaveEditor'
import ButtonEdit from '../components/editorModeComponents/ButtonEditor'

const Editor = () => {
    return (
        <>
            <ImageEdit />
            <WaveEdit />
            <ButtonEdit/>
        </>
        
    )
}


export default Editor