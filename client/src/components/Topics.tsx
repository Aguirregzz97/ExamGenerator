import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import SubjectStorage, { ISubjectModel } from '../Shared/SubjectStorage'
import TopicStorage, { ITopicModel } from '../Shared/TopicStorage'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import swal from 'sweetalert2'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip'
import QuestionStorage, { IQuestionModel } from '../Shared/QuestionStorage'

const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })


type State = {
    currentUser: IUserModel
    topics: ITopicModel[]
    questions: IQuestionModel[]
    currentSubject: ISubjectModel
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

export default class Topics extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            topics: [],
            questions: [],
            currentSubject: null
        }
    }

    async componentDidMount() {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        const currentTopicsC: ITopicModel[] = await TopicStorage.getTopics(currentUserC.id)
        const currentSubjectsC: ISubjectModel[] = await SubjectStorage.getSubjects(currentUserC.id)
        const currentQuestionsC: IQuestionModel[] = await QuestionStorage.getQuestions(currentUserC.id)
        let currentSubjectC: ISubjectModel
        let idToCheck: any = this.props.match.params.id
        currentSubjectsC.forEach(element => {
            if (element.id === parseInt(idToCheck)) {
                currentSubjectC = element
            }
        })
        this.setState({
            currentUser: currentUserC,
            topics: currentTopicsC,
            questions: currentQuestionsC,
            currentSubject: currentSubjectC
        })
    }

    createNewTopic  = async () => {
        const { value: topicInput } = await swal({
            title: 'Input new topic',
            input: 'text',
            inputPlaceholder: 'Enter your new topic!'
        })
        if (topicInput) {
            await swal({
                type: 'success',
                title: 'Your topic was created!',
                showConfirmButton: false,
                timer: 2000
            })
            let newID: number = 0
            this.state.topics.forEach((element) => {
                if (element.id >= newID) {
                    newID = element.id + 1
                }
            })
            const topicToAdd: ITopicModel = {
                id: newID,
                idSubject: this.state.currentSubject.id,
                topicName: topicInput
            }
            const newTopics = [...this.state.topics, topicToAdd]
            await TopicStorage.storeTopics(newTopics, this.state.currentUser.id)
        }
        if (TopicStorage) {
            window.location.reload()
        }
    }

    deleteTopic = (topicToDelete: ITopicModel) => {
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
                {
                    let sizeQuestions: number = this.state.questions.length
                    let offsetQuestions: number = 0
                    for (let i = 0; i < sizeQuestions; i++) {
                        if (this.state.questions[i - offsetQuestions].idTopic === topicToDelete.id) {
                            this.state.questions.splice(i - offsetQuestions, 1)
                            offsetQuestions++
                        }
                    }
                    QuestionStorage.storeQuestions(this.state.questions, this.state.currentUser.id)
                    this.state.topics.forEach((element, index) => {
                        if (topicToDelete.id === element.id) {
                            this.state.topics.splice(index, 1)
                            TopicStorage.storeTopics(this.state.topics, this.state.currentUser.id)
                            swal({
                                type: 'success',
                                title: 'Deleted!',
                                text: 'Your topic ' + topicToDelete.topicName + ' has ben deleted',
                                timer: 1500,
                                showConfirmButton: false,
                                onClose: () => { window.location.reload() }
                            })
                        }
                    })
                }
            }
        })
    }

    editTopic = async (topicToEdit: ITopicModel) => {
        const { value: topicInput } = await swal({
            title: 'Input topic name',
            input: 'text',
            inputPlaceholder: 'Enter your topic name!'
        })
        if (topicInput) {
            this.state.topics.forEach((element) => {
                if (element.id === topicToEdit.id) {
                    element.topicName = topicInput
                    TopicStorage.storeTopics(this.state.topics, this.state.currentUser.id)
                    swal({
                        type: 'success',
                        title: 'succesfully chnaged subject name',
                        text: 'Your subject ' + topicToEdit.topicName + ' has been edited to ' + topicInput,
                        timer: 1500,
                        showConfirmButton: false,
                        onClose: () => { window.location.reload() }
                    })
                }
            })
        }
    }

    render() {
        if (!this.state.currentSubject) {
            return <h1>loading...</h1>
        }
        return (
            <div>
                <NavbarC />
                <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold', paddingBottom: '30px' }} className='text-center'>{this.state.currentSubject.subjectName}</h1>
                    <div style={{ paddingLeft: '100px', paddingRight: '100px' }}>
                        <GridPage
                            component='ul'
                            columns={5}
                            columnWidth={220}
                            gutterWidth={15}
                            gutterHeight={20}
                            itemHeight={190}
                            springConfig={{ stiffness: 170, damping: 22 }}
                        >
                            <div>
                                <button className='newSubject' onClick={this.createNewTopic} style={{ background: 'none', border: 'none' }}><span style={{ fontSize: '110px' }} className='far fa-plus-square newSubject'></span></button>
                                <h4 style={{ fontSize: '20px', color: '#244173', fontFamily: 'Montserrat', fontWeight: 'bold', paddingTop: '15px' }} className='text-center'>new</h4>
                            </div>
                            {this.state.topics.map((value) => {
                                if (this.state.currentSubject.id === value.idSubject)
                                return (
                                    <div key={value.id} className='text-center'>
                                        <span onClick={() => this.deleteTopic(value)} style={{  fontSize: '22px' }} className='trashCan far fa-trash-alt float-right text-center'></span>
                                            <TooltipHost content='view your topic!' id='myID' calloutProps={{ gapSpace: 85 }}>
                                            <Link to={'/Topics' + value.id}><span style={{ fontSize: '110px' }} className='fas fa-file-alt newTopic'></span></Link>
                                            </TooltipHost>
                                        <h4 style={{ fontSize: '17px', color: '#244173', paddingTop: '15px', fontFamily: 'Montserrat', fontWeight: 'bold' }} className='text-center'>{value.topicName}<span onClick={() => this.editTopic(value)} style={{ fontSize: '20px' }} className='editSubject far fa-edit'></span></h4>
                                    </div>
                                )
                            })}
                        </GridPage>
                    </div>
            </div>
        )
    }
}