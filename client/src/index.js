import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import App from './App'
import notfound from './404'

render((
  <BrowserRouter>
  <Switch>
    <App/>
    <Route component={notfound} />
  </Switch>
  </BrowserRouter>
), document.getElementById('root'));

