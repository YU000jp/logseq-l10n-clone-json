
//Command to run: node index.cjs


/**
 * Azure Cognitive Services Translation API key.
 * @type {string}
 */
const azureKey = "here is your key"; // e.g. "1234567890abcdef1234567890abcdef"


/**
 * Azure Cognitive Services Translation API endpoint.
 * @type {string}
 */
const endpoint = "https://api.cognitive.microsofttranslator.com/";

/**
 * Azure Cognitive Services Translation API location.
 * @type {string}
 */
const location = "global"; 

/**
 * The folder path where the translation files are stored.
 * @type {string}
 */
const folderPath = "D:\\Resource\\GitHub\\logseq-plugin-quickly-para-method\\src\\translations\\";

/**
 * The path to the source translation file.
 * @type {string}
 */
const sourceFilePathName = "ja.json";

/**
 * An array of target languages to translate the source file to.
 * @type {string[]}
 */
const targetLanguages = [
  "af",
  "de",
  "es",
  "fr",
  "id",
  "it",
  "ja",
  "ko",
  "nb-NO",
  "nl",
  "pl",
  "pt-BR",
  "pt-PT",
  "ru",
  "sk",
  "tr",
  "uk",
  "zh-CN",
  "zh-Hant",
];

module.exports = {
  azureKey,
  endpoint,
  location,
  folderPath,
  sourceFilePathName,
  targetLanguages,
};
