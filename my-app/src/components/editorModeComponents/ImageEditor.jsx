import image from '../../icon/videoframe_80712.png'
import '../../scss/editorModeComponentsScss/imageEditor.scss'

const ImageEdit = () => {
    return (
        <header>
            <div className="image-box">
                <div className="send-image-box">
                    <input type="file" id="file-upload" />
                </div>
                <img id='image-prev' src={image} alt="" />
            </div>
        </header>
    )
}

export default ImageEdit