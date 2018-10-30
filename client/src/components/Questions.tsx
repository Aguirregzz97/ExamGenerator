import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import SubjectStorage, { ISubjectModel } from '../Shared/SubjectStorage'
import TopicStorage, { ITopicModel } from '../Shared/TopicStorage'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import swal from 'sweetalert2'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import QuestionStorage, { IQuestionModel, IPossibleAnswer } from '../Shared/QuestionStorage'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'

const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })


type State = {
    currentUser: IUserModel
    questions: IQuestionModel[]
    currentTopic: ITopicModel
    hideDialog: boolean
    questionName: string
    options: IPossibleAnswer[]
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

export default class Questions extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            questions: null,
            currentTopic: null,
            hideDialog: true,
            options: new Array(4),
            questionName: null,
        }
    }

    async componentDidMount() {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        const currentQuestionsC: IQuestionModel[] = await QuestionStorage.getQuestions(currentUserC.id)
        let currentTopicsC: ITopicModel[] = await TopicStorage.getTopics(currentUserC.id)
        let currentOptionsC: IPossibleAnswer = {
            answer: '',
            isCorrect: undefined
        }
        let currentTopicC: ITopicModel
        let idToCheck: any = this.props.match.params.id
        currentTopicsC.forEach(element => {
            if (element.id === parseInt(idToCheck)) {
                currentTopicC = element
            }
        })
        this.setState({
            currentUser: currentUserC,
            questions: currentQuestionsC,
            currentTopic: currentTopicC,
        })
    }

    createNewQuestion = async () => {
        let fullQuestions = await QuestionStorage.getQuestions(this.state.currentUser.id)
        let newQuestionID: number = 0
        fullQuestions.forEach(element => {
            if (element.id >= newQuestionID) {
                newQuestionID = element.id + 1
            }
        })
        const questionToAdd: IQuestionModel = {
            id: newQuestionID,
            possibleAnswers: this.state.options,
            idTopic: this.state.currentTopic.id,
            questionName: this.state.questionName
        }
        const questionsUpdated: IQuestionModel[] = [...fullQuestions, questionToAdd]
        await QuestionStorage.storeQuestions(questionsUpdated, this.state.currentUser.id)
    }

    deleteQuestion = (questionToDelete: IQuestionModel) => {
    }

    editQuestion = async (questionToEdit: IQuestionModel) => {
    }

    onChangeQuestionName = (event) => {
        this.setState({
            questionName: event.target.value
        })
    }

    onChangeQuestionOptions = (optionIndex: number) => (event) => {
        const newOptionFinal = [...this.state.options]
        let optionToAdd: IPossibleAnswer = {
            answer: event.target.value,
            isCorrect: undefined
        }
        if (optionIndex === 0) {
            optionToAdd.isCorrect = true
            newOptionFinal[optionIndex] = optionToAdd
        } else {
            newOptionFinal[optionIndex] = optionToAdd
        }
        this.setState({
            options: newOptionFinal
        })
    }

    clickedLi = (index: number) => {

    }

    private _showDialog = (): void => {
        this.setState({ hideDialog: false })
    }

    private _closeDialog = (): void => {
        this.setState({ hideDialog: true })
    }

    render() {
        let placeH = <span className='fas fa-search'></span>
        if (!this.state.questions) {
            return <h1>loading...</h1>
        }
        return (
            <div>
                <NavbarC />
                <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold', paddingBottom: '30px' }} className='text-center'>{this.state.currentTopic.topicName}</h1>
                <div style={{ paddingLeft: '150px', paddingRight: '150px' }}>
                    <div className='row'>
                        <div className='col-6'>
                            <span onClick={this._showDialog} style={{ fontSize: '50px', paddingLeft: '40px', paddingBottom: '10px' }} className='fas fa-plus-circle newQuestion'></span>
                        </div>
                        <div className='col-6'>
                            <form className='form-inline float-right'>
                                <input className='form-control' type='text' placeholder='Search' aria-label='Search' />
                                <i style={{ paddingLeft: '10px', color: '#244173' }} className='fa fa-search' aria-hidden='true'></i>
                            </form>
                        </div>
                    </div>
                </div>
                <ul style={{ paddingTop: '20px' }} className='list-group'>
                {
                    this.state.questions.map((element, index) => {
                        if (this.state.currentTopic.id === element.idTopic) {
                            return (
                                <div key={index}>
                                    <div className='text-center'>
                                        <li onClick={() => {this.clickedLi(index) }} className='list-group-item'>{element.questionName} <span style={{ paddingRight: '10px', color: '#244173', fontSize: '20px' }} className='float-right fas fa-caret-square-down'></span> </li>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
                </ul>
                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={this._closeDialog}
                    minWidth={'600px'}
                    maxWidth={'1000px'}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: 'Generate new question',
                    }}
                >
                    <div className=''>
                        <form>
                            <div className='form-group'>
                                <h4 className='text-center'>Question:</h4>
                                <input onChange={this.onChangeQuestionName} style={{ marginTop: '10px' }} type='text' className='form-control' placeholder='Enter question' required />
                                <div className='form-row'>
                                    <div className='form-group col-8' style={{ marginTop: '40px' }}>
                                        <input onChange={this.onChangeQuestionOptions(0)} type='text' className='form-control' placeholder='option#1' required />
                                    </div>
                                    <div style={{ paddingTop: '47px', color: 'black', fontWeight: 'bold' }} className='col-4'><span style={{ fontSize: '25px', color: 'green' }} className='fas fa-check'></span>  Correct Answer</div>
                                    <div className='form-group col-8'>
                                        <input onChange={this.onChangeQuestionOptions(1)} style={{ marginTop: '10px' }} type='text' className='form-control' placeholder='option#2' required />
                                    </div>
                                    <div className='form-group col-4'></div>
                                    <div className='form-group col-8'>
                                        <input onChange={this.onChangeQuestionOptions(2)} style={{ marginTop: '10px' }} type='text' className='form-control' placeholder='option#3' required />
                                    </div>
                                    <div className='form-group col-4'></div>
                                    <div className='form-group col-8'>
                                        <input onChange={this.onChangeQuestionOptions(3)} style={{ marginTop: '10px' }} type='text' className='form-control' placeholder='option#4' required />
                                    </div>
                                    <div className='form-group col-4'></div>
                                </div>
                            </div>
                            <div className='text-center'>
                                <PrimaryButton type='submit' style={{ marginRight: '10px' }} onClick={this.createNewQuestion} text='Save' />
                                <DefaultButton style={{ marginLeft: '10px' }} onClick={this._closeDialog} text='Cancel' />
                            </div>
                        </form>
                    </div>
                </Dialog>
            </div>
        )
    }
}