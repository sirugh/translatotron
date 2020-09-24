const parse = require("csv-parse/lib/sync");

const fs = require("fs");
const path = require("path");

const newFolder = "./new/";
const legacyFolder = "./legacy/";
const generatedFolder = "./generated/";

const newFilePath = path.resolve(newFolder, "en_US.json");
const legacyFilePath = path.resolve(legacyFolder, `en_US.csv`);

// 1. Read new copy.
console.log(`Reading ${newFilePath}.`);

const newTranslations = JSON.parse(fs.readFileSync(newFilePath, "utf8"));

// console.log("\n------ NEW TRANSLATIONS ------");
// console.log(`${JSON.stringify(newTranslations, null, 2)}`);
// console.log("------------------------------\n");

// 2. Read legacy copy.
console.log(`Reading ${legacyFilePath}.`);

const legacyTranslations = {};
parse(fs.readFileSync(legacyFilePath, "utf8"), {
  columns: ["key", "value"],
}).forEach(({ key, value }) => (legacyTranslations[key] = value));

// console.log("\n---- LEGACY TRANSLATIONS ----");
// console.log(`${JSON.stringify(legacyTranslations, null, 2)}`);
// console.log("------------------------------\n");

// 3. Convert both to string:key map
const legacyStringtoKey = {};
Object.keys(legacyTranslations).forEach((key) => {
  // TODO: If a string can correlate to more than one key this will need to be an array.
  // ie { key1: 'samevalue', key2: 'samevalue'}
  legacyStringtoKey[legacyTranslations[key]] = key;
});

const newStringToKey = {};
Object.keys(newTranslations).forEach((key) => {
  // TODO: If a string can correlate to more than one key this will need to be an array.
  // ie { key1: 'samevalue', key2: 'samevalue'}
  newStringToKey[newTranslations[key]] = key;
});

// 4. Generate map of legacy keys to new keys.
const legacyKeyToNewKeyMap = {};
Object.keys(newStringToKey).forEach((key) => {
  const value = legacyStringtoKey[key];
  if (value) {
    legacyKeyToNewKeyMap[value] = newStringToKey[key];
  }
});
console.log("\n---- LEGACY KEY:NEW KEY MAP ----");
console.log(JSON.stringify(legacyKeyToNewKeyMap, null, 2));
console.log("------------------------------\n");

// 5. Generate new assets from existing csv using key map.
fs.readdir(legacyFolder, (err, files) => {
  files.forEach((file) => {
    const generatedFilePath = path.resolve(
      generatedFolder,
      `${file.split(".csv")[0]}.json`
    );
    const generatedMissedStringFilePath = path.resolve(
      generatedFolder,
      `${file.split(".csv")[0]}_missed.json`
    );

    console.log(`Generating new i18n for ${file} at ${generatedFilePath}`);
    const legacyFile = fs.readFileSync(
      path.resolve(legacyFolder, file),
      "utf8"
    );
    const legacyCsvParsed = parse(legacyFile, {
      columns: ["key", "value"],
    });

    const generated = {};

    // Iterate over the legacy csv and add each to the new i18n object using
    // the new key if one was found.
    legacyCsvParsed.forEach((row) => {
      const newKey = legacyKeyToNewKeyMap[row.key];
      if (newKey) {
        generated[legacyKeyToNewKeyMap[row.key]] = row.value;
      } else {
        // TODO: What do we do with legacy key:strings that don't match a pwa studio string?
        // generated[row.key] = row.value;
      }
    });

    const generatedKeys = Object.keys(generated);
    fs.writeFileSync(
      generatedFilePath,
      JSON.stringify(generated, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
    console.log(`  Wrote ${generatedFilePath}.`);

    // Iterate over new translations and add any that didn't match a legacy.
    const missedStrings = {};
    Object.keys(newTranslations).forEach((key) => {
      if (!generatedKeys.includes(key)) {
        missedStrings[key] = newTranslations[key];
      }
    });

    fs.writeFileSync(
      generatedMissedStringFilePath,
      JSON.stringify(missedStrings, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
    console.log(`  Wrote ${generatedMissedStringFilePath}.`);
  });
});
