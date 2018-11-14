import * as React from 'react'
import './../assets/scss/App.scss'
import ExamStorage, { IExamsModel } from '../Shared/ExamStorage'
import { IUserModel } from '../Shared/UserStorage'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { IQuestionModel } from '../Shared/QuestionStorage'
import swal from 'sweetalert2'


type State = {
    currentUser: IUserModel
    exams: IExamsModel[]
    currentExam: IExamsModel
    showButtons: boolean
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
        for (const question of currentExam.questions) {
            if (question.variables.length !== 0) {
                for (const variable of question.variables) {
                    variable.variableValue = Math.floor(Math.random() * (variable.upperBound - variable.lowerBound) + 1) + variable.lowerBound
                }
            }
        }
        this.setState({
            exams: exams,
            currentUser: currentUser,
            currentExam: currentExam,
        })
    }

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            exams: [],
            currentExam: null,
            showButtons: true
        }
    }

    buttonPrint = () => {
        if (this.state.showButtons) {
            return (
                <div className='text-center'>
                    <button style={{marginBottom: '50px'}} onClick={this.clickPrint} className='btn btn-primary text-center'>print / save</button>
                </div>
            )
        }
    }

    clickPrint = () => {
        this.setState({
            showButtons: false
        }, async () => {
            await window.print()
            this.setState({
                showButtons: true
            })
        })
    }

    deleteQuestion = (questionToDelete: IQuestionModel) => {
        swal({
            title: 'Are you sure?',
            text: 'You wont be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                for (let i = 0; i < this.state.exams.length; i++) {
                    if (this.state.exams[i].id === this.state.currentExam.id) {
                        for (let j = 0; j < this.state.currentExam.questions.length; j++) {
                            if (questionToDelete.id === this.state.currentExam.questions[j].id) {
                                this.state.exams[i].questions.splice(j, 1)
                                break
                            }
                        }
                    }
                }
                ExamStorage.storeExams(this.state.exams, this.state.currentUser.id)
                swal({
                    type: 'success',
                    title: 'Deleted!',
                    text: 'Your question ' + questionToDelete.questionName + ' has ben deleted',
                    timer: 500,
                    showConfirmButton: false,
                    onClose: () => { window.location.reload() }
                })
            }
        })
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
                        {this.state.currentExam.questions.map((element, questionNumber: number = 1) => {
                            { questionNumber++ }
                            if (element.variables.length === 0) {
                                let shuffleArray: number[] = [0, 1, 2, 3]
                                let i = shuffleArray.length,
                                    j = 0,
                                    temp
                                while (i--) {
                                    j = Math.floor(Math.random() * (i + 1))
                                    // swap randomly chosen element with current element
                                    temp = shuffleArray[i]
                                    shuffleArray[i] = shuffleArray[j]
                                    shuffleArray[j] = temp
                                }
                                return (
                                    <div key={element.id}>
                                        <h5>{questionNumber}) {element.questionName} {this.state.showButtons ? <span onClick={() => this.deleteQuestion(element)} className='fas fa-trash-alt float-right trashExamPreview'></span> : null} </h5>
                                        <h5>a) {element.possibleAnswers[shuffleArray[0]].answer} {this.state.showButtons ? element.possibleAnswers[shuffleArray[0]].isCorrect ? <span className='fas fa-check checkPrev'></span> : null : null}</h5>
                                        <h5>b) {element.possibleAnswers[shuffleArray[1]].answer} {this.state.showButtons ? element.possibleAnswers[shuffleArray[1]].isCorrect ? <span className='fas fa-check checkPrev'></span> : null : null}</h5>
                                        <h5>c) {element.possibleAnswers[shuffleArray[2]].answer} {this.state.showButtons ? element.possibleAnswers[shuffleArray[2]].isCorrect ? <span className='fas fa-check checkPrev'></span> : null : null}</h5>
                                        <h5>d) {element.possibleAnswers[shuffleArray[3]].answer} {this.state.showButtons ? element.possibleAnswers[shuffleArray[3]].isCorrect ? <span className='fas fa-check checkPrev'></span> : null : null}</h5>
                                        <hr />
                                    </div>
                                )
                            }
                            else {
                                let shuffleArray: number[] = [0, 1, 2, 3]
                                let i = shuffleArray.length,
                                    j = 0,
                                    temp
                                while (i--) {
                                    j = Math.floor(Math.random() * (i + 1))
                                    // swap randomly chosen element with current element
                                    temp = shuffleArray[i]
                                    shuffleArray[i] = shuffleArray[j]
                                    shuffleArray[j] = temp
                                }
                                let replacedQuestionName: string = element.questionName
                                let possibleAnswer0: string = element.possibleAnswers[shuffleArray[0]].answer
                                let possibleAnswer1: string = element.possibleAnswers[shuffleArray[1]].answer
                                let possibleAnswer2: string = element.possibleAnswers[shuffleArray[2]].answer
                                let possibleAnswer3: string = element.possibleAnswers[shuffleArray[3]].answer
                                for (const variable of element.variables) {
                                    while (replacedQuestionName.includes(variable.variableName) || possibleAnswer0.includes(variable.variableName) || possibleAnswer1.includes(variable.variableName) || possibleAnswer2.includes(variable.variableName) || possibleAnswer3.includes(variable.variableName)) {
                                        replacedQuestionName = replacedQuestionName.replace(variable.variableName.toString(), variable.variableValue.toString())
                                        possibleAnswer0 = possibleAnswer0.replace(variable.variableName.toString(), variable.variableValue.toString())
                                        possibleAnswer1 = possibleAnswer1.replace(variable.variableName.toString(), variable.variableValue.toString())
                                        possibleAnswer2 = possibleAnswer2.replace(variable.variableName.toString(), variable.variableValue.toString())
                                        possibleAnswer3 = possibleAnswer3.replace(variable.variableName.toString(), variable.variableValue.toString())
                                    }
                                }
                                // tslint:disable-next-line:no-eval
                                possibleAnswer0 = eval(possibleAnswer0)
                                // tslint:disable-next-line:no-eval
                                possibleAnswer1 = eval(possibleAnswer1)
                                // tslint:disable-next-line:no-eval
                                possibleAnswer2 = eval(possibleAnswer2)
                                // tslint:disable-next-line:no-eval
                                possibleAnswer3 = eval(possibleAnswer3)
                                return (
                                    <div key={element.id}>
                                        <h5>{questionNumber}) {replacedQuestionName} {this.state.showButtons ? <span onClick={() => this.deleteQuestion(element)} className='fas fa-trash-alt float-right trashExamPreview'></span> : null} </h5>
                                        <h5>a) {possibleAnswer0} {this.state.showButtons ? element.possibleAnswers[shuffleArray[0]].isCorrect ? <span className='fas fa-check checkPrev'></span> : null : null}</h5>
                                        <h5>b) {possibleAnswer1} {this.state.showButtons ? element.possibleAnswers[shuffleArray[1]].isCorrect ? <span className='fas fa-check checkPrev'></span> : null : null}</h5>
                                        <h5>c) {possibleAnswer2} {this.state.showButtons ? element.possibleAnswers[shuffleArray[2]].isCorrect ? <span className='fas fa-check checkPrev'></span> : null : null}</h5>
                                        <h5>d) {possibleAnswer3} {this.state.showButtons ? element.possibleAnswers[shuffleArray[3]].isCorrect ? <span className='fas fa-check checkPrev'></span> : null : null}</h5>
                                        <hr />
                                    </div>
                                )
                            }
                        })}
                    </div>
                </div>
                {this.buttonPrint()}
            </div>
        )
    }
}