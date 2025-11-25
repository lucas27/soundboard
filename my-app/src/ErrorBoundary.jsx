import { Component } from "react";
// import logger from "./scripts/logger";


class ErrorBoundary extends Component {
    state = { hasError: false }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        const errorLog = {
            message: error.message,
            stack: error.stack,
            componentStack: info.componentStack,
            timestamp: new Date().toISOString()
        }
        // console.log(errorLog)
        // logger.error(error)
        window.api.errorLogger('logger', errorLog)
    }

    render() {
        if(this.state.hasError) {
            return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#cc3300' }}>
                <h1>Erro Crítico Detectado!</h1>
                <p>O problema foi registrado. Por favor, reinicie ou recarregue a aplicação.</p>
                
                {/* Você pode substituir esta linha pela sua lógica de alerta/recarregar do Electron */}
                <button onClick={() => window.api.resetPage('reset')}>Recarregar</button>
            </div>
            )
            // return alert(alert('Algo deu errado. Por Favor veja o erro na pasta data'))
            
        } else {
            return this.props.children 
        }
    }
}

export default ErrorBoundary

