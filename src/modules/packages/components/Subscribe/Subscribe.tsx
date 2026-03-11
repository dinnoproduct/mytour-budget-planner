import { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import './index.scss';
import MInput from '../../../../components/FormControls/MInput/MInput.tsx';
import { useForm, FormProvider, type FieldValues } from 'react-hook-form';
import { CustomFields } from '../../data/packagesEnums.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import { subscribeScheme } from '../../scheme/scheme.ts';
import useSubscribe from '../../hooks/useSubscribe.ts';
import { Loader } from '@/components/Loader/Loader';
import classnames from 'classnames';

const Subscribe: FC = () => {
  const { t } = useTranslation();
  const { isSubscribed, loading, onSubscribe } = useSubscribe();

  const formData = useForm({
    resolver: yupResolver(subscribeScheme),
    defaultValues: {
      [CustomFields.email]: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { errors },
  } = formData;

  const onSubmit = (values: FieldValues) => {
    onSubscribe(values[CustomFields.email] as string);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Loader loading={loading} />
      <FormProvider {...formData}>
        <div className="subscribe text-center flex">
          {isSubscribed ? (
            <div>
              <div>
                <img src="/images/subscribe-success.svg" alt="" />
              </div>
              <div className="subscribe-success-title font-bold">{t('successfullySubscribed')}</div>
            </div>
          ) : (
            <div>
              <div>
                <img src="/images/subscribe-soon.svg" alt="" />
              </div>
              <div className="subscribe-title font-bold">{t('newDirectionsSoon')}</div>
              <div className="subscribe-subtitle font-bold">{t('subscribeSlogan')}</div>
              <div className="subscribe-subtitle-small">{t('subscribeCTA')}</div>
              <div className="subscribe-action">
                <MInput placeholder={t('emailPlaceholder')} name={CustomFields.email} />
                <button
                  className={classnames('primary-button subscribe_home', { 'm-b-18': errors[CustomFields.email] })}
                  type="submit"
                >
                  {t('subscribe')}
                </button>
              </div>
            </div>
          )}
        </div>
      </FormProvider>
    </form>
  );
};

export default Subscribe;
