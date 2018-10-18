import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import SubjectStorage, { ISubjectModel } from '../Shared/SubjectStorage'
import swal from 'sweetalert2'
import Topics from './Topics'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })


type State = {
    currentUser: IUserModel
    subjects: ISubjectModel[]
    subjectToGo: ISubjectModel
}

type Props = {
}

export default class Subjects extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            subjects: null,
            subjectToGo: null
        }
    }

    async componentWillMount() {
        const currentUserC: IUserModel = await CurrentUserStorage.getUser()
        const currentSubjectsC: ISubjectModel[] = await SubjectStorage.getSubjects(currentUserC.id)
        this.setState({
            currentUser: currentUserC,
            subjects: currentSubjectsC
        })
    }

    goToSubjects = (subjectToGoV: ISubjectModel) => {
        this.setState({
            subjectToGo: subjectToGoV
        })
    }

    editSubject = async (subject: ISubjectModel) => {

        const { value: subjectInput } = await swal({
            title: 'Input new subject name',
            input: 'text',
            inputPlaceholder: 'Enter your new subject!'
        })
        if (subjectInput) {
            this.state.subjects.forEach((element) => {
                if (element.id === subject.id) {
                    element.subjectName = subjectInput
                    SubjectStorage.storeSubjects(this.state.subjects, this.state.currentUser.id)
                    swal({
                        type: 'success',
                        title: 'succesfully chnaged subject name',
                        text: 'Your subject ' + subject.subjectName + ' has been edited to ' + subjectInput,
                        timer: 1500,
                        showConfirmButton: false,
                        onClose: () => { window.location.reload() }
                    })
                }
            })
        }


    }

    deleteSubject = (subject: ISubjectModel) => {
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
                    this.state.subjects.forEach((element, index) => {
                        if (subject.id === element.id) {
                            this.state.subjects.splice(index, 1)
                            SubjectStorage.storeSubjects(this.state.subjects, this.state.currentUser.id)
                            swal({
                                type: 'success',
                                title: 'Deleted!',
                                text: 'Your subject ' + subject.subjectName + ' has ben deleted',
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

    createNewSubject = async () => {
        const { value: subjectInput } = await swal({
            title: 'Input Subject',
            input: 'text',
            inputPlaceholder: 'Enter your new subject!'
        })
        if (subjectInput) {
            await swal({
                type: 'success',
                title: 'Your subject was created!',
                showConfirmButton: false,
                timer: 1500
            })
            let newID: number = 0
            this.state.subjects.forEach((element) => {
                if (element.id >= newID) {
                    newID = element.id + 1
                }
            })
            const subjectToAdd: ISubjectModel = {
                id: newID,
                subjectName: subjectInput
            }
            const newSubjects = [...this.state.subjects, subjectToAdd]
            await SubjectStorage.storeSubjects(newSubjects, this.state.currentUser.id)
        }
        if (SubjectStorage) {
            window.location.reload()
        }
    }


    render() {
        if (!this.state.subjects) {
            return <h1>loading...</h1>
        }
        if (this.state.subjects) {
            return (
                <div>
                    <NavbarC />
                    <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold', paddingBottom: '30px' }} className='text-center'>SUBJECTS</h1>
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
                                <span onClick={this.createNewSubject} style={{ fontSize: '110px' }} className='far fa-plus-square newSubject'></span>
                                <h4 style={{ fontSize: '20px', color: '#244173', fontFamily: 'Montserrat', fontWeight: 'bold', paddingTop: '15px' }} className='text-center'>new</h4>
                            </div>
                            {this.state.subjects.map((value) => {
                                return (
                                    <div key={value.id} className='text-center'>
                                    <Router>
                                        <Link to='/Topics'><span onClick={() => this.goToSubjects(value)} style={{ fontSize: '110px', paddingRight: '5px', paddingLeft: '5px' }} className='fas fa-book newSubject text-center'></span></Link>
                                    </Router>
                                        <span onClick={() => this.deleteSubject(value)} style={{ fontSize: '22px' }} className='trashCan far fa-trash-alt float-right text-center'></span>
                                        <h4 style={{ fontSize: '17px', color: '#244173', paddingTop: '15px', fontFamily: 'Montserrat', fontWeight: 'bold' }} className='text-center'>{value.subjectName}<span onClick={() => this.editSubject(value)} style={{ fontSize: '20px' }} className='editSubject far fa-edit'></span></h4>
                                    </div>
                                )
                            })}
                        </GridPage>
                    </div>
                </div>
            )
        }

    }
}