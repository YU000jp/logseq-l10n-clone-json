const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { sourceFilePathName, targetLanguages, folderPath, endpoint, azureKey, location, keyOrValue, testMode, overwrite } = require('./config');

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
      if (keyOrValue === "value"
        && value === "")
        continue; // Skip empty keys

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
      if (sourceFilePathName === `${language}.json`) {
        console.log(`Source and target files are the same. Skipping translation.`);
        continue;
      }
      else
        if (fs.existsSync(targetFilePath)) {
          if (overwrite === false) {
            console.log(`File ${targetFilePath} already exists. Skipping translation.`);
            continue;
          } else {
            console.log(`File ${targetFilePath} already exists. Overwriting...`);
          }
        } else {
          console.log(`File ${targetFilePath} does not exist.`);
        }

      console.log(`Translating to ${language}...`);

      const targetJson = {};
      if (fs.existsSync(targetFilePath)) {
        const targetFile = fs.readFileSync(targetFilePath, 'utf8');
        const existingTargetJson = JSON.parse(targetFile);
        Object.assign(targetJson, existingTargetJson);
      }

      for (const [key, value] of Object.entries(sourceJson)) {
        // Skip empty values
        if (keyOrValue === "value" && value === "") {
          targetJson[key] = value;
          continue;
        }

        // Skip if the key already exists in the target file
        if (targetJson.hasOwnProperty(key)) {
          console.log(`Key ${key} already exists in the target file. Skipping translation.`);
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