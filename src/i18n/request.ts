import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from './routing';
import enMessages from '../messages/en.json';
import msMessages from '../messages/ms.json';

const messageMap: Record<string, any> = {
  en: enMessages,
  ms: msMessages
};

export default getRequestConfig(async ({locale}) => {
  const currentLocale = locale && routing.locales.includes(locale as any) ? locale : 'en';

  return {
    locale: currentLocale as string,
    messages: messageMap[currentLocale as string] || enMessages
  };
});
