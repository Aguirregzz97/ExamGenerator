import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import ExamStorage, { IExamsModel } from '../Shared/ExamStorage'
import { TeachingBubble } from 'office-ui-fabric-react/lib/TeachingBubble'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import swal from 'sweetalert2'
import { TooltipHost } from 'office-ui-fabric-react/lib/Tooltip'


const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })


type State = {
    currentUser: IUserModel
    exams: IExamsModel[]
    isTeachingBubbleVissible: boolean
}

type Props = {
}

export default class Exams extends React.Component<Props, State> {
    private _menuButtonElement: HTMLElement
    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            exams: null,
            isTeachingBubbleVissible: false
        }
    }

    async componentDidMount() {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        if (currentUserC === undefined) {
            this.setState({
                isTeachingBubbleVissible: true
            })
            return
        }
        const currentExamsC: IExamsModel[] = await ExamStorage.getExams(currentUserC.id)
        this.setState({
            currentUser: currentUserC,
            exams: currentExamsC,
        })
        if (currentExamsC.length === 0) {
            this.setState({
                isTeachingBubbleVissible: true
            })
        }
    }

    createNewExam = async () => {
        const { value: examInput } = await swal({
            title: 'Input exam name',
            input: 'text',
            inputPlaceholder: 'Enter your new exam name!'
        })
        if (examInput) {
            await swal({
                type: 'success',
                title: 'Your exam was created!',
                showConfirmButton: false,
                timer: 1500
            })
            let newID: number = 0
            this.state.exams.forEach((element) => {
                if (element.id >= newID) {
                    newID = element.id + 1
                }
            })
            const examToAdd: IExamsModel = {
                id: newID,
                name: examInput,
                questions: []
            }
            const newExams = [...this.state.exams, examToAdd]
            await ExamStorage.storeExams(newExams, this.state.currentUser.id)
        }
        if (ExamStorage) {
            window.location.reload()
        }
    }

    deleteExam = (examToDelete: IExamsModel) => {
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
                    this.state.exams.forEach((element, index) => {
                        if (examToDelete.id === element.id) {
                            this.state.exams.splice(index, 1)
                            ExamStorage.storeExams(this.state.exams, this.state.currentUser.id)
                            swal({
                                type: 'success',
                                title: 'Deleted!',
                                text: 'Your subject ' + examToDelete.name + ' has ben deleted',
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

    editExam = async (examToEdit: IExamsModel) => {
        const { value: examInput } = await swal({
            title: 'Input new exam name',
            input: 'text',
            inputPlaceholder: 'Enter your new exam!'
        })
        if (examInput) {
            this.state.exams.forEach((element) => {
                if (element.id === examToEdit.id) {
                    element.name = examInput
                    ExamStorage.storeExams(this.state.exams, this.state.currentUser.id)
                    swal({
                        type: 'success',
                        title: 'succesfully chnaged exam name',
                        text: 'Your exam ' + examToEdit.name + ' has been edited to ' + examInput,
                        timer: 1500,
                        showConfirmButton: false,
                        onClose: () => { window.location.reload() }
                    })
                }
            })
        }
    }

    _onDismiss = (ev: any) => {
        this.setState({
            isTeachingBubbleVissible: !this.state.isTeachingBubbleVissible
        })
    }

    render() {
        if (!this.state.currentUser) {
            return (
                <div>
                    <NavbarC />
                    <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold', paddingBottom: '30px' }} className='text-center'>EXAMS</h1>
                    <span className='ms-TeachingBubbleBasicExample-buttonArea'
                        ref={menuButton => (this._menuButtonElement = menuButton!)}>
                    </span>
                    {this.state.isTeachingBubbleVissible ? (
                        <div>
                            <TeachingBubble
                                targetElement={this._menuButtonElement}
                                hasCondensedHeadline={true}
                                onDismiss={this._onDismiss}
                                hasCloseIcon={true}
                                headline='You are not logged in!'
                            >
                                In order to create questions you need to log in first
                        </TeachingBubble>
                        </div>
                    ) : null}
                </div>
            )
        }
        return (
            <div>
                <NavbarC />
                <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold', paddingBottom: '30px' }} className='text-center'>EXAMS</h1>
                <div style={{ paddingLeft: '100px', paddingRight: '100px' }}>
                    <GridPage
                        component='ul'
                        columns={5}
                        columnWidth={240}
                        gutterWidth={15}
                        gutterHeight={20}
                        itemHeight={190}
                        springConfig={{ stiffness: 170, damping: 22 }}
                    >
                        <div>
                            <span className='ms-TeachingBubbleBasicExample-buttonArea'
                                ref={menuButton => (this._menuButtonElement = menuButton!)}>
                                <TooltipHost content='New blank exam!' id='myID' calloutProps={{ gapSpace: 85 }}>
                                    <span onClick={this.createNewExam} style={{ fontSize: '110px' }} className='fas fa-plus-circle newSubject'></span>
                                </TooltipHost>
                            </span>
                            <h4 style={{ fontSize: '20px', color: '#244173', fontFamily: 'Montserrat', fontWeight: 'bold', paddingTop: '15px' }} className='text-center'>new</h4>
                        </div>
                        {this.state.exams.map((value) => {
                            return (
                                <div key={value.id} className='text-center'>
                                    <TooltipHost content='Add questions to you exam!' id='myID' calloutProps={{ gapSpace: 85 }}>
                                        <Link to={'/Exam' + value.id}><span style={{ fontSize: '110px', paddingRight: '15px', paddingLeft: '5px' }} className='far fa-question-circle newSubject text-center'></span></Link>
                                    </TooltipHost>
                                    <TooltipHost content='preview of you exam!' id='myID' calloutProps={{ gapSpace: 85 }}>
                                        <Link to={'/ExPreview' + value.id}><span style={{ fontSize: '110px', paddingRight: '5px', paddingLeft: '5px' }} className='far fa-file-pdf newSubject text-center'></span></Link>
                                    </TooltipHost>
                                    <span onClick={() => this.deleteExam(value)} style={{ fontSize: '22px' }} className='trashCan far fa-trash-alt float-right text-center'></span>
                                    <h4 style={{ fontSize: '17px', color: '#244173', paddingTop: '15px', fontFamily: 'Montserrat', fontWeight: 'bold' }} className='text-center'>{value.name}<span onClick={() => this.editExam(value)} style={{ fontSize: '20px' }} className='editSubject far fa-edit'></span></h4>
                                </div>
                            )
                        })}
                    </GridPage>
                </div>
                {this.state.isTeachingBubbleVissible ? (
                    <div>
                        <TeachingBubble
                            targetElement={this._menuButtonElement}
                            hasCondensedHeadline={true}
                            onDismiss={this._onDismiss}
                            hasCloseIcon={true}
                            headline='You currently have no exams!'
                        >
                            Your account is currently empty, to add exams, first create a questions in the create questions section and add away!
                                 </TeachingBubble>
                    </div>
                ) : null}
            </div>
        )
    }
}