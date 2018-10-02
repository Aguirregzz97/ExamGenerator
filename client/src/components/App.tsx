import * as React from 'react'
import './../assets/scss/App.scss'
import Home from './Home'
import { Fabric } from 'office-ui-fabric-react'


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
      <div>
        <Fabric>
          <Home />
        </Fabric>
      </div>
    )
  }
}