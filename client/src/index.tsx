import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'

import { initializeIcons } from '@uifabric/icons'
initializeIcons()


render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'))


