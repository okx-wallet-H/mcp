import { EventEmitter } from "events";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { BUILTIN_PLUGINS } from "./types.js";

export class PluginManager extends EventEmitter {
  private plugins = new Map();
  private tools = new Map();
  private resources = new Map();
  private clients = new Map();

  async loadPlugin(manifest: any) {
    const id = ${manifest.module}:;
    const status = { id, manifest, status: "loading", toolCount:0, resourceCount:0, uptime:0 };
    this.plugins.set(id, status);
    try {
      if (manifest.transport === "stdio") {
        const transport = new StdioClientTransport({ command: manifest.endpoint, args: manifest.args || [], env: manifest.env });
        const client = new Client({ name: "okx-mcp", version: "2.0" }, { capabilities: {} });
        await client.connect(transport);
        try { const t = await client.listTools(); status.toolCount = t.tools.length; t.tools.forEach((tool: any) => this.tools.set(tool.name, { ...tool, pluginId: id, module: manifest.module })); } catch {}
        try { const r = await client.listResources(); status.resourceCount = r.resources.length; } catch {}
        this.clients.set(id, client);
      }
      status.status = "running";
      status.uptime = Date.now();
      this.emit("plugin_loaded", { pluginId: id });
    } catch (err: any) { status.status = "error"; status.lastError = err.message; }
    return status;
  }

  async startBuiltin() {
    for (const m of BUILTIN_PLUGINS) { if (m.autoStart) await this.loadPlugin(m); }
  }

  getPlugins() { return Array.from(this.plugins.values()); }
  getTools() { return Array.from(this.tools.values()); }
  getResources() { return Array.from(this.resources.values()); }
  async shutdown() { for (const [id] of this.plugins) { const c = this.clients.get(id); if (c) await c.close(); } }
}
