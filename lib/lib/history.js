import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
export class ParameterHistory {
    historyFile;
    maxEntries;
    constructor(maxEntries = 100) {
        this.maxEntries = maxEntries;
        this.historyFile = path.join(os.homedir(), '.mycli-history.json');
        console.log(os.homedir());
        this.ensureHistoryFile();
    }
    ensureHistoryFile() {
        if (!fs.existsSync(this.historyFile)) {
            fs.writeFileSync(this.historyFile, JSON.stringify([]));
        }
    }
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
    writeHistory(history) {
        try {
            fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2));
        }
        catch (error) {
            console.warn('Failed to write history file:', error);
        }
    }
    addEntry(command, args, flags, creds) {
        const history = this.readHistory();
        const entry = {
            command,
            args,
            flags,
            creds,
            timestamp: new Date()
        };
        history.unshift(entry);
        // Keep only the most recent entries
        if (history.length > this.maxEntries) {
            history.splice(this.maxEntries);
        }
        this.writeHistory(history);
    }
    getHistory() {
        return this.readHistory();
    }
    getHistoryForCommand(command) {
        return this.readHistory().filter(entry => entry.command === command);
    }
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
    clearHistory() {
        this.writeHistory([]);
    }
    clearCommandHistory(command) {
        const history = this.readHistory();
        const filteredHistory = history.filter(entry => entry.command !== command);
        this.writeHistory(filteredHistory);
    }
}
