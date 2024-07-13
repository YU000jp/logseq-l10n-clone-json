const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { sourceFilePathName, targetLanguages, folderPath, endpoint, azureKey, location, keyOrValue, testMode } = require('./config');

const main = async () => {
  const sourceFilePath = path.join(folderPath, sourceFilePathName);
  const sourceFile = fs.readFileSync(sourceFilePath, 'utf8');
  const sourceJson = JSON.parse(sourceFile);
  console.log(`Source file ${sourceFilePath} parsed.`);

  if (testMode) {

    // test mode is on

    const targetFilePath = sourceFilePath;
    const language = sourceFilePathName.split(".")[0];
    const targetJson = {};
    for (const [key, value] of Object.entries(sourceJson)) {

      //console.log(`Translating ${value}...`);
      const response = await axios.post(`${endpoint}/translate`, [{
        'text': key
      }], {
        headers: {
          'Ocp-Apim-Subscription-Key': azureKey,
          'Ocp-Apim-Subscription-Region': location,
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
        params: {
          'api-version': '3.0',
          'to': language
        },
        responseType: 'json'
      });
      targetJson[key] = response.data[0].translations[0].text;
      //console.log(`Translated ${key} to ${targetJson[key]}`);
    }

    // Skip empty files
    if (Object.keys(targetJson).length === 0) {
      console.log(`File ${targetFilePath} is empty. Skipping translation.`);
      return;
    }

    // Write the translated file
    fs.writeFileSync(targetFilePath, JSON.stringify(targetJson, null, 2), 'utf8');//format
    console.log(`File ${targetFilePath} created and translated.`);



  } else {

    // test mode is off

    for (const language of targetLanguages) {
      const targetFilePath = path.join(folderPath, `${language}.json`);
      if (fs.existsSync(targetFilePath)) {
        console.log(`File ${targetFilePath} already exists. Skipping translation.`);
        continue;
      }
      console.log(`File ${targetFilePath} does not exist. Translating to ${language}...`);

      const targetJson = {};
      for (const [key, value] of Object.entries(sourceJson)) {

        // Skip empty values
        if (value === "") {
          targetJson[key] = value;
          continue;
        }

        //console.log(`Translating ${value}...`);
        const response = await axios.post(`${endpoint}/translate`, [{
          'text': keyOrValue === "key" ? key : value
        }], {
          headers: {
            'Ocp-Apim-Subscription-Key': azureKey,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
          },
          params: {
            'api-version': '3.0',
            'to': language
          },
          responseType: 'json'
        });
        targetJson[key] = response.data[0].translations[0].text;
        //console.log(`Translated ${key} to ${targetJson[key]}`);
      }

      // Skip empty files
      if (Object.keys(targetJson).length === 0) {
        console.log(`File ${targetFilePath} is empty. Skipping translation.`);
        continue;
      }

      // Write the translated file
      fs.writeFileSync(targetFilePath, JSON.stringify(targetJson, null, 2), 'utf8');//format
      console.log(`File ${targetFilePath} created and translated.`);

      // Wait 100ms to avoid throttling
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

main();