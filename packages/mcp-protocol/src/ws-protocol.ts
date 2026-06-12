// WebSocket Protocol — AI Collaboration Hub
// Based on JSON-RPC over WebSocket transport

import type { McpToolCall, McpToolResult } from "./index.js";

// ━━━━━ WS Message Types ━━━━━
export type WsMessage =
  | WsJoinRoom
  | WsLeaveRoom
  | WsChatMessage
  | WsToolCall
  | WsToolResult
  | WsInvite
  | WsRoomEvent;

export interface WsJoinRoom {
  type: "join";
  roomId: string;
  identity: WsIdentity;
}

export interface WsLeaveRoom {
  type: "leave";
  roomId: string;
}

export interface WsChatMessage {
  type: "message";
  roomId: string;
  from: string;
  role: "human" | "ai" | "system";
  content: string;
  ts: number;
}

export interface WsToolCall {
  type: "tool_call";
  roomId: string;
  from: string;
  tool: McpToolCall;
}

export interface WsToolResult {
  type: "tool_result";
  roomId: string;
  from: string;
  tool: string;
  result: McpToolResult;
}

export interface WsInvite {
  type: "invite";
  roomId: string;
  target: string;
}

export interface WsRoomEvent {
  type: "user_joined" | "user_left" | "room_history";
  roomId: string;
  identity?: WsIdentity;
  data?: unknown;
}

export interface WsIdentity {
  name: string;
  role: "human" | "ai";
  avatar?: string;
}

// ━━━━━ Room Types ━━━━━
export interface Room {
  id: string;
  name: string;
  icon: string;
  description: string;
  participants: number;
  unread: number;
  active: boolean;
}

export interface RoomParticipant {
  name: string;
  role: "human" | "ai";
  status: "online" | "idle" | "offline";
  avatar: string;
}

// ━━━━━ Room Message (stored) ━━━━━
export interface RoomMessage {
  id: string;
  roomId: string;
  from: string;
  role: "human" | "ai" | "system";
  content: string;
  ts: number;
  type: "text" | "tool_call" | "tool_result" | "system";
  toolName?: string;
  toolResult?: string;
}
