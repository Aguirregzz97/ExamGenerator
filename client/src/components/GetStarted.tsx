import * as React from 'react'
import { Fabric } from 'office-ui-fabric-react'


type State = {
}

type Props = {
}

export default class GetStarted extends React.Component<Props, State> {

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div className='colorBlue' style={{ height: '300px' }}>
                    <h1 style={{ color: 'white', fontFamily: 'Montserrat', fontSize: '30px', paddingTop: '50px' }} className='text-center'>Generating exams has never been easier</h1>
                    <div className='text-center'>
                        <button className='btn text-center'>Get started</button>
                    </div>
                </div>
            </div>
        )
    }
}