import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import PhoneDashboard from './pages/PhoneDashboard'
import WatchLED from './pages/WatchLED'
import DevPanel from './pages/DevPanel'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PhoneDashboard />} />
                <Route path="/watch" element={<WatchLED />} />
                <Route path="/dev" element={<DevPanel />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
