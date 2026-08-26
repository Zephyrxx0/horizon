import { describe, it, expect, beforeEach } from 'vitest';
import i18n, { changeLocale, LOCALES, NAMESPACES } from './index';

describe('i18n loader machinery', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    await changeLocale('en');
  });

  it('exports expected namespaces', () => {
    expect(NAMESPACES).toEqual(['common', 'wizard', 'help', 'errors']);
  });

  it('exports all 6 supported locales with codes, labels, and englishNames', () => {
    expect(LOCALES).toHaveLength(6);
    const codes = LOCALES.map((l) => l.code);
    expect(codes).toEqual(['en', 'hi', 'ta', 'te', 'kn', 'mr']);
  });

  it('initializes with English as default locale and loads all 4 namespaces', () => {
    expect(i18n.language).toBe('en');
    for (const ns of NAMESPACES) {
      expect(i18n.hasResourceBundle('en', ns)).toBe(true);
    }
  });

  it('dynamically loads all 4 namespaces when switching to Indic languages', async () => {
    const indicLocales = ['hi', 'ta', 'te', 'kn', 'mr'];

    for (const lng of indicLocales) {
      await changeLocale(lng);
      expect(i18n.language).toBe(lng);
      expect(document.documentElement.lang).toBe(lng);

      for (const ns of NAMESPACES) {
        expect(i18n.hasResourceBundle(lng, ns)).toBe(true);
      }
    }
  });

  it('translates keys across namespaces in Hindi correctly', async () => {
    await changeLocale('hi');
    expect(i18n.t('common:actions.continue')).toBe('आवेदन जारी रखें');
    expect(i18n.t('wizard:steps.trip')).toBe('वीज़ा चयन');
    expect(i18n.t('help:categories.passport')).toBe('पासपोर्ट और बायो-डेटा');
    expect(i18n.t('errors:system.fileTooLarge')).toContain('5MB');
  });

  it('translates keys across namespaces in Tamil correctly', async () => {
    await changeLocale('ta');
    expect(i18n.t('common:actions.continue')).toBe('விண்ணப்பத்தைத் தொடரவும்');
    expect(i18n.t('wizard:steps.trip')).toBe('விசா தேர்வு');
    expect(i18n.t('help:categories.passport')).toBe('பாஸ்போர்ட் மற்றும் பயோ-டேட்டா');
  });

  it('translates keys across namespaces in Telugu correctly', async () => {
    await changeLocale('te');
    expect(i18n.t('common:actions.continue')).toBe('దరఖాస్తును కొనసాగించండి');
    expect(i18n.t('wizard:steps.trip')).toBe('వీసా ఎంపిక');
    expect(i18n.t('help:categories.passport')).toBe('పాస్‌పోర్ట్ మరియు బయో-డేటా');
  });

  it('translates keys across namespaces in Kannada correctly', async () => {
    await changeLocale('kn');
    expect(i18n.t('common:actions.continue')).toBe('ಅರ್ಜಿಯನ್ನು ಮುಂದುವರಿಸಿ');
    expect(i18n.t('wizard:steps.trip')).toBe('ವೀಸಾ ಆಯ್ಕೆ');
    expect(i18n.t('help:categories.passport')).toBe('ಪಾಸ್‌ಪೋರ್ಟ್ ಮತ್ತು ಬಯೋ-ಡೇಟಾ');
  });

  it('translates keys across namespaces in Marathi correctly', async () => {
    await changeLocale('mr');
    expect(i18n.t('common:actions.continue')).toBe('अर्ज सुरू ठेवा');
    expect(i18n.t('wizard:steps.trip')).toBe('व्हिसा निवड');
    expect(i18n.t('help:categories.passport')).toBe('पासपोर्ट आणि बायो-डेटा');
  });

  it('safely ignores unlisted locale change request', async () => {
    await changeLocale('fr');
    expect(i18n.language).toBe('en');
  });
});
