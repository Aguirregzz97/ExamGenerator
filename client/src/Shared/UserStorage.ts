
export interface IUserModel {
    id: number
    username: string
    password: string
}

export default class UserStroage {

    private static getCacheKey(): string {
        return 'Users'
    }

    public static getUsers(): Promise<IUserModel[]> {
        const s: string = localStorage.getItem(UserStroage.getCacheKey())
        if (!s) {
            return Promise.resolve([])
        }
        const users: IUserModel[] = JSON.parse(s)
        return Promise.resolve(users)
    }

    public static storeUsers(user: IUserModel[]): Promise<void> {
        const s: string = JSON.stringify(user)
        localStorage.setItem(UserStroage.getCacheKey(), s)
        return Promise.resolve()
    }

}