// src/commands/suggest.ts
import { Command, Flags, Args, Config } from '@oclif/core'
import { ParameterHistory } from '../lib/commandHistory.js'

export default class Suggest extends Command {
  static override description = 'Get parameter suggestions based on history'

  static override examples = [
    '<%= config.bin %> <%= command.id %> deploy',
  ]

  static override flags = {
    limit: Flags.integer({
      char: 'l',
      description: 'limit number of suggestions',
      default: 5,
    }),
  } as const

  static override args = {
    command: Args.string({
      description: 'command to get suggestions for',
      required: true,
    }),
  }

  /**
   * Obscure sensitive credential information
   */
  private obscureCredentials(creds: Record<string, any>): Record<string, any> {
    const obscured = { ...creds }
    
    // List of sensitive fields that should be obscured
    const sensitiveFields = [
      'password', 'pass', 'pwd', 'secret', 'token', 'key', 'auth',
      'TIDEPOOL_PASSWORD', 'TIDEPOOL_USERNAME', 'TIDEPOOL_BASE_URL'
    ]
    
    Object.keys(obscured).forEach(key => {
      const lowerKey = key.toLowerCase()
      if (sensitiveFields.some(field => lowerKey.includes(field))) {
        const value = obscured[key]
        if (typeof value === 'string' && value.length > 0) {
          // Show first character and last character, obscure the rest
          if (value.length <= 2) {
            obscured[key] = '***'
          } else {
            obscured[key] = `${value.charAt(0)}${'*'.repeat(value.length - 2)}${value.charAt(value.length - 1)}`
          }
        } else {
          obscured[key] = '***'
        }
      }
    })
    
    return obscured
  }

  /**
   * Format credentials for display with sensitive information obscured
   */
  private formatCredentials(creds: Record<string, any>): string {
    const obscured = this.obscureCredentials(creds)
    return Object.entries(obscured)
      .map(([key, value]) => `${key}:${value}`)
      .join(' ')
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Suggest)
    const history = new ParameterHistory()
    const config = await Config.load()

    const suggestions = history.getRecentParameters(args.command, flags.limit)

    if (suggestions.length === 0) {
      this.log(`No parameter history found for command: ${args.command}`)
      return
    }

    this.log(`\nParameter suggestions for '${args.command}':\n`)
    
    suggestions.forEach((suggestion, index) => {
      const argsStr = suggestion.args.length > 0 ? suggestion.args.join(' ') : ''
      const flagsStr = Object.entries(suggestion.flags)
        .map(([key, value]) => `--${key}${value === true ? '' : `=${value}`}`)
        .join(' ')
      const credsStr = this.formatCredentials(suggestion.creds)
      const params = [argsStr, flagsStr].filter(Boolean).join(', ')
      
      this.log(`${suggestion.timestamp},${credsStr}: ${this.config.bin} ${args.command} ${params}`)
    })
    
    this.log('\nUse these suggestions to quickly rerun previous commands with similar parameters.')
    this.log('🔒 Note: Sensitive credential information has been obscured for security.')
  }
}