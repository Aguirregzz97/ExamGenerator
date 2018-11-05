import * as React from 'react'
import './../assets/scss/App.scss'
import ExamStorage, { IExamsModel } from '../Shared/ExamStorage'
import { IUserModel } from '../Shared/UserStorage'
import CurrentUserStorage from '../Shared/CurrentUserStorage'


type State = {
    currentUser: IUserModel
    exams: IExamsModel[]
    currentExam: IExamsModel
}

interface MatchParams {
    id: number
}

interface Props extends RouteComponentProps<MatchParams> {
}

export interface RouteComponentProps<P> {
    match: match<P>
    staticContext?: any
}

// tslint:disable-next-line:class-name
export interface match<P> {
    params: P
    isExact: boolean
    path: string
    url: string
}


export default class ExamPreview extends React.Component<Props, State> {

    async componentDidMount() {
        const currentUser: IUserModel = await CurrentUserStorage.getUser()
        const exams: IExamsModel[] = await ExamStorage.getExams(currentUser.id)
        let currentExam: IExamsModel
        let idToCheck: any = this.props.match.params.id
        for (let exam of exams) {
            if (exam.id === parseInt(idToCheck)) {
                currentExam = exam
            }
        }
        this.setState({
            exams: exams,
            currentUser: currentUser,
            currentExam: currentExam
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            exams: [],
            currentExam: null,
        }
    }

    render() {
        let today: any = new Date()
        let dd = today.getDate()
        let mm = today.getMonth() + 1
        let yyyy = today.getFullYear()
        if (dd < 10) {
            dd = '0' + dd
        }
        if (mm < 10) {
            mm = '0' + mm
        }
        today = dd + '/' + mm + '/' + yyyy
        if (!this.state.currentExam) {
            return <h1>loading...</h1>
        }
        return (
            <div>
                <div style={{ paddingLeft: '120px', paddingRight: '120px' }}>
                    <h1 style={{ marginTop: '40px', marginBottom: '35px', color: 'black' }} className='text-center text-uppercase'>{this.state.currentExam.name}</h1>
                    <h5>Name: _________________________________________________________________<span><h5 className='float-right'>{today}</h5></span></h5>
                    <h5>ID: _____________________________________________________________________</h5>
                    <h5>Professor: _____________________________________________________________</h5>
                    <div style={{ paddingTop: '40px' }}>
                        {this.state.currentExam.questions.map((element, i: number = 1) => {
                            {i++}
                            return (
                                <div key={element.id}>
                                    <h5>{i}) {element.questionName}</h5>
                                    <h5>a) {element.possibleAnswers[0].answer}</h5>
                                    <h5>b) {element.possibleAnswers[1].answer}</h5>
                                    <h5>c) {element.possibleAnswers[2].answer}</h5>
                                    <h5>d) {element.possibleAnswers[3].answer}</h5>
                                    <hr/>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}