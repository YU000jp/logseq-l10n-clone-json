const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { sourceFilePathName, targetLanguages, folderPath, endpoint, azureKey, location } = require('./config');

const main = async () => {
  const sourceFilePath = path.join(folderPath, sourceFilePathName);
  const sourceFile = fs.readFileSync(sourceFilePath, 'utf8');
  const sourceJson = JSON.parse(sourceFile);
  console.log(`Source file ${sourceFilePath} parsed.`);

  for (const language of targetLanguages) {
    const targetFilePath = path.join(folderPath, `${language}.json`);
    if (fs.existsSync(targetFilePath)) {
      console.log(`File ${targetFilePath} already exists. Skipping translation.`);
      continue;
    }
    console.log(`File ${targetFilePath} does not exist. Translating to ${language}...`);

    const targetJson = {};
    for (const [key, value] of Object.entries(sourceJson)) {
      //console.log(`Translating ${value}...`);
      const response = await axios.post(`${endpoint}/translate`, [{
        'text': value
      }], {
        headers: {
          'Ocp-Apim-Subscription-Key': azureKey,
          'Ocp-Apim-Subscription-Region': location,
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
        params: {
          'api-version': '3.0',
          'from': 'ja',
          'to': language
        },
        responseType: 'json'
      });

      targetJson[key] = response.data[0].translations[0].text;
      //console.log(`Translated ${key} to ${targetJson[key]}`);
    }

    //format JSON
    fs.writeFileSync(targetFilePath, JSON.stringify(targetJson, null, 2));
    console.log(`File ${targetFilePath} created and translated.`);
    //少し時間を空ける
    await new Promise(resolve => setTimeout(resolve, 100));
  }
};

main();