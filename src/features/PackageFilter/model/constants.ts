export const FILTER_PARAMS_DEFAULT_VALUE = {
  priceRange: {
    minValue: 0,
    maxValue: 0
  },
  packageSelectHotel: [],
  hotelRatingSelect: []
}

export const FILTER_ITEM_TYPE = {
  SELECT: 'select',
  RATING_CHECKBOX_LIST: 'ratingCheckboxList',
  RANGE: 'range'
} as const
