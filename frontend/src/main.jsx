import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx' // App은 주석 처리하거나 삭제
import BusyChecker from './BusyChecker' // BusyChecker를 가져온다!

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BusyChecker />   {/* App 대신 BusyChecker */}
    </StrictMode>,
)
