import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { Toggle } from 'office-ui-fabric-react/lib/Toggle'
import { RingLoader } from 'react-spinners'


type State = {
    currentUser: IUserModel,
    showPassword: boolean
}

type Props = {
}

export default class User extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            showPassword: false
        }
    }

    async componentDidMount() {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        this.setState({
            currentUser: currentUserC
        })
    }

    togglePassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    render() {
        if (!this.state.currentUser) {
            return (
                <div>
                    <div className='text-center' style={{ width: '200px', margin: '30px auto' }}>
                        <RingLoader
                            color={'#244173'}
                            size={200}
                        />
                    </div>
                    <h1 className='text-center' style={{ color: '#244173', fontSize: '30px', marginTop: '20px' }}>Geneval</h1>
                </div>
            )
        }
        return (
            <div style={{ backgroundColor: '#244173', paddingBottom: '50px' }}>
                <NavbarC />
                <h1 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '50px', paddingTop: '50px', fontWeight: 'bold' }} className='text-center text-uppercase'>Account info</h1>
                <div className='row'>
                    <div className='col-2'></div>
                    <div className='col-4'>
                        <h2 style={{ color: 'black', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '50px', fontWeight: 'bold' }} className='text-center'>USERNAME:</h2>
                        <h2 style={{ color: 'black', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '50px', fontWeight: 'bold', padding: '20px' }} className='text-center'>{this.state.currentUser.username}</h2>
                    </div>
                    <div className='col-4'>
                        <div className='text-center'>
                            <h2 style={{ color: 'black', fontFamily: 'Montserrat', fontSize: '33px', paddingTop: '50px', fontWeight: 'bold' }} className='text-center'>PASSWORD:</h2>
                            <Toggle
                            style={{ borderColor: 'white' }}
                                styles={{ text: 'colorWhite' }}
                                defaultChecked={false}
                                onChanged={() => this.togglePassword()}
                            />
                        <h2 style={{ color: 'black', fontFamily: 'Montserrat', fontSize: '33px', paddingTop: '50px', fontWeight: 'bold', padding: '10px' }} className='text-center'>{this.state.showPassword ? this.state.currentUser.password : '*****'}</h2>
                        </div>
                    </div>
                    <div className='col-2'></div>
                </div>
            </div>
        )
    }
}