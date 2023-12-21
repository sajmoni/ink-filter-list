import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { TextInput } from '@inkjs/ui'

import useNumber from './useNumber.js'

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

  // Memoize this
  // Make it case insensitive
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
      onSubmit(filteredItems[selectedIndex]!)
    }
  })

  /**
   * If selectedIndex > 0. Show the previous item in the list
   */
  const itemsToRender = filteredItems.slice(
    selectedIndex === 0 ? 0 : selectedIndex - 1,
    selectedIndex === 0
      ? selectedIndex + height - 1
      : selectedIndex + height - 2,
  )

  return (
    <Box
      height={height}
      width={50}
      flexDirection='column'
    >
      <TextInput
        placeholder={'Type to filter'}
        onChange={(newValue) => {
          setValue(0)
          setFilter(newValue)
        }}
      />
      {itemsToRender.length > 0 ? (
        itemsToRender.map((item) => {
          return (
            <Box key={item.value}>
              <Text
                color={
                  filteredItems[selectedIndex]!.value === item.value
                    ? 'blue'
                    : 'white'
                }
              >
                {item.label}
              </Text>
            </Box>
          )
        })
      ) : (
        <Text
          color={'gray'}
          italic
        >
          No results
        </Text>
      )}
    </Box>
  )
}

export default FilterList
