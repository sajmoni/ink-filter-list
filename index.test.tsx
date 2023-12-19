import React from 'react'
import { render } from 'ink-testing-library'
import { test, expect } from 'vitest'

import timers from 'node:timers/promises'

import FilterList from './src/index.jsx'

const ARROW_UP = '\u001B[A'
const ARROW_DOWN = '\u001B[B'
const BACKSPACE = '\u007F'

const input = async (write: (data: string) => void, input: string) => {
  await timers.setTimeout(100)
  write(input)
}

test('Arrow keys and filtering', async () => {
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
      onSubmit={() => {}}
    />,
  )

  expect(lastFrame()).toMatchSnapshot()

  await input(stdin.write, ARROW_DOWN)

  expect(lastFrame()).toMatchSnapshot()

  await input(stdin.write, ARROW_DOWN)

  expect(lastFrame()).toMatchSnapshot()

  await input(stdin.write, ARROW_UP)

  expect(lastFrame()).toMatchSnapshot()

  await input(stdin.write, 'second')

  expect(lastFrame()).toMatchSnapshot()

  // Clear the input
  await input(stdin.write, BACKSPACE)
  await input(stdin.write, BACKSPACE)
  await input(stdin.write, BACKSPACE)
  await input(stdin.write, BACKSPACE)
  await input(stdin.write, BACKSPACE)
  await input(stdin.write, BACKSPACE)

  await input(stdin.write, 'does not exist')

  expect(lastFrame()).toMatchSnapshot()
})
