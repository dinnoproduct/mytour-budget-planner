import numeral from 'numeral'

export const formatNumber = (number: number) => numeral(number).format('0,0')

export const approximateNumber = (number1: number, number2: number) =>
  Math.ceil(number1 / number2)
