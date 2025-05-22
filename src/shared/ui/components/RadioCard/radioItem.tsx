import React from 'react'
import { Box, useRadio, useStyleConfig } from '@chakra-ui/react'
import { type CardSelectSizes, type CardSelectVariant } from './types'

type ItemPropsType = {
  label: string
  icon?: React.ReactNode
  subLabel?: string
  size?: CardSelectSizes
  variant?: CardSelectVariant
  children?: React.ReactElement[]
  value?: string
  isDisabled?: boolean
  id?: string
}

export function Item(props: Readonly<ItemPropsType>) {
  const { getInputProps, getRadioProps } = useRadio(props)
  const styles = useStyleConfig('RadioCard', {
    variant: props.variant,
    size: props.size
  })
  const input = getInputProps()
  const checkbox = getRadioProps()
  const hasChildren = React.Children.count(props.children) > 0

  return (
    <fieldset disabled={props.isDisabled} id={props.id}>
      <Box as="label">
        <input {...input} />
        <Box {...checkbox} __css={styles}>
          {hasChildren ? (
            props.children
          ) : (
            <>
              <Box id="icon">{props.icon}</Box>
              <Box id="label">{props.label}</Box>
              {!!props.subLabel && <Box id="supLabel">{props.subLabel}</Box>}
            </>
          )}
        </Box>
      </Box>
    </fieldset>
  )
}
