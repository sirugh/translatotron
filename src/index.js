const parse = require("csv-parse/lib/sync");

const fs = require("fs");
const path = require("path");

const newFolder = "./new/";
const legacyFolder = "./legacy/";
const generatedFolder = "./generated/";

const newFilePath = path.resolve(newFolder, "en_US.json");
const legacyFilePath = path.resolve(legacyFolder, `en_US.csv`);

console.log(`Reading ${newFilePath}.`);

const newTranslations = JSON.parse(fs.readFileSync(newFilePath, "utf8"));

console.log("\n------ NEW TRANSLATIONS ------");
console.log(`${JSON.stringify(newTranslations, null, 2)}`);
console.log("------------------------------\n");

console.log(`Reading ${legacyFilePath}.`);

const legacyTranslations = {};
parse(fs.readFileSync(legacyFilePath, "utf8"), {
  columns: ["key", "value"],
}).forEach(({ key, value }) => (legacyTranslations[key] = value));

console.log("\n---- LEGACY TRANSLATIONS ----");
console.log(`${JSON.stringify(legacyTranslations, null, 2)}`);
console.log("------------------------------\n");

const legacyStringtoKey = {};
Object.keys(legacyTranslations).forEach((key) => {
  legacyStringtoKey[legacyTranslations[key]] = key;
});

const newStringToKey = {};
Object.keys(newTranslations).forEach((key) => {
  newStringToKey[newTranslations[key]] = key;
});

const legacyKeyToNewKeyMap = {};
Object.keys(newStringToKey).forEach((key) => {
  console.log(`Checking for legacy key for "${key}"...`);
  const value = legacyStringtoKey[key];
  if (value) {
    console.log(
      `  Found legacy key "${value}" with matching value as new key "${newStringToKey[key]}"`
    );
    legacyKeyToNewKeyMap[value] = newStringToKey[key];
  } else {
    console.log("  No results.");
  }
});
console.log("\n---- LEGACY KEY:NEW KEY MAP ----");
console.log(JSON.stringify(legacyKeyToNewKeyMap, null, 2));
console.log("------------------------------\n");

// Now that we have a map of keys we can use it to generate new
// i18n assets for each existing csv.
fs.readdir(legacyFolder, (err, files) => {
  files.forEach((file) => {
    const generatedFilePath = path.resolve(
      generatedFolder,
      `${file.split(".csv")[0]}.json`
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
        generated[row.key] = row.value;
      }
    });

    const generatedKeys = Object.keys(generated);
    // Iterate over new translations and add any that didn't match a legacy.
    Object.keys(newTranslations).forEach((key) => {
      if (!generatedKeys.includes(key)) generated[key] = newTranslations[key];
    });

    fs.writeFileSync(
      generatedFilePath,
      JSON.stringify(generated, null, 2),
      (err) => {
        if (err) throw err;
      }
    );
    console.log(`  Wrote ${generatedFilePath}.`);
  });
});
