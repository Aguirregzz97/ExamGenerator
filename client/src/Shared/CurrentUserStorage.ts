import { IUserModel } from './UserStorage'

export default class CurrentUserStorage {

    private static getCacheKey(): string {
        return 'CurrentUser'
    }

    public static removeCurrentUser(): void {
        window.localStorage.removeItem(this.getCacheKey())
    }

    public static getUser(): Promise<IUserModel> {
        const s: string = localStorage.getItem(CurrentUserStorage.getCacheKey())
        if (!s) {
            let a: IUserModel
            return Promise.resolve(a)
        }
        const user: IUserModel = JSON.parse(s)
        return Promise.resolve(user)
    }

    public static storeCurrentUser(user: IUserModel): Promise<void> {
        const s: string = JSON.stringify(user)
        localStorage.setItem(CurrentUserStorage.getCacheKey(), s)
        return Promise.resolve()
    }

}