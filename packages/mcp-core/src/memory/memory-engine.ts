// ━━━━━ Memory Engine ━━━━━
// 对话记忆 + 上下文持久化 + 用户偏好

interface MemoryEntry {
  id: string;
  type: "conversation" | "preference" | "context" | "strategy";
  content: string;
  metadata: Record<string, unknown>;
  timestamp: number;
  ttl?: number; // ms, auto-expire
}

interface MemoryQuery {
  type?: string;
  keyword?: string;
  since?: number;
  limit?: number;
}

export class MemoryEngine {
  private store = new Map<string, MemoryEntry>();
  private nextId = 1;

  // ━━━━━ CRUD ━━━━━

  save(entry: Omit<MemoryEntry, "id" | "timestamp">): MemoryEntry {
    const id = `mem_${this.nextId++}`;
    const mem: MemoryEntry = { ...entry, id, timestamp: Date.now() };
    this.store.set(id, mem);
    if (mem.ttl) setTimeout(() => this.store.delete(id), mem.ttl);
    return mem;
  }

  get(id: string): MemoryEntry | undefined {
    return this.store.get(id);
  }

  query(q: MemoryQuery = {}): MemoryEntry[] {
    let results = Array.from(this.store.values());
    if (q.type) results = results.filter(m => m.type === q.type);
    if (q.keyword) results = results.filter(m => m.content.toLowerCase().includes(q.keyword!.toLowerCase()));
    if (q.since) results = results.filter(m => m.timestamp >= q.since!);
    results.sort((a, b) => b.timestamp - a.timestamp);
    if (q.limit) results = results.slice(0, q.limit);
    return results;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }

  clear(type?: string): void {
    if (type) {
      for (const [id, entry] of this.store) {
        if (entry.type === type) this.store.delete(id);
      }
    } else {
      this.store.clear();
    }
  }

  // ━━━━━ Convenience ━━━━━

  rememberConversation(role: "user" | "agent" | "system", content: string): MemoryEntry {
    return this.save({ type: "conversation", content, metadata: { role }, ttl: 86400000 }); // 24h
  }

  setPreference(key: string, value: unknown): MemoryEntry {
    return this.save({ type: "preference", content: `${key}:${JSON.stringify(value)}`, metadata: { key, value } });
  }

  getPreference(key: string): unknown {
    const entries = this.query({ type: "preference", keyword: key, limit: 1 });
    return entries[0]?.metadata.value;
  }

  saveContext(label: string, data: unknown): MemoryEntry {
    return this.save({ type: "context", content: label, metadata: { data }, ttl: 3600000 }); // 1h
  }

  getContext(label: string): unknown {
    const entries = this.query({ type: "context", keyword: label, limit: 1 });
    return entries[0]?.metadata.data;
  }

  getConversationHistory(limit = 20): MemoryEntry[] {
    return this.query({ type: "conversation", limit });
  }

  // ━━━━━ Stats ━━━━━

  getStats() {
    const all = Array.from(this.store.values());
    return {
      total: all.length,
      conversations: all.filter(m => m.type === "conversation").length,
      preferences: all.filter(m => m.type === "preference").length,
      contexts: all.filter(m => m.type === "context").length,
      strategies: all.filter(m => m.type === "strategy").length,
    };
  }
}
