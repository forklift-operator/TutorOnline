import { io, Socket } from "socket.io-client";

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;

    constructor() {}

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public getSocket(): Socket | null {
        if (this.socket) return this.socket
        return null;
    }

    public connect(url: string, options?: any): void {
        if (!this.socket) {
            this.socket = io(url, options);
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    public on(event: string, callback: (...args: any[]) => void): void {
        this.socket?.on(event, callback);
    }

    public off(event: string, callback?: (...args: any[]) => void): void {
        if (callback) {
            this.socket?.off(event, callback);
        } else {
            this.socket?.off(event);
        }
    }

    public emit(event: string, ...args: any[]): void {
        this.socket?.emit(event, ...args);
    }

    public joinRoom(...args: any[]): void {
        this.socket?.emit('join_room', ...args);
    }

    public isConnected(): boolean {
        return !!this.socket && this.socket.connected;
    }
}

export default SocketService;