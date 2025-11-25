import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import { HashRouter } from "react-router-dom"
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import ErrorBoundary from './ErrorBoundary';

const rootElement = document.getElementById('root') 

const root = ReactDOM.createRoot(rootElement);

const queryClient = new QueryClient()
// fallback={alert('Algo deu errado. Por Favor veja o erro na pasta data')}

root.render(
    <QueryClientProvider client={queryClient} >
        <HashRouter>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </HashRouter>
    </QueryClientProvider>
);

