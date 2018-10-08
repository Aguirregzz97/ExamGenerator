
export interface IUserModel {
    id: number
    username: string
    password: string
}

export default class UserStroage {

    private static getCacheKey(userId: number): string {
        return 'UserID:' + userId
    }

    public static getUsers(userId: number): Promise<IUserModel[]> {
        const s: string = localStorage.getItem(UserStroage.getCacheKey(userId))
        if (!s) {
            return Promise.resolve([])
        }
        const users: IUserModel[] = JSON.parse(s)
        return Promise.resolve(users)
    }

    public static storeUsers(user: IUserModel, userId: number) {
        const s: string = JSON.stringify(user)
        localStorage.setItem(UserStroage.getCacheKey(userId), s)
        return Promise.resolve
    }

}