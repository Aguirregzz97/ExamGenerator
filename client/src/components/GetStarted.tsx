import * as React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'


const examImg = require('./../assets/img/Exam.png')


type State = {
}

type Props = {
}

export default class GetStarted extends React.Component<Props, State> {

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div className='colorBlue' style={{ height: '300px' }}>
                    <h1 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '30px', paddingTop: '50px', fontWeight: 'bold' }} className='text-center'>Generating exams has never been easier</h1>
                    <div className='text-center'>
                        <a href='/Login'><button className='text-center btnBackBlue'>Get started</button></a>
                    </div>
                </div>
                <div style={{ height: '300px' }} >
                    <h1 className='text-center' style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '30px', paddingTop: '50px', fontWeight: 'bold' }}>WHY GENEVAL?</h1>
                    <div className='row'>
                        <div className='col-md-2'></div>
                        <div className='col-md-8 text-center'>
                            <h2 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '27px', fontWeight: 'bold', lineHeight: '40px', paddingTop: '20px' }} className='text-center'>Stop wasting time creating exams, Geneval allows you to easily generate exams, just generate your questions and add them to your exams!</h2>
                            <img style={{ paddingTop: '20px' }} id='examImg' src={examImg} />
                        </div>
                        <div className='col-md-2'></div>
                    </div>
                </div>
            </div>
        )
    }
}