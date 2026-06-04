import { createI18n } from 'vue-i18n'
import { messages, type SupportedLocale } from './messages'

export const supportedLocales: SupportedLocale[] = ['en', 'zh-TW', 'ja']

const getInitialLocale = (): SupportedLocale => {
  const storedLocale = localStorage.getItem('locale')

  if (storedLocale && supportedLocales.includes(storedLocale as SupportedLocale)) {
    return storedLocale as SupportedLocale
  }

  const browserLocale = navigator.language

  if (browserLocale.startsWith('zh')) return 'zh-TW'
  if (browserLocale.startsWith('ja')) return 'ja'

  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages
})
