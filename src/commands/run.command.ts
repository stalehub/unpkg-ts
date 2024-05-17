import {
  CliUtilityService,
  Command,
  CommandRunner,
  Option
} from 'nest-commander'

@Command({
  name: 'run',
  // TODO: rewrite
  description: ''
})
export class RunCommand extends CommandRunner {
  constructor(private readonly utilityService: CliUtilityService) {
    super()
  }

  public async run(_: string[], options: any){
    console.log('it works')
    console.log({
      options
    })
  }

  @Option({
    name: 'json',
    flags: '-json, --json [boolean]'
  })
  public parseJson(val: string): boolean {
    return this.utilityService.parseBoolean(val)
  }
}
