import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

render((
  <BrowserRouter>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@300&display=swap" rel="stylesheet"/>
    <App/>
  </BrowserRouter>
), document.getElementById('root'))
