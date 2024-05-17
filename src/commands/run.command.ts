import { resolve } from 'path'
import type { RunnerContext } from '@antfu/ni'
import { parseNi, parseNr, runCli } from '@antfu/ni'
import { isTruthy, keys, toArray } from '@neodx/std'
import cloneGitRepository from 'clone-git-repo'
import { execaCommand } from 'execa'
import {
  CliUtilityService,
  Command,
  CommandRunner,
  Option
} from 'nest-commander'
import { getPackageJSON, invariant } from '@/shared/misc'

export interface RunCommandOptions {
  ci: boolean
  editor: string
  launchTarget: string
  auto: boolean
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
    invariant(!errorMsg, '%err')

    const installPath = normalizePath(dest)
    const editorExec = process.env.UNPKG_EDITOR_CLI ?? opts.editor

    const runTargets = async () => {
      await runCli(
        (agent, _, hasLock) => {
          return parseNi(agent, opts.ci ? ['--frozen-if-present'] : [], hasLock)
        },
        { autoInstall: true, programmatic: true, cwd: installPath }
      )

      const pkg = getPackageJSON(installPath)
      const scripts = keys(pkg.scripts ?? {})
      const launchTarget = opts.launchTarget ?? 'build'
      const containsTarget = scripts.includes(launchTarget)
      const allowedDevTargets = ['start', 'dev', 'preview'] as const

      const runnerContext = {
        programmatic: true,
        cwd: installPath
      } satisfies RunnerContext

      if (containsTarget) {
        await runCli(
          (agent, _) => parseNr(agent, toArray(launchTarget)),
          runnerContext
        )
      }

      if (!opts.auto) return
      const devTarget = allowedDevTargets.find((target) => scripts.includes(target))

      if (devTarget) {
        await runCli(
          (agent, _) => parseNr(agent, toArray(devTarget)),
          runnerContext
        )
      }
    }

    await Promise.all(
      [
        runTargets(),
        editorExec &&
          execaCommand(editorExec, {
            cwd: installPath,
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

  @Option({
    name: 'launchTarget',
    flags: '-l, --launch [string]'
  })
  public parseLaunchTarget(val: string): string {
    return val
  }

  @Option({
    name: 'auto',
    flags: '-a, --auto [boolean]'
  })
  public parseAuto(val: string): boolean {
    return this.utilityService.parseBoolean(val)
  }
}

const normalizePath = (localPath: string) => resolve(process.cwd(), localPath)
