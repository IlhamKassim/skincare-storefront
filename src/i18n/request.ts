import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
import enMessages from '../messages/en.json';
import msMessages from '../messages/ms.json';

type Locale = (typeof routing.locales)[number];

const messageMap: Record<Locale, typeof enMessages> = {
  en: enMessages,
  ms: msMessages
};

function isLocale(value: string): value is Locale {
  return routing.locales.includes(value as Locale);
}

export default getRequestConfig(async ({locale}) => {
  const currentLocale: Locale = locale && isLocale(locale) ? locale : 'en';

  return {
    locale: currentLocale,
    messages: messageMap[currentLocale]
  };
});
