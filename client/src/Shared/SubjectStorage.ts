export interface ISubjectModel {
    id: number
    subjectName: string
}

export default class SubjectStorage {

    private static getCacheKey(id: number): string {
        return 'subjectStorage | ' + id.toString()
    }

    public static getSubjects(idCurrentUser: number): Promise<ISubjectModel[]> {
        const s: string = localStorage.getItem(SubjectStorage.getCacheKey(idCurrentUser))
        if (!s) {
            return Promise.resolve([])
        }
        const subjects: ISubjectModel[] = JSON.parse(s)
        return Promise.resolve(subjects)
    }

    public static storeSubjects(subjects: ISubjectModel[], idCurrentUser: number): Promise<void> {
        const s: string = JSON.stringify(subjects)
        localStorage.setItem(SubjectStorage.getCacheKey(idCurrentUser), s)
        return Promise.resolve()
    }
}