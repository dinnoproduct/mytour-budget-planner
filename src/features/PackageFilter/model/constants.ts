export const FILTER_PARAMS_DEFAULT_VALUE = {
  priceRange: {
    minValue: 0,
    maxValue: 0
  },
  packageSelectHotel: [],
  hotelRatingSelect: [],
  cityFilterValues: {}
}

export const FILTER_ITEM_TYPE = {
  SELECT: 'select',
  CHECKBOX_LIST: 'checkboxList',
  RATING_CHECKBOX_LIST: 'ratingCheckboxList',
  RANGE: 'range'
} as const
