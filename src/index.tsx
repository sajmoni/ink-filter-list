import React, { useState } from 'react'
import { Box, render, Text, useInput } from 'ink'
import TextInput from 'ink-text-input'

import useNumber from './useNumber'

type Item = {
  label: string
  value: string
}

type Props = {
  items: Item[]
  onSubmit: (item: Item) => void
}

const FilterList = ({ onSubmit, items }: Props) => {
  const [filter, setFilter] = useState('')

  const filteredItems =
    filter === ''
      ? items
      : items.filter(
          (item) => item.value.includes(filter) || item.label.includes(filter),
        )

  const [selectedIndex, { increase, decrease, setValue }] = useNumber(0, {
    upperLimit: filteredItems.length - 1,
    lowerLimit: 0,
    loop: true,
  })

  useInput((_input, key) => {
    if (key.upArrow) {
      decrease()
    }

    if (key.downArrow) {
      increase()
    }

    if (key.return) {
      onSubmit(filteredItems[selectedIndex])
    }
  })

  return (
    <Box height={10} width={50} flexDirection="column">
      <TextInput
        showCursor={false}
        value={filter}
        placeholder={'Type to filter'}
        onChange={(newValue) => {
          setValue(0)
          setFilter(newValue)
        }}
      />
      {filteredItems.map((item, index) => {
        return (
          <Box key={item.value}>
            <Text color={index === selectedIndex ? 'blue' : 'white'}>
              {item.label}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
}

render(
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
