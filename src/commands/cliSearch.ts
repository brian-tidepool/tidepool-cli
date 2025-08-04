// src/commands/hello.ts
import { Command,Args,Flags } from "@oclif/core";
import * as Search from "../lib/patientList.js";
import { BaseCommand } from '../base-command.js'
import { Credentials } from '../lib/credentials.js';



let periodLength = 14;


export default class UsersSearch  extends BaseCommand<typeof UsersSearch> {
    static description = 'Search for a user by clinicId and tagId'

    static flags = {

        clinicId: Flags.string({
            char: 'g',
            description: 'clinic id',
            default: '633b559d1d64ad2c9471178b'
        }),
        tagId: Flags.string({
            char: 'h',
            description: 'tag id',
            default: '6841e165edfe663ac4d8bff0'
        })

    }

    static examples = [
        '<%=config.bin%> <%= command.id %>  "keyword"',
        '<%=config.bin%> <%= command.id %>  "keyword" -g 633b559d1d64ad2c9471178b -h 6841e165edfe663ac4d8bff0'
    ];

    static args = {
      keyword: Args.string({
        description: 'search term',
        required: true,
      }) 
    };

	public async run(): Promise<void> {
		
    
            const {args,flags} = await this.parse(UsersSearch);
            const user = await Search.searchPatients(this.credentials,flags.clinicId, flags.tagId,args.keyword)
            
       
	}
}