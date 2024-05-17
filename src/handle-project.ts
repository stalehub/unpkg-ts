import type { RunnerContext } from '@antfu/ni'
import { parseNi, parseNr, runCli } from '@antfu/ni'
import { isTruthy, keys, toArray } from '@neodx/std'
import { execaCommand } from 'execa'
import { getPackageJSON, invariant, normalizePath } from '@/misc'
import type { RunCommandOptions } from '@/cli'

export async function handleClonedProject(
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
    const devTarget = allowedDevTargets.find((target) =>
      scripts.includes(target)
    )

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
