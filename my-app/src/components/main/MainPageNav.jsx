import {Link} from 'react-router-dom'
import MainNavMoudule from '../../scss/main/mainNav.module.scss'
import {Plus, FilePenLine, SquarePen} from 'lucide-react'
import { useContext } from "react"
import { ButtonContext } from '../../context/Context'

const MainNav = () => {    
    const {setConfigButtonState, configButtonState, editButtonState, setEditButtonState, setEditableState, setPauseToLeave} = useContext(ButtonContext)
    
    const handleAddSounds = () => {
        setPauseToLeave(true)
        setEditableState(false)
        setConfigButtonState(false)
    }

    const handleEditorMode = () => {
        setEditButtonState(false)
        if(editButtonState) {
            setPauseToLeave(true)
        }
    }

    const handleConfig = () => {
        if(configButtonState) {
            setConfigButtonState(false)
        }else {
            if(editButtonState) {
                setConfigButtonState(false)
            }else {
                setConfigButtonState(true)
            }
        }
    }


    return (
        <nav id={MainNavMoudule.mainPage}>
            <Link to='/addSounds' id={MainNavMoudule.add} className={MainNavMoudule.mainPageButton} onClick={handleAddSounds}>
                <Plus className={MainNavMoudule.buttonIcon} />
                <h1 className={MainNavMoudule.buttonText}>adicionar</h1>
            </Link>

            <Link to={editButtonState ? '/editorMode': ''} className={MainNavMoudule.mainPageButton} id={MainNavMoudule.edit} onClick={handleEditorMode}>
                <FilePenLine className={MainNavMoudule.buttonIcon}/>
                <h1 className={MainNavMoudule.buttonText}>editar</h1>
            </Link>
        
            <Link className={MainNavMoudule.mainPageButton} id={MainNavMoudule.config} onClick={handleConfig}>
                <SquarePen className={MainNavMoudule.buttonIcon}/>
                <h1 className={MainNavMoudule.buttonText}>configurar</h1>
            </Link>  
        </nav>
    )
}

export default MainNav