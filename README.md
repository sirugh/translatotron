# Translatotron

Converts Magento's [localization CSV files](https://github.com/magento-l10n?utf8=%E2%9C%93&q=%5Elanguage-) into the
`i18n/xx_YY.json` format expected by [PWA Studio](https://github.com/magento/pwa-studio).

## Goal

> Ideally PWA Studio would re-use as much of the already existing translations provided by the Magento community as to not require another huge undertaking for the community.

The idea is to:

1. Take a JSON file of translations, use each value as a key:

```json
"myComponent.message": "This is an en_US string"
```

2. Find corresponding key for the value, `This is an en_US string`, in an old translation file:

```csv
"legacy key string","This is an en_US string"
```

3. Look for `legacy key string` in other translation files:

```json
"legacy key string": "Dies ist ein de_DE Satz"
```

4. Generate new i18n file containing new key but existing value:

```json
"myComponent.message": "Dies ist ein de_DE Satz"
```

See [related thread](https://github.com/magento/pwa-studio/issues/669#issuecomment-696782372)
