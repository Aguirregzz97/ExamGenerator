import * as React from 'react'
import './../assets/scss/App.scss'
import Home from './Home'
import { Fabric } from 'office-ui-fabric-react'
import NavbarC from './NavbarC'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Topics from './Topics'


type State = {
  currentSeason: string
}

type Props = {
}


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
      <Router>
                <Route path='/subjects/:id' component={Topics} />
        <div>
            <NavbarC />
            <Home />
        </div>
      </Router>
    )
  }
}