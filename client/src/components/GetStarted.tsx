import * as React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { IUserModel } from '../Shared/UserStorage'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import NavbarC from './NavbarC'

const examImg = require('./../assets/img/Exam.png')


type State = {
    currentUser: IUserModel
}

type Props = {
}

export default class GetStarted extends React.Component<Props, State> {



    constructor(props) {
        super(props)
        this.state = {
            currentUser: null
        }
    }

    async componentDidMount() {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        this.setState({
            currentUser: currentUserC
        })
    }

    getStarted = () => {
        if (this.state.currentUser !== undefined) {
            window.location.href = '/Exams'
        } else {
            window.location.href = '/Login'
        }
    }

    render() {
        return (
            <div>
                <NavbarC />
                <div className='colorBlue text-center'>
                    <i style={{ color: 'white', fontSize: '120px', paddingTop: '40px', marginBottom: '20px' }} className='fas fa-chalkboard-teacher'></i>
                    <h1 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '33px', fontWeight: 'bold' }} className='text-center'>Generating exams has never been easier</h1>
                    <div className='text-center'>
                        <button onClick={this.getStarted} className='text-center btnBackBlue'>Start!</button>
                    </div>
                </div>
                <div style={{ paddingBottom: '50px' }} >
                    <h1 className='text-center' style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '33px', paddingTop: '20px', fontWeight: 'bold' }}>WHY GENEVAL?</h1>
                    <hr />
                    <div className='row'>
                        <div className='col-md-2'></div>
                        <div className='col-md-4 text-center'>
                            <h2 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '21px', fontWeight: 'bold', lineHeight: '40px', paddingTop: '30px' }} className='text-center'>Stop wasting time creating exams, Geneval allows you to easily generate exams, just generate your questions and add them to your exams!</h2>
                        </div>
                        <div className='col-md-4 text-center'>
                            <img style={{ paddingTop: '20px' }} id='examImg' src={examImg} />
                        </div>
                        <div className='col-md-2'></div>
                    </div>
                </div>
            </div>
        )
    }
}