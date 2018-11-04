import * as React from 'react'
import './../assets/scss/App.scss'
import NavbarC from './NavbarC'
import GetStarted from './GetStarted'
import Login from './Login'
import Register from './Register'
import Subjects from './Subjects'
import Topics from './Topics'
import { Switch, Route } from 'react-router-dom'
import Exams from './Exams'
import User from './User'
import Questions from './Questions'
import InsideExam from './InsideExam'



type State = {
  currentSeason: string
}

type Props = {
}

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={GetStarted} />
      <Route path='/Login' component={Login} />
      <Route path='/User' component={User} />
      <Route path='/Exams' component={Exams} />
      <Route path='/Register' component={Register} />
      <Route path='/Subjects' component={Subjects} />
      <Route path='/Subjects:id' component={Topics} />
      <Route path='/Topics:id' component={Questions} />
      <Route path='/Exam:id' component={InsideExam} />
    </Switch>
  </main>
)

export default class App extends React.Component<Props, State> {

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <Main />
      </div>
    )
  }
}