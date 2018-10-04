import * as React from 'react'
import NavbarC from './NavbarC'
import GetStarted from './GetStarted'

type State = {
}

type Props = {
}

export default class Home extends React.Component<Props, State> {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <GetStarted/>
            </div>
        )
    }
}