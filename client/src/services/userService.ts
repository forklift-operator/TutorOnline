import { type IUser } from "../../../server/src/db/model/userModel";
import type { Credentials, HTTPResponse } from "../common/commonTypes";
import type ApiClient from "./apiClient";
import Cookies from "js-cookie";

export default class UserService {
    private apiClient: ApiClient;
    constructor(apiClient: ApiClient) { this.apiClient = apiClient };

    async findAll(filter: any): Promise<IUser[]> { // make the filter model with tags, limit, whatever
        return this.apiClient.findAll('user', filter);
    }

    async findById(id: string): Promise<IUser> {
        return this.apiClient.findById('user', id);
    }

    async create(user: Omit<IUser,'_id'>): Promise<IUser> {
        return this.apiClient.create('user', user);
    }

    async update(user: IUser): Promise<IUser> {
        return this.apiClient.update('user', user);
    }

    async deleteById(id: string): Promise<IUser> {
        return this.apiClient.deleteById('user', id);
    }

    // auth 
    async login(credentials: Credentials): Promise<IUser> {
        const data = await this.apiClient.request<HTTPResponse>('auth/login', {
            method: 'POST',
            body: JSON.stringify({ credentials })
        });

        if (data.access_token && data.user) {
            this.apiClient.setToken(data.access_token);
            Cookies.set("user", JSON.stringify(data.user));
            return data.user;
        }
        throw new Error(data.message);
    }

    async register(user: Omit<IUser, '_id'>): Promise<IUser> {
        const data = await this.apiClient.request<HTTPResponse>('auth/register', {
            method: 'POST',
            body: JSON.stringify({ user })
        });

        if (data.access_token && data.user) {
            this.apiClient.setToken(data.access_token);
            Cookies.set("user", JSON.stringify(data.user));

            return data.user;
        }
        throw new Error("Register failed: user data not returned.");
    }
}
