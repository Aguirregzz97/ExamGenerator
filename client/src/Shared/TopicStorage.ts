export interface ITopicModel {
    id: number
    idSubject: number
    topicName: string
}

export default class TopicStorage {

    private static getCacheKey(id: number): string {
        return 'topicStorage |' + id.toString()
    }

    public static getTopics(idCurrentUser: number): Promise<ITopicModel[]> {
        const s: string = localStorage.getItem(TopicStorage.getCacheKey(idCurrentUser))
        if (!s) {
            return Promise.resolve([])
        }
        const topics: ITopicModel[] = JSON.parse(s)
        return Promise.resolve(topics)
    }

    public static storeSubjects(topics: ITopicModel[], idCurrentUser: number): Promise<void> {
        const s: string = JSON.stringify(topics)
        localStorage.setItem(TopicStorage.getCacheKey(idCurrentUser), s)
        return Promise.resolve()
    }
}