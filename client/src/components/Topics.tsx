import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import { ISubjectModel } from '../Shared/SubjectStorage'
import TopicStorage, { ITopicModel } from '../Shared/TopicStorage'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import swal from 'sweetalert2'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { BrowserRouter as Router, Route } from 'react-router-dom'


const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })


type State = {
    currentUser: IUserModel
    topics: ITopicModel[]
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

export default class Home extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            topics: []
        }
    }

    async componentWillMount() {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        const currentTopicsC: ITopicModel[] = await TopicStorage.getTopics(currentUserC.id)
        this.setState({
            currentUser: currentUserC,
            topics: currentTopicsC
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
                idSubject: 1,
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
    }

    editTopic = (topicToEdit: ITopicModel) => {
    }

    render() {
        console.log(this.props.match.params)
        return (
            <div>
                <NavbarC />
                <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold', paddingBottom: '30px' }} className='text-center'>subjectName</h1>
                    <div style={{ paddingLeft: '100px', paddingRight: '100px' }}>
                        <GridPage
                            component='ul'
                            columns={5}
                            columnWidth={220}
                            gutterWidth={15}
                            gutterHeight={20}
                            itemHeight={190}
                            springConfig={{ stiffness: 170, damping: 13 }}
                        >
                            <div>
                                <button className='newSubject' onClick={this.createNewTopic} style={{ background: 'none', border: 'none' }}><span style={{ fontSize: '110px' }} className='far fa-plus-square newSubject'></span></button>
                                <h4 style={{ fontSize: '20px', color: '#244173', fontFamily: 'Montserrat', fontWeight: 'bold', paddingTop: '15px' }} className='text-center'>new</h4>
                            </div>
                            {this.state.topics.map((value) => {
                                if (1 === value.idSubject)
                                return (
                                    <div key={value.id} className='text-center'>
                                        <span onClick={() => this.deleteTopic(value)} style={{  fontSize: '22px' }} className='trashCan far fa-trash-alt float-right text-center'></span>
                                        <button className='newSubject'>
                                            <span style={{ fontSize: '110px' }} className='fas fa-file-alt'></span>
                                        </button>
                                        <h4 style={{ fontSize: '17px', color: '#244173', paddingTop: '15px', fontFamily: 'Montserrat', fontWeight: 'bold' }} className='text-center'>{value.topicName}<span onClick={() => this.editTopic(value)} style={{  fontSize: '20px' }} className='editSubject far fa-edit'></span></h4>
                                    </div>
                                )
                            })}
                        </GridPage>
                    </div>
            </div>
        )
    }
}