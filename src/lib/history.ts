import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

export interface HistoryEntry {
  command: string
  args: string[]
  flags: Record<string, any>
  creds: Record<string, any>
  timestamp: Date
}

export class ParameterHistory {
  private historyFile: string
  private maxEntries: number

  constructor(maxEntries: number = 100) {
    this.maxEntries = maxEntries
    this.historyFile = path.join(os.homedir(), '.mycli-history.json')
    console.log(os.homedir())
    this.ensureHistoryFile()
  }

  private ensureHistoryFile(): void {
    if (!fs.existsSync(this.historyFile)) {
      fs.writeFileSync(this.historyFile, JSON.stringify([]))
    }
  }

  private readHistory(): HistoryEntry[] {
    try {
      const content = fs.readFileSync(this.historyFile, 'utf8')
      const history = JSON.parse(content)
      return history.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }))
    } catch (error) {
      console.warn('Failed to read history file:', error)
      return []
    }
  }

  private writeHistory(history: HistoryEntry[]): void {
    try {
      fs.writeFileSync(this.historyFile, JSON.stringify(history, null, 2))
    } catch (error) {
      console.warn('Failed to write history file:', error)
    }
  }

  addEntry(command: string, args: string[], flags: Record<string, any>, creds: Record<string, any>): void {
    const history = this.readHistory()
    const entry: HistoryEntry = {
      command,
      args,
      flags,
      creds,
      timestamp: new Date()
    }

    history.unshift(entry)

    // Keep only the most recent entries
    if (history.length > this.maxEntries) {
      history.splice(this.maxEntries)
    }

    this.writeHistory(history)
  }

  getHistory(): HistoryEntry[] {
    return this.readHistory()
  }

  getHistoryForCommand(command: string): HistoryEntry[] {
    return this.readHistory().filter(entry => entry.command === command)
  }

  getRecentParameters(command: string, limit: number = 10): Array<{ args: string[], flags: Record<string, any>,creds: Record<string,any>, timestamp: Date }> {
    return this.getHistoryForCommand(command)
      .slice(0, limit)
      .map(entry => ({
        args: entry.args,
        flags: entry.flags,
        creds: entry.creds,
        timestamp: entry.timestamp
      }))
  }

  clearHistory(): void {
    this.writeHistory([])
  }

  clearCommandHistory(command: string): void {
    const history = this.readHistory()
    const filteredHistory = history.filter(entry => entry.command !== command)
    this.writeHistory(filteredHistory)
  }
}