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
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as any)) notFound();

  return {
    locale: locale as string,
    messages: messageMap[locale as string] || enMessages
  };
});
