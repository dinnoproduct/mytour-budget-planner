import React, { Children } from 'react'
import {
  HStack,
  useRadioGroup,
  type UseRadioGroupProps
} from '@chakra-ui/react'

type GroupPropsType = {
  defaultValue?: string
  activeItem?: string
  name: string
  children: React.ReactElement[] | React.ReactNode
  style?: React.CSSProperties
  onChange?: UseRadioGroupProps['onChange']
}

export function Group({
  name,
  children,
  defaultValue = 'november',
  activeItem,
  style,
  onChange
}: Readonly<GroupPropsType>) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name,
    defaultValue,
    value: activeItem,
    onChange
  })

  const group = getRootProps()

  return (
    <HStack {...group} style={style}>
      {Children.map(children, (child, index) => {
        const props = getRadioProps({
          value: child?.props?.value ?? String(index)
        })

        return React.cloneElement(child, {
          ...props,
          key: props.value
        })
      })}
    </HStack>
  )
}
