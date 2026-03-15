// frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import MentoraApp from './MentoraApp'  // Changed from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MentoraApp />
  </React.StrictMode>,
)