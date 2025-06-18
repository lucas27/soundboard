import {memo, useContext, useEffect, useState } from 'react'
import styleImageEditor from '../../scss/editorMode/imageEditor.module.scss'
import { ButtonContext } from '../../context/Context';

const ImageEdit = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [thumb, setThumb] = useState(null);
    const [changeImage, setChangeImage] = useState(false)

    const {idValue, editableState} = useContext(ButtonContext)

    const getTempFile = async (data, type) => {
        await window.api.getNewImage('newImage', await data, type)    
    }

    const imageTempFile = async () => {
        if(editableState) {
            const file = await window.api.selectFilesFromDB('fromDB', 'thumbnail_link, thumbnail_file', idValue)

            const thumbnailLink = file[0].thumbnail_link
            if(thumbnailLink === '0'){
                const bytesFile = new Blob([file[0].thumbnail_file], {type: 'image/webm'})
                const url = URL.createObjectURL(bytesFile)
                file[0].thumbnail_link = url   
            }            
            setThumb(file[0].thumbnail_link)
            
        }else {
            const file = await window.api.getJsonFile('toReact', './data/temp.json')
            setThumb(file.thumbnail)
        }
    }
   
    useEffect(()=> {
        if(!changeImage){
            imageTempFile()
        }

    }, [changeImage])
   
   const handleDrop = (event) => {
        
       // event.preventDefault();
       setIsHovered(false)
       const file = event.target.files[0]
       const type = file.type
       const formats = ['image/jpeg', 'image/png', 'image/jpg']
       if(!formats.includes(type)) {
           console.log('Formato de arquivo inválido.')
        }else {
            
            const imageUrl = URL.createObjectURL(file)
            setChangeImage(true)
            setThumb(imageUrl)
            
            const arrayBuffer = file.arrayBuffer()
            getTempFile(arrayBuffer, type)
        }
    } 
    
    return (
        <header className={styleImageEditor.editorHeader}>
            <div className={styleImageEditor.imageBox}>
                <label  htmlFor="file" className={styleImageEditor.fileInput}
                style={{background: isHovered ? '#333333' : ''}}
                onDragEnter={() => setIsHovered(true)}
                onDragLeave={() => setIsHovered(false)}
                >
                    <div className={styleImageEditor.dropZone}>
                        <p><b>Selecione uma imagem</b> ou solte aqui.</p>
                    </div>
                    <input type="file" id={styleImageEditor.file} onChange={handleDrop} />
                </label>
                <img id={styleImageEditor.imagePrev} src={thumb} alt="" />
            </div>
        </header>
    )
}

export default memo(ImageEdit)