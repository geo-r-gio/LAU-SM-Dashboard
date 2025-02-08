import React from 'react'
import ReactDOM from 'react-dom/client'

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import rootReducer from './redux/reducers'

import './assets/boxicons-2.0.7/css/boxicons.min.css'
import './assets/css/grid.css'
import './assets/css/theme.css'
import './assets/css/index.css'

import Layout from './components/layout/Layout'
import Login from './components/login/Login'

const store = createStore(
  rootReducer
)

document.title = 'LAU Simulation Models'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <Login />
    </React.StrictMode>
  </Provider>,
)
