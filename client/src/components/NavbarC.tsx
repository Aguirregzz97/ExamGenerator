import * as React from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap'

type State = {
    isOpen: boolean
}

type Props = {
}

export default class NavbarC extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: false
        }
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {
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
                            <NavItem>
                                <NavLink style={{ fontFamily: 'Montserrat' }} className='navItem' href='/Login'>LOGIN</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        )
    }
}