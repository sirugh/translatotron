const parse = require("csv-parse/lib/sync");

const fs = require("fs");
const path = require("path");

const copyFolder = "./copy/";
const legacyFolder = "./legacy/";
const generatedFolder = "./generated/";

const copyFilePath = path.resolve(copyFolder, "en_US.json");
const legacyFilePath = path.resolve(legacyFolder, `en_US.csv`);

// 1. Read new copy.
console.log(`Reading ${copyFilePath}.`);

const newTranslations = JSON.parse(fs.readFileSync(copyFilePath, "utf8"));

// console.log("\n------ NEW TRANSLATIONS ------");
// console.log(`${JSON.stringify(newTranslations, null, 2)}`);
// console.log("------------------------------\n");

// 2. Read legacy copy.
console.log(`Reading ${legacyFilePath}.`);

const legacyTranslations = {};
parse(fs.readFileSync(legacyFilePath, "utf8"), {
  columns: ["key", "value"],
    relax_column_count: true,
    trim: true

}).forEach(({ key, value }) => (legacyTranslations[key] = value));

// console.log("\n---- LEGACY TRANSLATIONS ----");
// console.log(`${JSON.stringify(legacyTranslations, null, 2)}`);
// console.log("------------------------------\n");

// 3. Convert both to string:[key] map
// ie { key1: 'samevalue', key2: 'samevalue'} => { 'samevalue': ['key1', 'key2'] }
const legacyStringtoKey = {};
Object.keys(legacyTranslations).forEach((key) => {
  legacyStringtoKey[legacyTranslations[key]] =
    legacyStringtoKey[legacyTranslations[key]] || [];
  legacyStringtoKey[legacyTranslations[key]].push(key);
});

const newStringToKey = {};
Object.keys(newTranslations).forEach((key) => {
  newStringToKey[newTranslations[key]] =
    newStringToKey[newTranslations[key]] || [];
  newStringToKey[newTranslations[key]].push(key);
});

// 4. Generate map of legacy keys to new keys.
const legacyKeyToNewKeyMap = {};
Object.keys(newStringToKey).forEach((key) => {
  const valueArray = (legacyStringtoKey[key] || []).map((value) => {
    legacyKeyToNewKeyMap[value] = newStringToKey[key];
  });
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
        relax_column_count: true,
        trim: true
    });

    const generated = {};

    // Iterate over the legacy csv and add each to the new i18n object using
    // the new key if one was found.
    legacyCsvParsed.forEach((row) => {
      const newKeys = legacyKeyToNewKeyMap[row.key];
      if (newKeys) {
        newKeys.map((newKey) => {
          generated[newKey] = row.value;
        });
      } else {
        // TODO: What do we do with legacy key:strings that don't match a pwa studio string?
      }
    });

    const generatedSorted = {};
    Object.keys(generated)
      .sort()
      .forEach((key) => (generatedSorted[key] = generated[key]));
    fs.writeFileSync(
      generatedFilePath,
      JSON.stringify(generatedSorted, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
    console.log(`  Wrote ${generatedFilePath}.`);

    // Iterate over new translations and add any that didn't match a legacy.
    const generatedKeys = Object.keys(generated);
    const missedStrings = {};
    Object.keys(newTranslations)
      .sort()
      .forEach((key) => {
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
