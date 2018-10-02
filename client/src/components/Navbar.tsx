import * as React from 'react'

type State = {
}

type Props = {
}

export default class Navbar extends React.Component<Props, State> {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                    <a id='navTitle' className='navbar-brand' href='#'>Sana en casa</a>
                    <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div className='collapse navbar-collapse' id='navbarNav'>
                        <ul className='navbar-nav ml-auto listNavbar'>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>Home <span className='sr-only'>(current)</span></a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>Features</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>Pricing</a>
                            </li>
                            <li className='nav-item'>
                                <a className='nav-link' href='#'>Disabled</a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        )
    }
}