import { Command, Flags, Interfaces } from '@oclif/core'
import { ParameterHistory } from './lib/commandHistory.js'
import { CredentialsManager, Credentials } from './lib/credentials.js';

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<typeof BaseCommand['baseFlags'] & T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  protected credentialsManager: CredentialsManager;
  protected credentials!: Credentials;
  protected flags!: Flags<T>
  protected args!: Args<T>
  constructor(argv: string[], config: any) {
    super(argv, config);
    this.credentialsManager = new CredentialsManager();
  }
  // add the --json flag
  static enableJsonFlag = true

  // define flags that can be inherited by any command that extends BaseCommand
 



  public async init(): Promise<void> {
    await super.init()
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      args: this.ctor.args,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>

    // Load credentials for all commands except configure
    if (this.constructor.name !== 'Configure') {
      try {
        this.credentials = this.credentialsManager.loadCredentials();
      } catch (error) {

        if (error instanceof Error) {
          console.error(error.message); // TypeScript knows it's an Error now
        } else {
          console.error("Unknown error:", error);
        }
      }
    }

  }

   protected async catch(error: any) {
    // Log the error before handling
    console.error('Error caught:', error)
    
    // Call parent's catch method
    return super.catch(error)
  }

  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }




  protected recordHistory(): void {
    const history = new ParameterHistory()

    const command = this.id || '';
    const args = Object.values(this.args).filter(Boolean) as string[]
    const flags = this.flags || {}
    const creds = this.credentials;
    console.log('record')
    console.log(command,args,flags,creds)
    history.addEntry(command, args, flags, creds as unknown as Record<string, unknown>);
  }

  protected getParameterSuggestions(): Array<{ args: string[], flags: Record<string, any>, creds: Record<string,any> }> {
    const history = new ParameterHistory()
    const command = this.constructor.name.toLowerCase()
    return history.getRecentParameters(command, 5)
  }

  protected printFilename(): string | undefined {
    //const fileName = (new Error().stack?.split('\n')[2]?.match(/\(([^)]+)\)/)?.[1]?.split('/').pop()?.split(':')[0] || 'unknown').split('.').slice(0, -1).join('.') || 'unknown';
    const fileName = this.id;
  
    return fileName
  }
}