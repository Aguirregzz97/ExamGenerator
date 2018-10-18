export interface IQuestionModel {
    question: string
    possibleAnswers: IPossibleAnswer[]
}

export interface IPossibleAnswer {
    answer: string
    isCorrect?: boolean
}

export default class QuestionStorage {
    private static getCacheKey() {
    }

    public static getQuestions() {
    }

    public static storeQuestions() {
    }
}