import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
/**
 * Manages CLI command parameter history, including secure storage and retrieval.
 */
export class ParameterHistory {
    historyFile;
    maxEntries;
    /**
     * @param maxEntries Maximum number of history entries to keep (default: 100)
     */
    constructor(maxEntries = 100) {
        this.maxEntries = maxEntries;
        this.historyFile = path.join(os.homedir(), '.mycli-history.json');
        this.ensureHistoryFile();
    }
    /**
     * Ensures the history file exists; creates it if not present.
     */
    ensureHistoryFile() {
        if (!fs.existsSync(this.historyFile)) {
            fs.writeFileSync(this.historyFile, JSON.stringify([]));
        }
    }
    /**
     * Obscures sensitive credential information before storing.
     * @param data Credential object
     * @returns Obscured credential object
     */
    obscureSensitiveData(data) {
        const obscured = { ...data };
        const sensitiveFields = [
            'password', 'pass', 'pwd', 'secret', 'token', 'key', 'auth',
            'TIDEPOOL_PASSWORD', 'TIDEPOOL_USERNAME', 'TIDEPOOL_BASE_URL'
        ];
        Object.keys(obscured).forEach(key => {
            const lowerKey = key.toLowerCase();
            if (sensitiveFields.some(field => lowerKey.includes(field))) {
                obscured[key] = '[OBSCURED]';
            }
        });
        return obscured;
    }
    /**
     * Reads the history file and parses entries.
     * @returns Array of HistoryEntry
     */
    readHistory() {
        try {
            const content = fs.readFileSync(this.historyFile, 'utf8');
            const history = JSON.parse(content);
            return history.map((entry) => ({
                ...entry,
                timestamp: new Date(entry.timestamp)
            }));
        }
        catch (error) {
            console.warn('Failed to read history file:', error);
            return [];
        }
    }
    /**
     * Writes the history array to the file.
     * @param history Array of HistoryEntry
     */
    writeHistory(history) {
        try {
            fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
        }
        catch (error) {
            console.warn('Failed to write history file:', error);
        }
    }
    /**
     * Adds a new command entry to the history.
     * @param command Command name
     * @param args Command arguments
     * @param flags Command flags
     * @param creds Credentials (sensitive fields will be obscured)
     */
    addEntry(command, args, flags, creds) {
        const history = this.readHistory();
        const obscuredCreds = this.obscureSensitiveData(creds);
        const entry = {
            command,
            args,
            flags,
            creds: obscuredCreds,
            timestamp: new Date()
        };
        history.unshift(entry);
        if (history.length > this.maxEntries) {
            history.splice(this.maxEntries);
        }
        this.writeHistory(history);
    }
    /**
     * Returns the full command history.
     */
    getHistory() {
        return this.readHistory();
    }
    /**
     * Returns history entries for a specific command.
     * @param command Command name
     */
    getHistoryForCommand(command) {
        return this.readHistory().filter(entry => entry.command === command);
    }
    /**
     * Returns recent parameters for a command, up to the specified limit.
     * @param command Command name
     * @param limit Max number of entries to return (default: 10)
     */
    getRecentParameters(command, limit = 10) {
        return this.getHistoryForCommand(command)
            .slice(0, limit)
            .map(entry => ({
            args: entry.args,
            flags: entry.flags,
            creds: entry.creds,
            timestamp: entry.timestamp
        }));
    }
    /**
     * Clears the entire command history.
     */
    clearHistory() {
        this.writeHistory([]);
    }
    /**
     * Clears history for a specific command only.
     * @param command Command name
     */
    clearCommandHistory(command) {
        const history = this.readHistory();
        const filteredHistory = history.filter(entry => entry.command !== command);
        this.writeHistory(filteredHistory);
    }
}
