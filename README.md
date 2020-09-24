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

After an initial pass, using [PWA Studio's i18n/en_US.json](https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/i18n/en_US.json) and Magento's legacy [nl_NL.csv](https://github.com/magento-l10n/language-nl_NL/blob/master/nl_NL.csv) and [en_US.csv](https://github.com/magento-l10n/language-en_US/blob/master/en_US.csv), we get `nl_NL.json`:

```json
{
  "About Us": "Over ons",
  "Contact Us": "Neem contact met ons op",
  "Copyright © 2013-present Magento, Inc. All rights reserved.": "Copyright © 2013-heden Magento. Alle rechten voorbehouden.",
  "Order Status": "Bestelling Status",
  "Returns": "Retouren",
  "Sign Out": "Uitloggen",
  "accountMenu.accountInfoLink": "Accountgegevens",
  "accountMenu.addressBookLink": "Adresboek",
  "accountMenu.communicationsLink": "Communicatie",
  "accountMenu.orderHistoryLink": "Bestelgeschiedenis",
  "accountTrigger.signIn": "Inloggen",
  "otherComponent.addToCart": "In Winkelwagen",
  "searchTrigger.label": "Zoek",
  "wishlistItem.addToCart": "In Winkelwagen"
}
```

and `nl_NL_missed.json`, which are PWA Studio keys/strings that did not match a legacy translation:

```json
{
  " in {label}": " in {label}",
  "Account": "Account",
  "Email Signup": "Email Signup",
  "Follow Us!": "Follow Us!",
  "Give Back": "Give Back",
  "Help": "Help",
  "Hi, {name}": "Hi, {name}",
  "Live Chat": "Live Chat",
  "Lorem ipsum dolor sit amet, consectetur adipsicing elit, sed do eiusmod tempor incididunt ut labore et dolore.": "Lorem ipsum dolor sit amet, consectetur adipsicing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
  "Our Story": "Our Story",
  "Privacy Policy": "Privacy Policy",
  "Product Suggestions": "Product Suggestions",
  "Register": "Register",
  "Terms of Use": "Terms of Use",
  "Toggle navigation panel": "Toggle navigation panel",
  "accountMenu.favoritesListsLink": "Favorites Lists",
  "accountMenu.savedPaymentsLink": "Saved Payments",
  "accountMenu.storeCreditLink": "Store Credit & Gift Cards",
  "accountTrigger.ariaLabel": "Toggle My Account Menu",
  "autocomplete.emptyResult": "No results were found.",
  "autocomplete.error": "An error occurred while fetching results.",
  "autocomplete.loading": "Fetching results...",
  "autocomplete.prompt": "Search for a product",
  "autocomplete.resultSummary": "{resultCount} items",
  "cartTrigger.ariaLabel": "Toggle mini cart. You have {count} items in your cart.",
  "logo.title": "Venia",
  "navigationTrigger.ariaLabel": "Toggle navigation panel",
  "savedPaymentsPage.addButtonText": "Add a credit card",
  "savedPaymentsPage.subHeading": "Credit Cards saved here will be available during checkout.",
  "savedPaymentsPage.title": "Saved Payments - {store_name}",
  "wishlistItem.addToCartError": "Something went wrong. Please refresh and try again."
}
```

## Notes

Duplicate strings in PWA Studio are also handled:

```js
// original/en_US.json
{
  "wishlistItem.addToCart": "Add to Cart",
  "otherComponent.addToCart": "Add to Cart"
}

// nl_NL.json
{
  "wishlistItem.addToCart": "In Winkelwagen",
  "otherComponent.addToCart": "In Winkelwagen",
}
```
