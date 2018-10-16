import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import CurrentUserStorage from '../Shared/CurrentUserStorage'

type State = {
    currentUser: IUserModel
}

type Props = {
}

export default class Exams extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null
        }
    }

    async componentDidMount () {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        this.setState({
            currentUser: currentUserC
        })
    }

    render() {
        return (
            <div>
                <NavbarC />
            </div>
        )
    }
}