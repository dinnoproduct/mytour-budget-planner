import * as yup from 'yup';
import { EMAIL_REGEXP } from '../../../utils/regex.ts';
import { i18n } from '../../../configs/i18next.ts';
import { REQUIRED_MESSAGE, WRONG_FORMAT } from '../../../constants/constants.ts';
import { CustomFields, PackagesFields } from '../data/packagesEnums.ts';
import { numberWithCommaNormalizer } from '../../../utils/normalizers.ts';

export const subscribeScheme = yup.object().shape({
  [CustomFields.email]: yup
    .string()
    .required(i18n.t(REQUIRED_MESSAGE))
    .matches(EMAIL_REGEXP, { message: i18n.t(WRONG_FORMAT), excludeEmptyString: true }),
});

export const packageEditScheme = yup.object().shape({
  [CustomFields.destinationFlightDate]: yup.string(),
  [CustomFields.returnFlightDate]: yup.string().required(i18n.t(REQUIRED_MESSAGE)),
  [PackagesFields.childs]: yup
    .array()
    .of(yup.object().shape({ birthdate: yup.string().required(i18n.t(REQUIRED_MESSAGE)) })),
  [PackagesFields.returnFlight]: yup
    .object()
    .shape({})
    .test('is-not-empty', i18n.t(REQUIRED_MESSAGE), (value) => value && Object.keys(value).length > 0)
    .required(i18n.t(REQUIRED_MESSAGE)),
  [PackagesFields.destinationFlight]: yup.object(),
  [PackagesFields.lateCheckout]: yup.boolean(),
  [PackagesFields.adults]: yup.number(),
  [CustomFields.childrenUnderTwoYears]: yup.number(),
  [CustomFields.childrenOverTwoYears]: yup.number(),
});

export const bookFirstTabScheme = yup.object().shape({
  [CustomFields.phoneNumber]: yup.string().length(8, i18n.t(WRONG_FORMAT)).required(i18n.t(REQUIRED_MESSAGE)),
  [CustomFields.email]: yup
    .string()
    .required(i18n.t(REQUIRED_MESSAGE))
    .matches(EMAIL_REGEXP, { message: i18n.t(WRONG_FORMAT), excludeEmptyString: true }),
  [PackagesFields.childs]: yup.array().of(
    yup.object().shape({
      [PackagesFields.firstName]: yup.string().required(i18n.t(REQUIRED_MESSAGE)),
      [PackagesFields.lastName]: yup.string().required(i18n.t(REQUIRED_MESSAGE)),
      [PackagesFields.birthDate]: yup.string().required(i18n.t(REQUIRED_MESSAGE)),
    }),
  ),
  [PackagesFields.adults]: yup.array().of(
    yup.object().shape({
      [PackagesFields.firstName]: yup.string().required(i18n.t(REQUIRED_MESSAGE)),
      [PackagesFields.lastName]: yup.string().required(i18n.t(REQUIRED_MESSAGE)),
      [PackagesFields.birthDate]: yup.string().required(i18n.t(REQUIRED_MESSAGE)),
    }),
  ),
});

export const bookSecondTabScheme = (amount: number, payFullPrice: boolean) =>
  yup.object().shape({
    [PackagesFields.amountToBePaid]: yup
      .string()
      .required(i18n.t(REQUIRED_MESSAGE))
      .test(
        'more-than',
        () =>
          i18n.t('amountToBePaidErrorMessage', {
            amount: numberWithCommaNormalizer(payFullPrice ? amount : Math.ceil(amount / 2) || ''),
            maxAmount: numberWithCommaNormalizer(amount),
          }),
        (value, context) => {
          const stringTypeAmount = amount.toString();

          if (context.parent[CustomFields.payFullPrice]) {
            return value >= stringTypeAmount;
          }

          return +value >= amount / 2 && +value <= +stringTypeAmount;
        },
      ),
    [CustomFields.payFullPrice]: yup.boolean(),
  });
