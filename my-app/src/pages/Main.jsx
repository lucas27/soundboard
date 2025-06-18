import MainNav from "../components/main/MainPageNav"
import MainHeader from "../components/main/MainPageHeader"
import MainComponent from "../components/main/MainPageMain"
import { ButtonContext } from "../context/Context"
import { useContext } from "react"


const MainPage = () => {
    const {editButtonState, idValue} = useContext(ButtonContext)
    return (
        <>
        <div style={{position: 'relative', top: '30px'}}>
            <MainNav/>
            <MainHeader id={idValue} stateVisibleButton={editButtonState} />
            <MainComponent/>
        </div>
        </>
    )
}

export default MainPage