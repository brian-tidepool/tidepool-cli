export interface HistoryEntry {
    command: string;
    args: string[];
    flags: Record<string, any>;
    creds: Record<string, any>;
    timestamp: Date;
}
export declare class ParameterHistory {
    private historyFile;
    private maxEntries;
    constructor(maxEntries?: number);
    private ensureHistoryFile;
    private readHistory;
    private writeHistory;
    addEntry(command: string, args: string[], flags: Record<string, any>, creds: Record<string, any>): void;
    getHistory(): HistoryEntry[];
    getHistoryForCommand(command: string): HistoryEntry[];
    getRecentParameters(command: string, limit?: number): Array<{
        args: string[];
        flags: Record<string, any>;
        creds: Record<string, any>;
        timestamp: Date;
    }>;
    clearHistory(): void;
    clearCommandHistory(command: string): void;
}
