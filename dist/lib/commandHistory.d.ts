/**
 * Represents a single CLI command history entry.
 */
export interface HistoryEntry {
    command: string;
    args: string[];
    flags: Record<string, unknown>;
    creds: Record<string, unknown>;
    timestamp: Date;
}
/**
 * Manages CLI command parameter history, including secure storage and retrieval.
 */
export declare class ParameterHistory {
    private readonly historyFile;
    private readonly maxEntries;
    /**
     * @param maxEntries Maximum number of history entries to keep (default: 100)
     */
    constructor(maxEntries?: number);
    /**
     * Ensures the history file exists; creates it if not present.
     */
    private ensureHistoryFile;
    /**
     * Obscures sensitive credential information before storing.
     * @param data Credential object
     * @returns Obscured credential object
     */
    private obscureSensitiveData;
    /**
     * Reads the history file and parses entries.
     * @returns Array of HistoryEntry
     */
    private readHistory;
    /**
     * Writes the history array to the file.
     * @param history Array of HistoryEntry
     */
    private writeHistory;
    /**
     * Adds a new command entry to the history.
     * @param command Command name
     * @param args Command arguments
     * @param flags Command flags
     * @param creds Credentials (sensitive fields will be obscured)
     */
    addEntry(command: string, args: string[], flags: Record<string, unknown>, creds: Record<string, unknown>): void;
    /**
     * Returns the full command history.
     */
    getHistory(): HistoryEntry[];
    /**
     * Returns history entries for a specific command.
     * @param command Command name
     */
    getHistoryForCommand(command: string): HistoryEntry[];
    /**
     * Returns recent parameters for a command, up to the specified limit.
     * @param command Command name
     * @param limit Max number of entries to return (default: 10)
     */
    getRecentParameters(command: string, limit?: number): Array<{
        args: string[];
        flags: Record<string, unknown>;
        creds: Record<string, unknown>;
        timestamp: Date;
    }>;
    /**
     * Clears the entire command history.
     */
    clearHistory(): void;
    /**
     * Clears history for a specific command only.
     * @param command Command name
     */
    clearCommandHistory(command: string): void;
}
