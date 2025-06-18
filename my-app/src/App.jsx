import React from "react"
import { Routes, Route } from "react-router-dom"
import "./scss/App.scss"
import MainPage from "./pages/Main"
import AddSounds from "./pages/AddSounds" 
import EditorMode from "./pages/EditorMode"
import ButtonProvider from "./context/Context"

export const App = () => {
    return (
        <ButtonProvider>
            <Routes>
                <Route path="/" element={<MainPage/>}></Route>
                <Route path="/addSounds" element={<AddSounds/>}></Route>
                <Route path="/editorMode" element={<EditorMode/>}></Route>
            </Routes>
        </ButtonProvider>
    )
}