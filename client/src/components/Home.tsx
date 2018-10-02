import * as React from 'react'
import Navbar from './Navbar'

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
                <Navbar/>
            </div>
        )
    }
}