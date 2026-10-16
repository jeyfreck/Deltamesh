export interface HlcTimestamp {
  wallTime: number;
  counter: number;
  nodeId: string;
}

export class ClientHlc {
  private nodeId: string;
  private wallTime: number;
  private counter: number;

  constructor(nodeId?: string) {
    this.nodeId = nodeId || `client-${Math.random().toString(36).substring(2, 9)}`;
    this.wallTime = Date.now();
    this.counter = 0;
  }

  public getNodeId(): string {
    return this.nodeId;
  }

  public now(): HlcTimestamp {
    const phys = Date.now();
    if (phys > this.wallTime) {
      this.wallTime = phys;
      this.counter = 0;
    } else {
      this.counter += 1;
    }
    return {
      wallTime: this.wallTime,
      counter: this.counter,
      nodeId: this.nodeId,
    };
  }

  public receive(remote: HlcTimestamp): HlcTimestamp {
    const phys = Date.now();
    const maxWall = Math.max(this.wallTime, remote.wallTime, phys);

    if (maxWall === this.wallTime && maxWall === remote.wallTime) {
      this.counter = Math.max(this.counter, remote.counter) + 1;
    } else if (maxWall === this.wallTime) {
      this.counter += 1;
    } else if (maxWall === remote.wallTime) {
      this.counter = remote.counter + 1;
    } else {
      this.counter = 0;
    }

    this.wallTime = maxWall;
    return {
      wallTime: this.wallTime,
      counter: this.counter,
      nodeId: this.nodeId,
    };
  }
}

export const localClock = new ClientHlc();
