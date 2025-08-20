import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
// import HeaderButton from './HeaderButton';

// const header = ReactDOM.createRoot(document.querySelector('header'))
const rootElement = document.getElementById('root') 

const root = ReactDOM.createRoot(rootElement);

// header.render(<HeaderButton />)
root.render(<App />);

