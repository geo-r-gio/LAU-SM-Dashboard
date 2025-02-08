import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Dashboard from '../pages/Dashboard'
import Delegates from '../pages/Delegates'
import DelegatesForm from '../pages/DelegatesForm'
import AdvisorsForm from '../pages/AdvisorsForm'
import Attendance from '../pages/Attendance'
import Advisors from '../pages/Advisors'
import Sessions from '../tables/Sessions'

const Routes = () => {
  return (
    <Switch>
        <Route path='/' exact component={Dashboard}/>
        <Route path='/delegates' component={Delegates}/>
        <Route path='/advisors' component={Advisors}/>
        <Route path='/attendance' component={Attendance}/>
        <Route path='/delegates-form' component={DelegatesForm}/>
        <Route path='/advisors-form' component={AdvisorsForm}/>
        <Route path='/Sessions' component={Sessions}/>
    </Switch>
  )
}

export default Routes
