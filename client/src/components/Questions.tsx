import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import SubjectStorage, { ISubjectModel } from '../Shared/SubjectStorage'
import TopicStorage, { ITopicModel } from '../Shared/TopicStorage'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import swal from 'sweetalert2'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import matchSorter from 'match-sorter'
import QuestionStorage, { IQuestionModel, IPossibleAnswer } from '../Shared/QuestionStorage'
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog'
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })

type Variable = {
    variableName: string
    lower: number
    upper: number
}

type State = {
    currentUser: IUserModel
    questions: IQuestionModel[]
    currentTopic: ITopicModel
    hideDialog: boolean
    questionName: string
    options: IPossibleAnswer[]
    modal: boolean
    currentQuestionModal: IQuestionModel
    isEditing: boolean,
    searchValue: string,
    Variables: Variable[]
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
            modal: false,
            currentQuestionModal: null,
            isEditing: false,
            searchValue: '',
            Variables: []
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
        let questionN: string = this.state.questionName
        for (let i = 0; i < questionN.length; i++) {
            if (questionN[i] === '#') {
                let newVar: string = ''
                while (true) {
                    if (questionN[i] === '?' || questionN[i] === ' ' || questionN[i] === '.' || questionN[i] === ',') {
                        const variableToAdd: Variable = {
                            variableName: newVar,
                            lower: null,
                            upper: null
                        }
                        const varArr = [...this.state.Variables, variableToAdd]
                        this.setState({
                            Variables: varArr
                        })
                        break
                    }
                    else {
                        newVar += questionN[i]
                        i++
                    }
                }
            }
        }
        const questionsUpdated: IQuestionModel[] = [...fullQuestions, questionToAdd]
        await QuestionStorage.storeQuestions(questionsUpdated, this.state.currentUser.id)
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
                for (let i = 0; i < this.state.questions.length; i++) {
                    if (questionToDelete.id === this.state.questions[i].id) {
                        this.state.questions.splice(i, 1)
                        break
                    }
                }
                QuestionStorage.storeQuestions(this.state.questions, this.state.currentUser.id)
                swal({
                    type: 'success',
                    title: 'Deleted!',
                    text: 'Your subject ' + questionToDelete.questionName + ' has ben deleted',
                    timer: 1500,
                    showConfirmButton: false,
                    onClose: () => { window.location.reload() }
                })
            }
        })
    }

    editQuestion = (questionToEdit: IQuestionModel) => {
        const newOptionFinal: IPossibleAnswer[] = [...this.state.options]
        let optionToAdd0: IPossibleAnswer = {
            answer: questionToEdit.possibleAnswers[0].answer,
            isCorrect: true
        }
        let optionToAdd1: IPossibleAnswer = {
            answer: questionToEdit.possibleAnswers[1].answer,
            isCorrect: undefined
        }
        let optionToAdd2: IPossibleAnswer = {
            answer: questionToEdit.possibleAnswers[2].answer,
            isCorrect: undefined
        }
        let optionToAdd3: IPossibleAnswer = {
            answer: questionToEdit.possibleAnswers[3].answer,
            isCorrect: undefined
        }
        newOptionFinal[0] = optionToAdd0
        newOptionFinal[1] = optionToAdd1
        newOptionFinal[2] = optionToAdd2
        newOptionFinal[3] = optionToAdd3
        this.setState({
            isEditing: true,
            currentQuestionModal: questionToEdit,
            options: newOptionFinal,
            questionName: questionToEdit.questionName
        }, async () => {
            await this._showDialog()
        })
    }

    submitEdit = async () => {
        const newEditedQuestion = {
            id: this.state.currentQuestionModal.id,
            possibleAnswers: this.state.options,
            idTopic: this.state.currentQuestionModal.idTopic,
            questionName: this.state.questionName
        }
        for (let i = 0; i < this.state.questions.length; i++) {
            if (this.state.currentQuestionModal.id === this.state.questions[i].id) {
                this.state.questions[i] = newEditedQuestion
                break
            }
        }
        await QuestionStorage.storeQuestions(this.state.questions, this.state.currentUser.id)
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

    changedFilter = (event) => {
        this.setState({
            searchValue: event.target.value
        })
    }

    private _showDialog = (): void => {
        this.setState({ hideDialog: false })
    }

    private _closeDialog = (): void => {
        this.setState({ hideDialog: true })
    }

    clickedLi = (currentQuestion: IQuestionModel) => {
        this.setState({
            currentQuestionModal: currentQuestion,
            modal: !this.state.modal
        })
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        })
    }

    render() {
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
                                <input onChange={this.changedFilter} className='form-control' type='text' placeholder='Search' aria-label='Search' />
                                <i style={{ paddingLeft: '10px', color: '#244173' }} className='fa fa-search' aria-hidden='true'></i>
                            </form>
                        </div>
                    </div>
                </div>
                <ul style={{ paddingTop: '20px' }} className='list-group'>
                    {
                        matchSorter(this.state.questions, this.state.searchValue, {keys: ['questionName', 'possibleAnswers.0.answer', 'possibleAnswers.1.answer', 'possibleAnswers.2.answer', 'possibleAnswers.3.answer', ]}).map((element, index) => {
                            if (this.state.currentTopic.id === element.idTopic) {
                                return (
                                    <div key={element.id}>
                                        <div className='text-center'>
                                            <li className='list-group-item list-group-item-action list-group-item-dark'>{element.questionName}<span onClick={() => this.deleteQuestion(element)} style={{ fontSize: '22px' }} className='trashCanQuestion far fa-trash-alt float-right'></span><span onClick={() => this.editQuestion(element)} style={{ fontSize: '20px' }} className='editQuestion far fa-edit float-right'></span><span onClick={() => { this.clickedLi(element) }} className='eyeQuestion far fa-eye float-right'></span></li>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </ul>
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                    <ModalHeader toggle={this.toggle}>{this.state.currentQuestionModal ? this.state.currentQuestionModal.questionName : null}</ModalHeader>
                    <ModalBody>
                        <h5>a) {this.state.currentQuestionModal ? this.state.currentQuestionModal.possibleAnswers[0].answer : null}</h5>
                        <h5>a) {this.state.currentQuestionModal ? this.state.currentQuestionModal.possibleAnswers[1].answer : null}</h5>
                        <h5>a) {this.state.currentQuestionModal ? this.state.currentQuestionModal.possibleAnswers[2].answer : null}</h5>
                        <h5>a) {this.state.currentQuestionModal ? this.state.currentQuestionModal.possibleAnswers[3].answer : null}</h5>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='danger' onClick={this.toggle}>Exit</Button>
                    </ModalFooter>
                </Modal>
                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={this._closeDialog}
                    minWidth={'600px'}
                    maxWidth={'1000px'}
                    dialogContentProps={{
                        type: DialogType.largeHeader,
                        title: this.state.isEditing ? 'Edit question' : 'Generate new question',
                    }}
                >
                    <div className=''>
                        <form>
                            <div className='form-group'>
                                <h4 className='text-center'>Question:</h4>
                                <input onChange={this.onChangeQuestionName} style={{ marginTop: '10px' }} type='text' className='form-control' placeholder='Enter question' defaultValue={this.state.isEditing ? this.state.currentQuestionModal.questionName : null} required />
                                <div className='form-row'>
                                    <div className='form-group col-8' style={{ marginTop: '40px' }}>
                                        <input onChange={this.onChangeQuestionOptions(0)} type='text' className='form-control' placeholder='option#1' defaultValue={this.state.isEditing ? this.state.currentQuestionModal.possibleAnswers[0].answer : null} required />
                                    </div>
                                    <div style={{ paddingTop: '47px', color: 'black', fontWeight: 'bold' }} className='col-4'><span style={{ fontSize: '25px', color: 'green' }} className='fas fa-check'></span>  Correct Answer</div>
                                    <div className='form-group col-8'>
                                        <input onChange={this.onChangeQuestionOptions(1)} style={{ marginTop: '10px' }} type='text' className='form-control' placeholder='option#2' defaultValue={this.state.isEditing ? this.state.currentQuestionModal.possibleAnswers[1].answer : null} required />
                                    </div>
                                    <div className='form-group col-4'></div>
                                    <div className='form-group col-8'>
                                        <input onChange={this.onChangeQuestionOptions(2)} style={{ marginTop: '10px' }} type='text' className='form-control' placeholder='option#3' defaultValue={this.state.isEditing ? this.state.currentQuestionModal.possibleAnswers[2].answer : null} required />
                                    </div>
                                    <div className='form-group col-4'></div>
                                    <div className='form-group col-8'>
                                        <input onChange={this.onChangeQuestionOptions(3)} style={{ marginTop: '10px' }} type='text' className='form-control' placeholder='option#4' defaultValue={this.state.isEditing ? this.state.currentQuestionModal.possibleAnswers[3].answer : null} required />
                                    </div>
                                    <div className='form-group col-4'></div>
                                </div>
                            </div>
                            <div className='text-center'>
                                <PrimaryButton type='submit' style={{ marginRight: '10px' }} onClick={this.state.isEditing ? this.submitEdit : this.createNewQuestion} text={this.state.isEditing ? 'Update' : 'Save'} />
                                <DefaultButton style={{ marginLeft: '10px' }} onClick={this._closeDialog} text='Cancel' />
                            </div>
                        </form>
                    </div>
                </Dialog>
            </div>
        )
    }
}