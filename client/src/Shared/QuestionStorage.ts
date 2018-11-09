export interface IVariableModel {
    variableName: string
    lowerBound: number
    upperBound: number
    variableValue?: number
}

export interface IQuestionModel {
    id: number
    possibleAnswers: IPossibleAnswer[]
    idTopic: number
    questionName: string
    variables?: IVariableModel[]
}

export interface IPossibleAnswer {
    answer: string
    isCorrect?: boolean
}

export default class QuestionStorage {
    private static getCacheKey(id: number): string {
        return 'questionStorage | ' + id.toString()
    }

    public static getQuestions(idCurrentUser: number): Promise<IQuestionModel[]> {
        const s: string = localStorage.getItem(QuestionStorage.getCacheKey(idCurrentUser))
        if (!s) {
            return Promise.resolve([])
        }
        const questions: IQuestionModel[] = JSON.parse(s)
        return Promise.resolve(questions)
    }

    public static storeQuestions(questions: IQuestionModel[], idCurrentUser: number): Promise<void> {
        const s: string = JSON.stringify(questions)
        localStorage.setItem(QuestionStorage.getCacheKey(idCurrentUser), s)
        return Promise.resolve()
    }
}