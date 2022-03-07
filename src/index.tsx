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
  height?: number
}

const FilterList = ({ onSubmit, items, height = 5 }: Props) => {
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

  useInput(
    (_input, key) => {
      if (key.upArrow) {
        decrease()
      }

      if (key.downArrow) {
        increase()
      }

      if (key.return) {
        onSubmit(filteredItems[selectedIndex])
      }
    },
    {
      isActive: true,
    },
  )

  const itemsToRender = filteredItems.slice(
    selectedIndex,
    selectedIndex + height - 1,
  )

  return (
    <Box height={height} width={50} flexDirection="column">
      <TextInput
        showCursor={false}
        value={filter}
        placeholder={'Type to filter'}
        onChange={(newValue) => {
          setValue(0)
          setFilter(newValue)
        }}
      />
      {itemsToRender.map((item, index) => {
        return (
          <Box key={item.value}>
            <Text color={index === 0 ? 'blue' : 'white'}>{item.label}</Text>
          </Box>
        )
      })}
    </Box>
  )
}

export default FilterList

// render(
//   <FilterList
//     items={[
//       {
//         label: 'First',
//         value: 'first',
//       },
//       {
//         label: 'Second',
//         value: 'second',
//       },
//       {
//         label: 'Third',
//         value: 'third',
//       },
//       {
//         label: 'Fourth',
//         value: 'fourth',
//       },
//       {
//         label: 'Fifth',
//         value: 'fifth',
//       },
//       {
//         label: 'Sixth',
//         value: 'sixth',
//       },
//     ]}
//     onSubmit={(item) => {
//       console.log(item)
//     }}
//   />,
// )
