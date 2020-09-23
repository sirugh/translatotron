# Translatotron

Converts Magento's [localization CSV files](https://github.com/magento-l10n?utf8=%E2%9C%93&q=%5Elanguage-) into the
`i18n/xx_YY.json` format.

> Ideally PWA Studio would re-use as much of the already existing translations provided by the Magento community as to not require another huge undertaking for the community.

Implement a tool that generates some initial translation files for PWA Studio based purely on matches of string values. The following assumes we use the `context.id` pattern but would work either way.

1. New message in PWA Studio's `i18n/en_US.json`:

```json
"myComponent.message": "This is an en_US string"
```

2. Find key in legacy (default locale?) translation by matching on value:

```json
// legacy en_US translation
"legacy key string": "This is an en_US string",
```

3. Looks up all translated matches for key:

```json
// legacy de_DE translation
"legacy key string": "Dies ist ein de_DE Satz"
```

4. Creates PWA Studio's i18n/de_DE.json:

```json
"myComponent.message": "Dies ist ein de_DE Satz"
```

See [related thread](https://github.com/magento/pwa-studio/issues/669#issuecomment-696782372)
