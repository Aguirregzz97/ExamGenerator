import * as React from 'react'
import NavbarC from './NavbarC'

type State = {
    username: string,
    password: string,
    userAuthenticated: boolean
}

type Props = {
}

export default class Register extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            username: null,
            password: null,
            userAuthenticated: false
        }
    }

    onChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    onChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    submitedLogin = (event) => {
        if (this.state.username === 'admin' && this.state.password === 'admin') {
            this.setState({
                userAuthenticated: true
            })
        }
        else {
            alert('Wrong username')
        }
    }


    render() {
        if (this.state.userAuthenticated) {
            return (
                <h1>acces granted</h1>
            )
        }
        return (
            <div>
                <NavbarC/>
                <h1 style={{ marginTop: '40px', marginBottom: '35px', color: '#244173' }} className='text-center'>Register</h1>
                <form>
                    <div className='row'>
                        <div className='col-4'></div>
                        <div className='col-4'>
                            <div className='form-group'>
                                <label style={{ color: '#244173' }} className=''>New username</label>
                                <input type='email' className='form-control' aria-describedby='emailHelp' placeholder='Enter new username' onChange={this.onChangeUsername} />
                            </div>
                            <div className='form-group'>
                                <label style={{ color: '#244173' }} className=''>New password</label>
                                <input type='password' className='form-control' aria-describedby='emailHelp' placeholder='Enter new password' onChange={this.onChangePassword} />
                            </div>
                        </div>
                        <div className='col-4'></div>
                    </div>
                    <div className='text-center'>
                        <a href='/Login'><p style={{ paddingTop: '5px' }} className='text-center text-muted'>Already have an account? Login here</p></a>
                        <button onClick={this.submitedLogin} className='text-center btn btn-primary'>Register</button>
                    </div>
                </form>
            </div>
        )
    }
}