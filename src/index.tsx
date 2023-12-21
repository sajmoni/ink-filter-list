import React, { useState, type ReactNode } from 'react'
import { Box, Text, useInput } from 'ink'
import { TextInput } from '@inkjs/ui'

import useNumber from './useNumber.js'

type Item<T extends { id: string }> = {
  label: string
  value: T
}

type Props<T extends { id: string }> = {
  items: Item<T>[]
  // TODO: Optional?
  onSubmit: (item: Item<T>) => void
  height?: number
  renderItem?: (item: Item<T>, isSelected: boolean) => ReactNode
}

export default function FilterList<T extends { id: string }>({
  onSubmit,
  items,
  height = 5,
  renderItem,
}: Props<T>) {
  const [filter, setFilter] = useState('')

  // Memoize this
  // Make it case insensitive
  const filteredItems =
    filter === ''
      ? items
      : items.filter(
          (item) =>
            item.value.id.includes(filter) || item.label.includes(filter),
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
          const isSelected =
            filteredItems[selectedIndex]!.value.id === item.value.id

          if (renderItem) {
            return renderItem(item, isSelected)
          }
          return (
            <Box key={item.value.id}>
              <Text color={isSelected ? 'blue' : 'white'}>{item.label}</Text>
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
