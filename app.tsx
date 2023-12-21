// File used for testing
import { render } from 'ink'
import React from 'react'

import FilterList from './src/index.jsx'

export const clearConsole = () => {
  process.stdout.write(
    process.platform === 'win32'
      ? '\u001B[2J\u001B[0f'
      : '\u001B[2J\u001B[3J\u001B[H',
  )
}

const run = async () => {
  clearConsole()

  render(
    <FilterList
      height={10}
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
        {
          label: 'Sixth',
          value: { id: 'sixth' },
        },
      ]}
      onSubmit={(item) => {
        console.log('value', item.value)
      }}
    />,
  )
}

run()
