// AI Agent Runtime - v2

import { EventEmitter } from "events";

export class AgentRuntime extends EventEmitter {
  private tasks = new Map();
  private timers = new Map();
  private running = false;

  registerTask(task: any) { this.tasks.set(task.id, task); }
  start() { this.running = true; }
  stop() { this.running = false; this.timers.forEach(t => clearInterval(t)); }
  getTasks() { return Array.from(this.tasks.values()); }
}
