import * as React from 'react'
import NavbarC from './NavbarC';

type State = {
}

type Props = {
}

export default class Exams extends React.Component<Props, State> {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <NavbarC/>
            </div>
        )
    }
}