declare module 'i18n-js' {
    interface Translations {
      [key: string]: any;
    }
  
    export default class I18n {
      constructor(translations: Translations);
      locale: string;
      fallbacks: boolean;
      translations: Translations;
      t(scope: string, options?: any): string;
    }
  }