// src/commands/hello.ts
import { Command,Args,Flags } from "@oclif/core";

import { BaseCommand } from '../base-command.js'
import { Credentials } from '../lib/credentials.js';

import { searchPatients, Patient } from "../lib/patientSearch.js"
import type { FlagInput } from '@oclif/core/lib/interfaces/parser.js'
let periodLength = 14;


export default class UsersSearch  extends BaseCommand<typeof UsersSearch> {
    static description = 'Search for a user by clinicId and tagId'

    static flags: FlagInput = {

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
            // Updated to match new searchPatients signature with all parameters
            const user : Patient[] | null= await searchPatients(
                this.credentials,
                flags.clinicId,
                flags.tagId,
                args.keyword,
                0, // offset
                '+fullName', // sort
                'cgm', // sortType
                '1d', // period
                50 // limit
            );
            
            if (!user || user.length === 0) {
                this.log('No users found for the current search criteria.');
                return;
            }
            user.forEach((user1, index) => {
                this.log(`${index + 1}. fullName: ${user1.fullName}, id: ${user1.id}`);
            });

    }
}