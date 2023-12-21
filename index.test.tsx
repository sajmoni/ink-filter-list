import React from 'react'
import { render } from 'ink-testing-library'
import { test, expect } from 'vitest'

import timers from 'node:timers/promises'

import FilterList from './src/index.jsx'
import { Box, Text } from 'ink'

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
          value: { id: 'first' },
        },
        {
          label: 'Second',
          value: { id: 'second' },
        },
        {
          label: 'Third',
          value: { id: 'third' },
        },
        {
          label: 'Fourth',
          value: { id: 'fourth' },
        },
        {
          label: 'Fifth',
          value: { id: 'fifth' },
        },
      ]}
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

test('renderItem', () => {
  const { lastFrame } = render(
    <FilterList
      height={10}
      items={[
        {
          label: 'First item',
          value: { id: 'first' },
        },
        {
          label: 'Second item',
          value: { id: 'second' },
        },
        {
          label: 'Third item',
          value: { id: 'third' },
        },
      ]}
      renderItem={(item, isSelected) => {
        const color = isSelected ? 'blue' : 'white'

        return (
          <Box flexDirection={'column'}>
            <Text color={color}>{item.value.id}</Text>
            <Text color={color}>{item.label}</Text>
          </Box>
        )
      }}
    />,
  )

  expect(lastFrame()).toMatchSnapshot()
})
