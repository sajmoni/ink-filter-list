import timers from 'node:timers/promises'
import test from 'ava'
import React from 'react'
import { render } from 'ink-testing-library'
import stripAnsi from 'strip-ansi'
import chalk from 'chalk'

import FilterList from './src'

const ARROW_UP = '\u001B[A'
const ARROW_DOWN = '\u001B[B'

const input = async (write: (data: string) => void, input: string) => {
  await timers.setTimeout(100)
  write(input)
}

test('Example test', async (t) => {
  const { lastFrame, stdin } = render(
    <FilterList
      items={[
        {
          label: 'First',
          value: 'first',
        },
        {
          label: 'Second',
          value: 'second',
        },
        {
          label: 'Third',
          value: 'third',
        },
        {
          label: 'Fourth',
          value: 'fourth',
        },
        {
          label: 'Fifth',
          value: 'fifth',
        },
      ]}
      onSubmit={(item) => {
        console.log(item)
      }}
    />,
  )

  t.is(
    lastFrame(),
    `${chalk.gray('Type to filter')}
${chalk.blue('First')}
${chalk.white('Second')}
${chalk.white('Third')}
${chalk.white('Fourth')}`,
  )

  await input(stdin.write, ARROW_DOWN)

  t.is(
    lastFrame(),
    `${chalk.gray('Type to filter')}
${chalk.blue('Second')}
${chalk.white('Third')}
${chalk.white('Fourth')}
${chalk.white('Fifth')}`,
  )

  await input(stdin.write, 'second')

  t.is(
    lastFrame(),
    `${stripAnsi('second')}
${chalk.blue('Second')}


`,
  )
})
