import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Animate highlighted words (.hl) the first time they scroll into view, on every page.
const hlObserver = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('hl-in'); hlObserver.unobserve(e.target) } }), { threshold: 0.6 })
const watchHl = () => document.querySelectorAll('.hl:not(.hl-in)').forEach((el) => hlObserver.observe(el))
new MutationObserver(watchHl).observe(document.body, { childList: true, subtree: true })
watchHl()
