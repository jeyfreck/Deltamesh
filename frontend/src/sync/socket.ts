export class ReconnectingSocket {
  private ws?: WebSocket;
  private attempt = 0;
  private closed = false;

  constructor(
    private url: string,
    private onMessage: (data: ArrayBuffer) => void,
    private onOpen?: () => void,
  ) {}

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = () => {
      this.attempt = 0;
      this.onOpen?.();
    };
    this.ws.onmessage = (e) => this.onMessage(e.data as ArrayBuffer);
    this.ws.onclose = () => {
      if (this.closed) return;
      const delay = Math.min(30000, 500 * 2 ** this.attempt++) * (0.5 + Math.random() / 2);
      setTimeout(() => this.connect(), delay);
    };
  }

  send(data: ArrayBufferLike | Uint8Array): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) return false;
    this.ws.send(data as ArrayBuffer);
    return true;
  }

  close() {
    this.closed = true;
    this.ws?.close();
  }
}
