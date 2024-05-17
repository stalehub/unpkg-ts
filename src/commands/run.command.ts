import { resolve } from 'path'
import { parseNi, runCli } from '@antfu/ni'
import { isTruthy } from '@neodx/std'
import cloneGitRepository from 'clone-git-repo'
import { execaCommand } from 'execa'
import { CliUtilityService, Command, CommandRunner, Option } from 'nest-commander'
import { invariant } from '@/shared/misc'

export interface RunCommandOptions {
  ci: boolean
  editor: string
}

@Command({
  name: 'run',
  options: {
    isDefault: true
  },
  // TODO: rewrite
  description: ''
})
export class RunCommand extends CommandRunner {
  constructor(private readonly utilityService: CliUtilityService) {
    super()
  }

  public async run(params: string[], opts: RunCommandOptions) {
    const [repositoryUrl, destination = process.cwd()] = params

    invariant(repositoryUrl && destination, '%err')

    await cloneGitRepository(
      repositoryUrl,
      destination,
      (errorMsg: string | undefined) =>
        this.handleClonedOutCome(errorMsg, opts, destination)
    )
  }

  private async handleClonedOutCome(
    errorMsg: string | undefined,
    opts: RunCommandOptions,
    dest: string
  ) {
    invariant(!errorMsg, '^%err')

    const installationPath = normalizePath(dest)
    const editorExec = process.env.UNPKG_EDITOR_CLI ?? opts.editor

    await Promise.all(
      [
        runCli(
          (agent, _, hasLock) => {
            return parseNi(
              agent,
              opts.ci ? ['--frozen-if-present'] : [],
              hasLock
            )
          },
          { autoInstall: true, programmatic: true, cwd: installationPath }
        ),
        editorExec &&
          execaCommand(editorExec, {
            cwd: installationPath,
            preferLocal: true,
            shell: process.env.SHELL
          })
      ].filter(isTruthy)
    )
  }

  @Option({
    name: 'ci',
    flags: '-i, --ci [boolean]'
  })
  public parseCi(val: string): boolean {
    return this.utilityService.parseBoolean(val)
  }

  @Option({
    name: 'editor',
    flags: '-e, --editor [string]'
  })
  public parseEditor(val: string): string {
    return val
  }
}

const normalizePath = (localPath: string) => resolve(process.cwd(), localPath)
