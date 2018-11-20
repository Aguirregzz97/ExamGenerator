
export interface IAnswerSheet {
    answer: string
}

export default class CurrentAnswerSheetStorage {

    private static getCacheKey(): string {
        return 'CurrentAnswerSheet'
    }

    public static removeCurrentAnswerSheet(): void {
        window.localStorage.removeItem(this.getCacheKey())
    }

    public static getAnswerSheet(): Promise<IAnswerSheet[]> {
        const s: string = localStorage.getItem(CurrentAnswerSheetStorage.getCacheKey())
        if (!s) {
            let a: IAnswerSheet[]
            return Promise.resolve(a)
        }
        const answers: IAnswerSheet[] = JSON.parse(s)
        return Promise.resolve(answers)
    }

    public static storeCurrentAnswerSheet(answerSheet: IAnswerSheet[]): Promise<void> {
        const s: string = JSON.stringify(answerSheet)
        localStorage.setItem(CurrentAnswerSheetStorage.getCacheKey(), s)
        return Promise.resolve()
    }

}