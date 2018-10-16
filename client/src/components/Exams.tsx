import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'

type State = {
}

type Props = {
    currentUser: IUserModel
}

export default class Exams extends React.Component<Props, State> {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <NavbarC />
            </div>
        )
    }
}