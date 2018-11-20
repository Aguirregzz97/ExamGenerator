import * as React from 'react'
import CurrentAnswerSheetStorage, { IAnswerSheet } from '../Shared/AnswerSheetStorage'

type State = {
    currentAnswers: IAnswerSheet[]
    showButtons: boolean
}

type Props = {
}

export default class AnswerSheet extends React.Component<Props, State> {

    constructor(props) {
        super(props)
        this.state = {
            currentAnswers: null,
            showButtons: true,
        }
    }

    async componentDidMount() {
        const answerSheet: IAnswerSheet[] = await CurrentAnswerSheetStorage.getAnswerSheet()
        this.setState({
            currentAnswers: answerSheet
        })
    }

    buttonPrint = () => {
        if (this.state.showButtons) {
            return (
                <div className='text-center'>
                    <button style={{ marginTop: '30px' }} onClick={this.clickPrint} className='btn btn-primary text-center'>print / save</button>
                </div>
            )
        }
    }

    clickPrint = () => {
        this.setState({
            showButtons: false
        }, async () => {
            await window.print()
            this.setState({
                showButtons: true
            })
        })
    }

    render() {
        if (!this.state.currentAnswers) {
            return <h1>loading...</h1>
        }
        return (
            <div>
                <h1 style={{ color: '#244173', fontFamily: 'Montserrat', fontSize: '40px', paddingTop: '30px', fontWeight: 'bold', paddingBottom: '30px' }} className='text-center'>Answer Sheet</h1>
                <div className='row'>
                    <div className=''></div>
                    <div className='col-12'>
                        {this.state.currentAnswers.map((element, questionNumber: number = 0) => {
                            { questionNumber++ }
                            return (
                                <div>
                                    <div className=''>
                                        <li style={{ fontSize: '25px', fontWeight: 'bold' }} className='list-group-item'><span className='float-left'>{questionNumber}:</span>&nbsp;&nbsp;{element.answer})</li>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>
                    <div className=''></div>
                </div>
                {this.buttonPrint()}
            </div>
        )
    }
}