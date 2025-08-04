// src/commands/suggest.ts
import { Command, Flags, Args } from '@oclif/core'
import { ParameterHistory } from '../../src/lib/history'

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
  }

  static override args = {
  command: Args.string({
    description: 'command to get suggestions for',
    required: true,
  }),
}

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Suggest)
    const history = new ParameterHistory()

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
      
      const params = [argsStr, flagsStr].filter(Boolean).join(' ')
      
      this.log(`${index + 1}. ${args.command} ${params}`)
    })
    
    this.log('\nUse these suggestions to quickly rerun previous commands with similar parameters.')
  }
}