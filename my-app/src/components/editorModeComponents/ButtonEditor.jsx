import '../../scss/editorModeComponentsScss/buttonEditor.scss'

const ButtonEdit = () => {
    return (
    <>
        <div className='box-button-vertical-edit'>
            <button id='cut'>cut</button>
            <button id='redo'>redo</button>
            <button id='undo'>undo</button>
        </div>
        <footer className='display'>
            <div className='box-button-horizontal-edit'>
                <button id="backwardButton"></button>
                <button id="playAndPauseButton"></button>
                <button id="forwardButton"></button>
                <input type="range" id="zoom-slider" />
            </div>
        </footer>
    </>
    )
}

export default ButtonEdit