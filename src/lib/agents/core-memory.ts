/**
 * GreenPe Agent System — Core Memory Layer
 * 
 * Singleton shared state store that all 13 agents read/write.
 * Channels: agent-state, task-queue, audit-log, pipeline-state, conversations, metrics
 * 
 * In-memory for MVP — designed for drop-in replacement with Redis/Supabase.
 */

import type { MemoryChannel, MemoryEntry, AgentActivity } from './types';

type SubscribeCallback = (channel: MemoryChannel, key: string, value: unknown) => void;

class CoreMemoryStore {
    private store: Map<string, Map<string, MemoryEntry>> = new Map();
    private subscribers: Map<string, SubscribeCallback[]> = new Map();
    private activityLog: AgentActivity[] = [];
    private activitySubscribers: ((activity: AgentActivity) => void)[] = [];

    constructor() {
        // Initialize all channels
        const channels: MemoryChannel[] = [
            'agent-state', 'task-queue', 'audit-log',
            'pipeline-state', 'conversations', 'metrics'
        ];
        channels.forEach(ch => this.store.set(ch, new Map()));
    }

    /**
     * Read a value from a channel
     */
    read<T = unknown>(channel: MemoryChannel, key: string): T | undefined {
        const channelStore = this.store.get(channel);
        if (!channelStore) return undefined;
        const entry = channelStore.get(key);
        return entry?.value as T | undefined;
    }

    /**
     * Write a value to a channel — notifies all subscribers
     */
    write<T = unknown>(
        channel: MemoryChannel,
        key: string,
        value: T,
        agentId: string = 'system'
    ): void {
        const channelStore = this.store.get(channel);
        if (!channelStore) return;

        const entry: MemoryEntry<T> = {
            key,
            value,
            updatedAt: Date.now(),
            updatedBy: agentId,
        };

        channelStore.set(key, entry as MemoryEntry);

        // Notify subscribers
        const subs = this.subscribers.get(channel) || [];
        subs.forEach(cb => cb(channel, key, value));
    }

    /**
     * Get all entries in a channel
     */
    getAll<T = unknown>(channel: MemoryChannel): Record<string, T> {
        const channelStore = this.store.get(channel);
        if (!channelStore) return {};

        const result: Record<string, T> = {};
        channelStore.forEach((entry, key) => {
            result[key] = entry.value as T;
        });
        return result;
    }

    /**
     * Get all entries as array
     */
    getAllEntries<T = unknown>(channel: MemoryChannel): MemoryEntry<T>[] {
        const channelStore = this.store.get(channel);
        if (!channelStore) return [];
        return Array.from(channelStore.values()) as MemoryEntry<T>[];
    }

    /**
     * Delete a key from a channel
     */
    delete(channel: MemoryChannel, key: string): boolean {
        const channelStore = this.store.get(channel);
        if (!channelStore) return false;
        return channelStore.delete(key);
    }

    /**
     * Subscribe to changes on a channel
     */
    subscribe(channel: MemoryChannel, callback: SubscribeCallback): () => void {
        const subs = this.subscribers.get(channel) || [];
        subs.push(callback);
        this.subscribers.set(channel, subs);

        // Return unsubscribe function
        return () => {
            const current = this.subscribers.get(channel) || [];
            this.subscribers.set(channel, current.filter(cb => cb !== callback));
        };
    }

    /**
     * Log an agent activity event
     */
    logActivity(activity: AgentActivity): void {
        this.activityLog.push(activity);
        // Keep last 200 entries
        if (this.activityLog.length > 200) {
            this.activityLog = this.activityLog.slice(-200);
        }
        this.activitySubscribers.forEach(cb => cb(activity));
    }

    /**
     * Get recent activity log
     */
    getActivityLog(limit: number = 50): AgentActivity[] {
        return this.activityLog.slice(-limit).reverse();
    }

    /**
     * Subscribe to activity events (for SSE streaming)
     */
    onActivity(callback: (activity: AgentActivity) => void): () => void {
        this.activitySubscribers.push(callback);
        return () => {
            this.activitySubscribers = this.activitySubscribers.filter(cb => cb !== callback);
        };
    }

    /**
     * Get channel stats
     */
    getStats(): Record<MemoryChannel, number> {
        const stats: Record<string, number> = {};
        this.store.forEach((channelStore, channel) => {
            stats[channel] = channelStore.size;
        });
        return stats as Record<MemoryChannel, number>;
    }

    /**
     * Clear a channel (for testing)
     */
    clear(channel: MemoryChannel): void {
        const channelStore = this.store.get(channel);
        if (channelStore) channelStore.clear();
    }
}

// Singleton instance — shared across all agents and API routes
let instance: CoreMemoryStore | null = null;

export function getCoreMemory(): CoreMemoryStore {
    if (!instance) {
        instance = new CoreMemoryStore();
    }
    return instance;
}

export type { CoreMemoryStore };
