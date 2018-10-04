import * as React from 'react'
import App from './App'
import Login from './Login'

const routes = [
  { path: '/', action: () => <App />},
  { path: '/Login', action: () => <Login />},
]

export default routes