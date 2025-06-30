import type { HTTPResponse } from "../common/commonTypes";
import Cookies from 'js-cookie'

export default class ApiClient {
    baseUrl: string;
    private access_token: string | undefined = undefined;

    setToken(access_token: string) {
        this.access_token = access_token;
    }

    getToken(): string | undefined {
        return this.access_token;
    }

    clearToken() {
        Cookies.remove('refresh_token');
        Cookies.remove('access_token');
        Cookies.remove('user');
        this.access_token = undefined;
    }

    constructor(baseUrl?: string) { this.baseUrl = baseUrl || "http://localhost:8080" };

    async findAll<V>(collection: string, filter?: Record<string, any>): Promise<V[]> {
        const query = filter ? '?' + new URLSearchParams(filter).toString() : '';
        return this.fetchData(`${this.baseUrl}/api/${collection.toLowerCase()}s${query}`);
    }

    async findById<V>(collection: string, id: string): Promise<V> {
        return this.fetchData(`${this.baseUrl}/api/${collection.toLowerCase()}s/${id}`);
    }

    async create<V>(collection: string, entity: Omit<V, '_id'>): Promise<V> {
        return this.fetchData(`${this.baseUrl}/api/${collection.toLowerCase()}s`, {
            method: 'POST',
            body: JSON.stringify(entity)
        });
    }

    async update<V>(collection: string, entity: V): Promise<V> {
        return this.fetchData(`${this.baseUrl}/api/${collection.toLowerCase()}s`, {
            method: 'PUT',
            body: JSON.stringify(entity)
        });
    }

    async deleteById<V>(collection: string, id: string): Promise<V> {
        return this.fetchData(`${this.baseUrl}/api/${collection.toLowerCase()}s/${id}`, {
            method: 'DELETE',
        });
    }

    private async fetchData<D>(url: string, options?: RequestInit): Promise<D> {
        const basicHeaders: HeadersInit = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.access_token}`
        };
        const mergedOptions: RequestInit = {
            ...options,
            credentials: 'include',
            headers: {
                ...basicHeaders,
                ...(options?.headers || {})
            }
        };
        const res = await fetch(url, mergedOptions);
        if (!res.ok) {
            const err: HTTPResponse = await res.json();
            if (res.status < 500) {
                throw err;
            } else console.error(err.message)
        }
        return res.json();
    }

    async request<D>(endpoint: string, options?: RequestInit): Promise<D> {
        return this.fetchData(`${this.baseUrl}/${endpoint}`, options);
    }

    async validateToken<D>(): Promise<D> {
        return this.fetchData(`${this.baseUrl}/auth/validate-token`, {
            method: "POST",
        });
    }
}