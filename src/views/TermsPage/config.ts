import type { SectionConfig } from "./types"

export const sectionsConfig: SectionConfig[] = [
  {
    titleKey: "terms.title",
    isFirst: true,
    items: [
      { key: "terms.welcome", type: "text", hasSpacing: false },
      { key: "terms.agreement", type: "text", hasSpacing: false },
      { key: "terms.policyIntro", type: "text", hasSpacing: false },
    ],
    hasDividerAfter: false,
  },
  {
    titleKey: "terms.booking.title",
    isFirst: false,
    items: [
      { key: "terms.booking.intro", type: "text", hasSpacing: true },
      {
        type: "ordered",
        items: [
          "terms.booking.mytourConditions",
          "terms.booking.providerConditions",
        ],
        hasSpacing: true,
      },
      { key: "terms.booking.thirdParty", type: "text", hasSpacing: false },
      {
        type: "bullet",
        items: [
          "terms.booking.thirdParty.cancellation",
          "terms.booking.thirdParty.booking",
          "terms.booking.thirdParty.services",
        ],
        hasSpacing: true,
      },
      { key: "terms.booking.specificTerms", type: "text", hasSpacing: false },
    ],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.payments.title",
    isFirst: false,
    items: [
      { key: "terms.payments.booking", type: "text", hasSpacing: false },
      {
        type: "bullet",
        items: [
          "terms.payments.booking.payment",
          "terms.payments.booking.cancellation",
        ],
        hasSpacing: true,
      },
      {
        titleKey: "terms.payments.refund.title",
        type: "text",
        items: [
          {
            key: "terms.payments.refund.text",
            type: "text",
            hasSpacing: false,
          },
          {
            key: "terms.payments.refund.conditions",
            type: "text",
            hasSpacing: false,
          },
        ],
        hasSpacing: false,
        headingStyle: "subheading",
      },
      {
        titleKey: "terms.traveler.title",
        type: "text",
        items: ["terms.traveler.confirmation"],
        hasSpacing: false,
        headingStyle: "subheading",
      },
      {
        type: "bullet",
        items: [
          "terms.traveler.confirmation.age",
          "terms.traveler.confirmation.requirements",
          "terms.traveler.confirmation.terms",
        ],
        hasSpacing: false,
      },
    ],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.personalData.title",
    isFirst: false,
    items: [
      { key: "terms.personalData.intro", type: "text", hasSpacing: true },
      {
        type: "bullet",
        items: [
          "terms.personalData.collected",
          "terms.personalData.collected.contact",
          "terms.personalData.collected.travel",
          "terms.personalData.collected.others",
        ],
        hasSpacing: true,
      },
      {
        titleKey: "terms.personalData.access.title",
        type: "bullet",
        items: [
          "terms.personalData.access.providers",
          "terms.personalData.access.payment",
          "terms.personalData.access.partners",
        ],
        hasSpacing: true,
        headingStyle: "subheading",
      },
      { key: "terms.personalData.sharing", type: "text", hasSpacing: true },
      { key: "terms.personalData.usage", type: "text", hasSpacing: false },
      {
        type: "bullet",
        items: [
          "terms.personalData.usage.management",
          "terms.personalData.usage.contact",
          "terms.personalData.usage.offers",
        ],
        hasSpacing: false,
      },
    ],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.liability.title",
    isFirst: false,
    items: [
      { key: "terms.liability.intro", type: "text", hasSpacing: false },
      {
        type: "bullet",
        items: ["terms.liability.responsibility"],
        hasSpacing: false,
      },
    ],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.updates.title",
    isFirst: false,
    items: [{ key: "terms.updates.text", type: "text", hasSpacing: false }],
    hasDividerAfter: true,
  },
  {
    titleKey: "terms.support.title",
    isFirst: false,
    items: [
      { key: "terms.support.intro", type: "text", hasSpacing: false },
      {
        type: "text",
        key: "terms.support.helpCenter",
        hasSpacing: false,
      },
      {
        type: "text",
        key: "terms.support.contact",
        hasSpacing: false,
      },
    ],
    hasDividerAfter: false,
  },
]
