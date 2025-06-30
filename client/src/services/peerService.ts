import Peer, { type MediaConnection } from 'peerjs';

class PeerService {
    private peer: Peer | null = null;

    constructor() { }

    initPeer(id: string): Peer {
        this.peer = new Peer(id);

        this.peer.on('error', (err) => {
            console.error('Peer error:', err);
        });

        return this.peer;
    }

    getPeer(): Peer | null {
        return this.peer;
    }

    onOpen(callback: (id: string) => void): Peer | null {
        if (!this.peer) return null;
        
        return this.peer.on('open', callback);
    }

    call(peerId: string, stream?: MediaStream | null): MediaConnection | null {
        if (!this.peer) return null;

        return stream ? this.peer.call(peerId, stream) : this.peer.call(peerId, new MediaStream());
    }

    onCall(callback: (call: MediaConnection) => void) {
        if (!this.peer) return;
        this.peer.on('call', callback);
    }

    destroy() {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }
    }
}

export default PeerService;