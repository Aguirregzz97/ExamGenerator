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
        window.location.reload()
    }

    render() {
        let userBlock
        if (this.state.currentUserLoggedIn === undefined || this.state.currentUserLoggedIn === null) {
            userBlock =
                <NavItem>
                    <NavLink style={{ fontFamily: 'Montserrat' }} className='navItem' href='/Login'>LOGIN</NavLink>
                </NavItem>
        } else {
            userBlock =
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret style={{ fontFamily: 'Montserrat' }} className='navItem text-uppercase'>
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
                    <NavbarBrand style={{ fontFamily: 'Montserrat' }} className='navItem' href='/'>GENEVAL</NavbarBrand>
                    <NavbarToggler className='whiteColor' onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
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