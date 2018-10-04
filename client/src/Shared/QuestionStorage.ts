export interface IQuestionModel {
    question: string
    possibleAnswers: IPossibleAnswer[]
}

export interface IPossibleAnswer {
    answer: string
    isCorrect?: boolean
}

export default class QuestionStorage {
    private static getCacheKey(userId: string): string {
        return 'QuestionsArray|' + userId
    }

    public static getQuestions(userId: string): Promise<IQuestionModel[]> {
        const s: string = localStorage.getItem(QuestionStorage.getCacheKey(userId))
        if (!s) {
            return Promise.resolve([])
        }
        const questions: IQuestionModel[] = JSON.parse(s)
        return Promise.resolve(questions)
    }

    public static storeQuestions(questions: IQuestionModel[], userId: string): Promise<void> {
        const s: string = JSON.stringify(questions)
        localStorage.setItem(QuestionStorage.getCacheKey(userId), s)
        return Promise.resolve()
    }
}