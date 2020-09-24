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

## Outcome

After an initial pass, using [PWA Studio's i18n/en_US.json](https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/i18n/en_US.json) and Magento's legacy [nl_NL.csv](https://github.com/magento-l10n/language-nl_NL/blob/master/nl_NL.csv) and [en_US.csv](https://github.com/magento-l10n/language-en_US/blob/master/en_US.csv):

```json
{
  "wishlistItem.addToCart": "In Winkelwagen",
  "accountMenu.accountInfoLink": "Accountgegevens",
  "searchTrigger.label": "Zoek",
  "Sign Out": "Uitloggen",
  "accountMenu.communicationsLink": "Communicatie",
  "accountTrigger.signIn": "Inloggen",
  "Contact Us": "Neem contact met ons op",
  "accountMenu.addressBookLink": "Adresboek",
  "Order Status": "Bestelling Status",
  "Returns": "Retouren",
  "accountMenu.orderHistoryLink": "Bestelgeschiedenis",
  "Copyright © 2013-present Magento, Inc. All rights reserved.": "Copyright © 2013-heden Magento. Alle rechten voorbehouden.",
  "About Us": "Over ons"
}
```
