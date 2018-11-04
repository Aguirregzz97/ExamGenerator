import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import SubjectStorage, { ISubjectModel } from '../Shared/SubjectStorage'
import TopicStorage, { ITopicModel } from '../Shared/TopicStorage'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import swal from 'sweetalert2'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ExamStorage, { IExamsModel } from '../Shared/ExamStorage'
import QuestionStorage, { IQuestionModel } from '../Shared/QuestionStorage'
import { Dropdown, IDropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown'

type State = {
    currentUser: IUserModel
    currentExam: IExamsModel
    subjects: ISubjectModel[]
    topics: ITopicModel[]
    questions: IQuestionModel[]
    currentSelectedSubject: ISubjectModel
    selectedSubjectOption?: { key: string | number | undefined }
    currentSelectedTopic: ITopicModel
    selectedTopicOption?: { key: string | number | undefined }
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

export default class InsideExam extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            currentExam: null,
            subjects: null,
            topics: null,
            questions: null,
            currentSelectedSubject: null,
            selectedSubjectOption: undefined,
            currentSelectedTopic: null,
            selectedTopicOption: undefined
        }
    }

    async componentDidMount() {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        const currentExamsC: IExamsModel[] = await ExamStorage.getExams(currentUserC.id)
        const subjects: ISubjectModel[] = await SubjectStorage.getSubjects(currentUserC.id)
        const topics: ITopicModel[] = await TopicStorage.getTopics(currentUserC.id)
        const questions: IQuestionModel[] = await QuestionStorage.getQuestions(currentUserC.id)
        let currentExamC: IExamsModel
        let idToCheck: any = this.props.match.params.id
        currentExamsC.forEach(element => {
            if (parseInt(idToCheck) === element.id) {
                currentExamC = element
            }
        })
        this.setState({
            currentUser: currentUserC,
            currentExam: currentExamC,
            subjects: subjects,
            topics: topics,
            questions: questions,
            currentSelectedSubject: subjects[0]
        })
    }

    public changeStateSubjects = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        console.log('here is the things updating...' + item.key + ' ' + item.text + ' ' + item.selected)
        this.state.subjects.forEach(element => {
            if (element.id === item.key) {
                this.setState({
                    currentSelectedSubject: element
                })
                return
            }
        })
      }


    public changeStateTopics = (event: React.FormEvent<HTMLDivElement>, item: IDropdownOption): void => {
        console.log('here is the things updating...' + item.key + ' ' + item.text + ' ' + item.selected)
        this.state.topics.forEach(element => {
            if (element.id === item.key) {
                this.setState({
                    currentSelectedTopic: element
                })
                return
            }
        })
      }

    render() {
        if (!this.state.currentExam || !this.state.subjects || !this.state.topics || !this.state.questions || !this.state.currentSelectedSubject) {
            return <h1>loading...</h1>
        }
        return (
            <div>
                <NavbarC />
                <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold', paddingBottom: '30px' }} className='text-center'>{this.state.currentExam.name}</h1>
                <div style={{ paddingLeft: '40px', paddingRight: '40px' }} className='row'>
                    <div style={{paddingRight: '30px', paddingLeft: '30px'}} className='col-md-3'>
                        <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold' }} className='text-center'>1</h1>
                        <h5 style={{ paddingBottom: '10px' }} className='text-center'>Select subject</h5>
                        <Dropdown
                            id='Basicdrop1'
                            selectedKey={this.state.selectedSubjectOption ? this.state.selectedSubjectOption.key : undefined}
                            onChange={this.changeStateSubjects}
                            placeHolder='Select an Option'
                            options={
                                this.state.subjects.map((value) => {
                                    return { key: value.id, text: value.subjectName }
                                })
                            }
                        />
                    </div>
                    <div style={{paddingRight: '30px', paddingLeft: '30px'}} className='col-md-3'>
                        <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold' }} className='text-center'>2</h1>
                        <h5 style={{ paddingBottom: '10px' }} className='text-center'>Select topic</h5>
                        <Dropdown
                            selectedKey={this.state.selectedTopicOption ? this.state.selectedTopicOption.key : undefined}
                            onChange={this.changeStateSubjects}
                            placeHolder='Select an Option'
                            options={
                                this.state.topics.map((value) => {
                                    return this.state.currentSelectedSubject.id === value.id ? { key: value.id, text: value.topicName } : null
                                })
                            }
                        />
                    </div>
                    <div className='col-md-3'>
                    </div>
                    <div className='col-md-3'>
                    </div>
                </div>
            </div>
        )
    }
}