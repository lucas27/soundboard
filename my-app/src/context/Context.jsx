import { createContext, useState } from "react";

export const ButtonContext = createContext({})
export const editorContext = createContext({})

export default function ButtonProvider({children}) {
    const [configButtonState, setConfigButtonState] = useState(false)
    const [editButtonState, setEditButtonState] = useState(false)
    const [idValue, setIdValue] = useState({})
    const [editableState, setEditableState] = useState(false)
    const [pauseToLeave, setPauseToLeave] = useState(false)

    return (
        <ButtonContext.Provider value={{idValue, 
        editableState, 
        setEditableState, 
        setIdValue, 
        editButtonState, 
        setEditButtonState, 
        configButtonState, 
        setConfigButtonState, 
        pauseToLeave, 
        setPauseToLeave}}>
            {children}
        </ButtonContext.Provider> 
    )
}

export function EditorProvider({ children }) {
    const [playAudio, setPlayAudio] = useState(true)
    const [closePage, setClosePage] = useState(false)
    
    if(closePage) {
        window.api.resetPage('reset')
    }

    return (
        <editorContext.Provider value={{setPlayAudio, playAudio, setClosePage}}>
            {children}
        </ editorContext.Provider>

    )
}

