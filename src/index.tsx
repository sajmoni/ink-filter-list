import React, { useState, type ReactNode, useMemo } from 'react'
import { Box, Text, useInput } from 'ink'
import { TextInput } from '@inkjs/ui'
import { useCounter } from 'react-use'

type Item<T extends { id: string }> = {
  label: string
  value: T
}

type Props<T extends { id: string }> = {
  items: Item<T>[]
  onSubmit?: (item: Item<T>) => void
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

  const filteredItems = useMemo(() => {
    return filter === ''
      ? items
      : items.filter(
          (item) =>
            item.value.id.toLowerCase().includes(filter.toLowerCase()) ||
            item.label.toLowerCase().includes(filter.toLowerCase()),
        )
  }, [filter, items])

  const [selectedIndex, { inc, dec, set }] = useCounter(
    0,
    filteredItems.length - 1,
    0,
  )

  console.log('file: index.tsx:30 ~ filteredItems:', filteredItems.length)

  useInput((_input, key) => {
    if (key.upArrow) {
      dec()
    }

    if (key.downArrow) {
      inc()
    }

    if (key.return) {
      if (onSubmit) {
        onSubmit(filteredItems[selectedIndex]!)
      }
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
          set(0)
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
