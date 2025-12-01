import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import EthicalChoiceAnalyzer from './ethical-analyzer-complete.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/AVECapstone">
      <Routes>
        <Route path="/" element={<EthicalChoiceAnalyzer />} />
        <Route path="/analyzer" element={<EthicalChoiceAnalyzer />} />
        <Route path="*" element={<EthicalChoiceAnalyzer />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

