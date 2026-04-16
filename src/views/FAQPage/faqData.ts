export type FAQCategory = 'aboutPlatform' | 'bookings' | 'payments' | 'partnership'

export interface FAQItem {
  id: string
  category: FAQCategory
  questionKey: string
  answerKey: string
}

export const FAQ_CATEGORIES: Record<FAQCategory, string> = {
  aboutPlatform: 'faq.categories.aboutPlatform',
  bookings: 'faq.categories.bookings',
  payments: 'faq.categories.payments',
  partnership: 'faq.categories.partnership',
}

export const FAQ_LIST: FAQItem[] = [
  // About Platform
  {
    id: 'what-is-mytour',
    category: 'aboutPlatform',
    questionKey: 'faq.aboutPlatform.whatIsMyTour',
    answerKey: 'faq.aboutPlatform.whatIsMyTourAnswer',
  },
  {
    id: 'how-to-use',
    category: 'aboutPlatform',
    questionKey: 'faq.aboutPlatform.howToUse',
    answerKey: 'faq.aboutPlatform.howToUseAnswer',
  },
  {
    id: 'who-to-contact',
    category: 'aboutPlatform',
    questionKey: 'faq.aboutPlatform.whoToContact',
    answerKey: 'faq.aboutPlatform.whoToContactAnswer',
  },
  {
    id: 'has-office',
    category: 'aboutPlatform',
    questionKey: 'faq.aboutPlatform.hasOffice',
    answerKey: 'faq.aboutPlatform.hasOfficeAnswer',
  },
  
  // Bookings
  {
    id: 'destinations',
    category: 'bookings',
    questionKey: 'faq.bookings.destinations',
    answerKey: 'faq.bookings.destinationsAnswer',
  },
  {
    id: 'real-prices',
    category: 'bookings',
    questionKey: 'faq.bookings.realPrices',
    answerKey: 'faq.bookings.realPricesAnswer',
  },
  {
    id: 'price-changes',
    category: 'bookings',
    questionKey: 'faq.bookings.priceChanges',
    answerKey: 'faq.bookings.priceChangesAnswer',
  },
  {
    id: 'recalculation-speed',
    category: 'bookings',
    questionKey: 'faq.bookings.recalculationSpeed',
    answerKey: 'faq.bookings.recalculationSpeedAnswer',
  },
  {
    id: 'confirmation-time',
    category: 'bookings',
    questionKey: 'faq.bookings.confirmationTime',
    answerKey: 'faq.bookings.confirmationTimeAnswer',
  },
  {
    id: 'hotel-request',
    category: 'bookings',
    questionKey: 'faq.bookings.hotelRequest',
    answerKey: 'faq.bookings.hotelRequestAnswer',
  },
  {
    id: 'book-for-others',
    category: 'bookings',
    questionKey: 'faq.bookings.bookForOthers',
    answerKey: 'faq.bookings.bookForOthersAnswer',
  },
  {
    id: 'consultation',
    category: 'bookings',
    questionKey: 'faq.bookings.consultation',
    answerKey: 'faq.bookings.consultationAnswer',
  },
  
  // Payments
  {
    id: 'how-to-pay',
    category: 'payments',
    questionKey: 'faq.payments.howToPay',
    answerKey: 'faq.payments.howToPayAnswer',
  },
  {
    id: 'accepted-cards',
    category: 'payments',
    questionKey: 'faq.payments.acceptedCards',
    answerKey: 'faq.payments.acceptedCardsAnswer',
  },
  {
    id: 'installment',
    category: 'payments',
    questionKey: 'faq.payments.installment',
    answerKey: 'faq.payments.installmentAnswer',
  },
  {
    id: 'without-prepayment',
    category: 'payments',
    questionKey: 'faq.payments.withoutPrepayment',
    answerKey: 'faq.payments.withoutPrepaymentAnswer',
  },
  {
    id: 'cancellation',
    category: 'payments',
    questionKey: 'faq.payments.cancellation',
    answerKey: 'faq.payments.cancellationAnswer',
  },
  
  // Partnership
  {
    id: 'which-agencies',
    category: 'partnership',
    questionKey: 'faq.partnership.whichAgencies',
    answerKey: 'faq.partnership.whichAgenciesAnswer',
  },
  {
    id: 'how-to-partner',
    category: 'partnership',
    questionKey: 'faq.partnership.howToPartner',
    answerKey: 'faq.partnership.howToPartnerAnswer',
  },
]

// Helper function to get FAQs by category
export const getFAQsByCategory = (category: FAQCategory): FAQItem[] => {
  return FAQ_LIST.filter((item) => item.category === category)
}

// Helper function to get all categories
export const getAllCategories = (): FAQCategory[] => {
  return ['aboutPlatform', 'bookings', 'payments', 'partnership']
}

// Helper function to get FAQ by ID
export const getFAQById = (id: string): FAQItem | undefined => {
  return FAQ_LIST.find((item) => item.id === id)
}

