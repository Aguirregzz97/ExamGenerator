import * as React from 'react'
import NavbarC from './NavbarC'
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble'
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button'
import swal from 'sweetalert2'
import Exams from './Exams'
import userStorage, { IUserModel } from '../Shared/UserStorage'
import UserStroage from '../Shared/UserStorage'
import CurrentUserStorage from '../Shared/CurrentUserStorage'


export interface ITeachingBubbleCondensedExampleState {
    isTeachingBubbleVisible?: boolean
}

type State = {
    username: string,
    password: string,
    userAuthenticated: boolean,
    isTeachingBubbleVissible: boolean,
    users: IUserModel[],
}

type Props = {
}



export default class Register extends React.Component<Props, State> {
    private _menuButtonElement: HTMLElement

    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            userAuthenticated: false,
            isTeachingBubbleVissible: false,
            users: [],
        }
    }

    async componentDidMount () {
        const usersC: IUserModel[] = await userStorage.getUsers()
        this.setState({
            users: usersC
        })
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

    submitedRegister = (event) => {
        event.preventDefault()
        if (this.state.username.length < 5 || this.state.password.length < 5) {
            this.setState({
                isTeachingBubbleVissible: !this.state.isTeachingBubbleVissible
            })
            return
        }
        const userToAdd: IUserModel = {
            id: this.state.users.length,
            username: this.state.username,
            password: this.state.password
        }
        const newUsers = [...this.state.users, userToAdd]
            this.setState({
            userAuthenticated: true
        }, async () => {
            await UserStroage.storeUsers(newUsers)
            await CurrentUserStorage.storeCurrentUser(userToAdd)
            await swal({
                type: 'success',
                title: 'Your account has been created!',
                showConfirmButton: false,
                timer: 1500,
                onClose: () => {window.location.href = '/Exams'}
            })
        })

    }

    _onDismiss = (ev: any) => {
        this.setState({
            isTeachingBubbleVissible: !this.state.isTeachingBubbleVissible
        })
    }

    render() {
        return (
            <div>
                <NavbarC />
                <h1 style={{ marginTop: '40px', marginBottom: '35px', color: '#244173' }} className='text-center'>Register</h1>
                <form>
                    <div className='row'>
                        <div className='col-4'></div>
                        <div className='col-4'>
                            <div className='form-group'>
                                <label style={{ color: '#244173' }} className=''>New username</label>
                                <input type='' className='form-control' aria-describedby='emailHelp' placeholder='Enter new username' onChange={this.onChangeUsername} />
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
                        <span
                            className='ms-TeachingBubbleBasicExample-buttonArea'
                            ref={menuButton => (this._menuButtonElement = menuButton!)}
                        >
                            <PrimaryButton
                                type='submit'
                                onClick={this.submitedRegister}
                                text='Register'
                                style={{ fontSize: '18px', height: '40px' }}
                            />
                        </span>
                        {this.state.isTeachingBubbleVissible ? (
                            <div>
                                <TeachingBubble
                                    targetElement={this._menuButtonElement}
                                    hasCondensedHeadline={true}
                                    onDismiss={this._onDismiss}
                                    hasCloseIcon={true}
                                    headline='Input error'
                                >
                                    The username and password must be at least 5 characters long, try again please
                                 </TeachingBubble>
                            </div>
                        ) : null}
                    </div>
                </form>
            </div>
        )
    }
}