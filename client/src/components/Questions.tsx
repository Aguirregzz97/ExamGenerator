import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import SubjectStorage, { ISubjectModel } from '../Shared/SubjectStorage'
import TopicStorage, { ITopicModel } from '../Shared/TopicStorage'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import swal from 'sweetalert2'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import QuestionStorage, { IQuestionModel } from '../Shared/QuestionStorage'


const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })


type State = {
    currentUser: IUserModel
    questions: IQuestionModel[]
    currentTopic: ITopicModel
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
            currentTopic: null
        }
    }

    async componentDidMount() {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        const currentQuestionsC: IQuestionModel[] = await QuestionStorage.getQuestions(currentUserC.id)
        let currentTopicsC: ITopicModel[] = await TopicStorage.getTopics(currentUserC.id)
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
            currentTopic: currentTopicC
        })
    }

    createNewQuestion = async () => {
    }

    deleteQuestion = (questionToDelete: IQuestionModel) => {
    }

    editQuestion = async (questionToEdit: IQuestionModel) => {
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
                            <span onClick={this.createNewQuestion} style={{ fontSize: '50px', paddingLeft: '40px' }} className='fas fa-plus-circle newSubject'></span>
                        </div>
                        <div className='col-6'>
                            <form className='form-inline float-right'>
                                <input className='form-control' type='text' placeholder='Search' aria-label='Search' />
                                <i style={{ paddingLeft: '10px', color: '#244173' }} className='fa fa-search' aria-hidden='true'></i>
                            </form>
                        </div>
                    </div>
                </div>
                {
                    this.state.questions.map((element, index) => {
                        if (this.state.currentTopic.id === element.idTopic) {
                            return (
                                <div></div>
                            )
                        }
                    })
                }
            </div>
        )
    }
}