import { createContext, useState } from "react";

export const ButtonContext = createContext({})

const ButtonProvider = ({children}) => {
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

export default ButtonProvider