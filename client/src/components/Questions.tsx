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

    createNewQuestion  = async () => {
    }

    deleteQuestion = (questionToDelete: IQuestionModel) => {
    }

    editQuestion = async (questionToEdit: IQuestionModel) => {
    }

    render() {
        if (!this.state.questions) {
            return <h1>loading...</h1>
        }
        return (
            <div>
                <NavbarC />
                <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold', paddingBottom: '30px' }} className='text-center'>{this.state.currentTopic.topicName}</h1>
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
                                <button className='newSubject' onClick={this.createNewQuestion} style={{ background: 'none', border: 'none' }}><span style={{ fontSize: '110px' }} className='far fa-plus-square newSubject'></span></button>
                                <h4 style={{ fontSize: '20px', color: '#244173', fontFamily: 'Montserrat', fontWeight: 'bold', paddingTop: '15px' }} className='text-center'>new</h4>
                            </div>
                            {this.state.questions.map((value) => {
                                if (this.state.currentTopic.id === value.idTopic)
                                return (
                                    <div key={value.id} className='text-center'>
                                        <span onClick={() => this.deleteQuestion(value)} style={{  fontSize: '22px' }} className='trashCan far fa-trash-alt float-right text-center'></span>
                                            <span style={{ fontSize: '110px' }} className='fas fa-question newTopic'></span>
                                        <h4 style={{ fontSize: '17px', color: '#244173', paddingTop: '15px', fontFamily: 'Montserrat', fontWeight: 'bold' }} className='text-center'>{value.questionName}<span onClick={() => this.editQuestion(value)} style={{ fontSize: '20px' }} className='editSubject far fa-edit'></span></h4>
                                    </div>
                                )
                            })}
                        </GridPage>
                    </div>
            </div>
        )
    }
}