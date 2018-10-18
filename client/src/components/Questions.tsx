import * as React from 'react'
import NavbarC from './NavbarC'
import { IUserModel } from '../Shared/UserStorage'
import CurrentUserStorage from '../Shared/CurrentUserStorage'
import { SpringGrid, makeResponsive } from 'react-stonecutter'
import SubjectStorage, { ISubjectModel } from '../Shared/SubjectStorage'
import swal from 'sweetalert2'

const GridPage = makeResponsive(SpringGrid, { maxWidth: 1920 })

type State = {
    currentUser: IUserModel
    subjects: ISubjectModel[]
}

type Props = {
}

export default class Questions extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            currentUser: null,
            subjects: null
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
            const subjectToAdd: ISubjectModel = {
                id: this.state.subjects.length,
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
                    <div style={{ paddingLeft: '130px', paddingRight: '130px' }}>
                        <GridPage
                            component='ul'
                            columns={5}
                            columnWidth={240}
                            gutterWidth={15}
                            gutterHeight={20}
                            itemHeight={190}
                            springConfig={{ stiffness: 170, damping: 13 }}
                        >
                            <div>
                                <button className='newSubject' onClick={this.createNewSubject} style={{ background: 'none', border: 'none' }}><span style={{ color: '#244173', fontSize: '110px' }} className='far fa-plus-square'></span></button>
                                <h4 style={{ fontSize: '20px', color: '#244173', fontFamily: 'Montserrat', fontWeight: 'bold', paddingTop: '15px' }} className='text-center'>new</h4>
                            </div>
                            {this.state.subjects.map((value) => {
                                return (
                                    <div>
                                        <button className='newSubject' style={{ background: 'none', border: 'none' }}>
                                            <span style={{ color: '#244173', fontSize: '110px' }} className='fas fa-book'></span>
                                        </button>
                                        <h4 style={{ fontSize: '15px', color: '#244173', paddingTop: '15px', fontFamily: 'Montserrat', fontWeight: 'bold' }} className='text-center'>{value.subjectName}</h4>
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