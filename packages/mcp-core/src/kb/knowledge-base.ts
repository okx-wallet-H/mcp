export class KnowledgeBase {
  private docs = new Map();
  addDoc(doc: any) { const id = kb_; this.docs.set(id, { ...doc, id }); return id; }
  search(q: string) { return Array.from(this.docs.values()).filter((d: any) => d.title?.includes(q) || d.content?.includes(q)); }
  getStats() { return { total: this.docs.size }; }
}
