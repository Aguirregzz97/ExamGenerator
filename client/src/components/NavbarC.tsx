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
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'


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

    async componentDidMount() {
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

    logout = () => {
        CurrentUserStorage.removeCurrentUser()
        window.location.href = '/'
    }

    render() {
        let userBlock
        if (this.state.currentUserLoggedIn === undefined || this.state.currentUserLoggedIn === null) {
            userBlock =
                <NavItem>
                    <Link style={{ fontFamily: 'Montserrat' }} className='navItem nav-link' to='/Login'>LOGIN</Link>
                </NavItem>
        } else {
            userBlock =
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret style={{ fontFamily: 'Montserrat' }} className='navItem text-uppercase'>
                    <i style={{ fontSize: '24px', paddingRight: '10px' }} className='fas fa-user-circle text-center'></i>
                        {this.state.currentUserLoggedIn.username}
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem href='/User'>
                            My account
                    </DropdownItem>
                        <DropdownItem onClick={this.logout}>
                            Log out
                    </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
        }
        return (
            <div style={{ backgroundColor: 'black' }}>
                <Navbar expand='md'>
                <Link style={{ fontFamily: 'Montserrat', fontSize: '25px' }} className='navItem nav-link' to='/'>GENEVAL<i style={{ fontSize: '30px', paddingLeft: '10px' }} className='fas fa-scroll'></i></Link>
                    <NavbarToggler className='whiteColor' onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className='ml-auto' navbar>
                            <NavItem>
                            <Link style={{ fontFamily: 'Montserrat' }} className='navItem nav-link' to='/Exams'>EXAMS</Link>
                            </NavItem>
                            <NavItem>
                                <Link style={{ fontFamily: 'Montserrat' }} className='navItem nav-link' to='/Subjects'>CREATE-QUESTIONS</Link>
                            </NavItem>
                            {userBlock}
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}