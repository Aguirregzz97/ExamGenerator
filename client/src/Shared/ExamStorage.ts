import { IQuestionModel } from './QuestionStorage'

export interface IExamsModel {
    id: number
    name: string
    questions: IQuestionModel[]
}

export default class ExamStorage {
    private static getCacheKey(id: number): string {
        return 'ExamStorage | ' + id.toString()
    }

    public static getExams(idCurrentUser: number): Promise<IExamsModel[]> {
        const s: string = localStorage.getItem(ExamStorage.getCacheKey(idCurrentUser))
        if (!s) {
            return Promise.resolve([])
        }
        const exams: IExamsModel[] = JSON.parse(s)
        return Promise.resolve(exams)
    }

    public static storeExams(exams: IExamsModel[], idCurrentUser: number): Promise<void> {
        const s: string = JSON.stringify(exams)
        localStorage.setItem(ExamStorage.getCacheKey(idCurrentUser), s)
        return Promise.resolve()
    }
}