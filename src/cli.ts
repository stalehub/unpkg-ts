import cloneGitRepository from 'clone-git-repo'
import { Command } from 'commander'
import { handleClonedProject } from '@/handle-project'
import { invariant } from '@/misc'

export interface RunCommandOptions {
  ci: boolean
  editor: string
  launchTarget: string
  auto: boolean
}

export function createUnpkgCLI(): Command {
  const program = new Command()

  program.name('unpkg').description('%desc')

  program
    .option('--ci [ci]', '%desc')
    .option('--editor [editor]', '%desc')
    .option('--launch [launchTarget]', '%desc')
    .option('--auto [auto]', '%desc')
    .action(async (opts: RunCommandOptions, cmd: Command) => {
      const [repositoryUrl, destination = process.cwd()] = cmd.args

      invariant(repositoryUrl && destination, '%err')

      await cloneGitRepository(
        repositoryUrl,
        destination,
        (errorMsg: string | undefined) =>
          handleClonedProject(errorMsg, opts, destination)
      )
    })

  return program
}
