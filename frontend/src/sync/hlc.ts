export interface Hlc {
  physical: number;
  logical: number;
  nodeId: string;
}

export class HlcClock {
  private state: Hlc;

  constructor(nodeId: string) {
    this.state = { physical: Date.now(), logical: 0, nodeId };
  }

  tick(): Hlc {
    const now = Date.now();
    if (now > this.state.physical) {
      this.state = { ...this.state, physical: now, logical: 0 };
    } else {
      this.state = { ...this.state, logical: this.state.logical + 1 };
    }
    return { ...this.state };
  }

  recv(remote: Hlc): Hlc {
    const now = Date.now();
    const p = Math.max(now, this.state.physical, remote.physical);
    let l = 0;
    if (p === this.state.physical && p === remote.physical) l = Math.max(this.state.logical, remote.logical) + 1;
    else if (p === this.state.physical) l = this.state.logical + 1;
    else if (p === remote.physical) l = remote.logical + 1;
    this.state = { ...this.state, physical: p, logical: l };
    return { ...this.state };
  }
}

export function compareHlc(a: Hlc, b: Hlc): number {
  return a.physical - b.physical || a.logical - b.logical || a.nodeId.localeCompare(b.nodeId);
}
