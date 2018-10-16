import * as React from 'react'
import { IUserModel } from '../Shared/UserStorage'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap'
import CurrentUserStorage from '../Shared/CurrentUserStorage'


type State = {
    isOpen: boolean
    currentUserLoggedIn: IUserModel
}

type Props = {
}

export default class NavbarC extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            currentUserLoggedIn: null
        }
    }

    async componentDidMount () {
        const currentUser: IUserModel = await CurrentUserStorage.getUser()
        this.setState({
            currentUserLoggedIn: currentUser
        })
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
        let userBlock
        if (this.state.currentUserLoggedIn === undefined) {
            userBlock =
                <NavItem>
                    <NavLink style={{ fontFamily: 'Montserrat' }} className='navItem' href='/Login'>LOGIN</NavLink>
                </NavItem>
        } else {
            userBlock =
                <NavItem>
                    <NavLink style={{ fontFamily: 'Montserrat' }} className='navItem text-uppercase' href='/User'>{this.state.currentUserLoggedIn}</NavLink>
                </NavItem>
        }
        return (
            <div>
                <Navbar className='blackBack' expand='md'>
                    <NavbarBrand style={{ fontFamily: 'Montserrat' }} className='navItem' href='/'>GENEVAL</NavbarBrand>
                    <NavbarToggler className='whiteColor' onClick={this.toggle} />
                    <Collapse color='light' isOpen={this.state.isOpen} navbar>
                        <Nav className='ml-auto' navbar>
                            <NavItem>
                                <NavLink style={{ fontFamily: 'Montserrat' }} className='navItem' href='/Exams'>EXAMS</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink style={{ fontFamily: 'Montserrat' }} className='navItem' href='/Questions'>QUESTIONS</NavLink>
                            </NavItem>
                            {userBlock}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}