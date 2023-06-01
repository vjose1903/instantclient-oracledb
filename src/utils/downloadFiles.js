const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const axios = require('axios');
const AdmZip = require('adm-zip');

const urlPerSystem = {
  win32: [
    { url: 'https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html#:~:text=are%3A%20Basic%2C-,Basic%20Light,-%2C%20SQL*Plus', name: 'basicLight.zip', },
    { url: 'https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html#:~:text=Basic%20Light%2C-,SQL*Plus,-%2C%20Tools%2C', name: 'sqlplus.zip', },
  ],
  darwin: [
    { url: 'https://download.oracle.com/otn_software/mac/instantclient/instantclient-basiclite-macos.zip', name: 'basicLight.zip' },
    { url: 'https://download.oracle.com/otn_software/mac/instantclient/instantclient-sqlplus-macos.zip', name: 'sqlplus.zip' },
  ],
  linux: [
    { url: 'https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip', name: 'basicLight.zip' },
    { url: 'https://download.oracle.com/otn_software/linux/instantclient/instantclient-sqlplus-linuxx64.zip', name: 'sqlplus.zip' },
  ],
};

async function unzipFile(zipFilePath, destinationPath, fileName) {
  const zip = new AdmZip(zipFilePath);
  const tempExtractPath = path.join(__dirname, `temp_extract-${fileName}`);

  zip.extractAllTo(tempExtractPath, true);

  const files = fs.readdirSync(tempExtractPath);
  const dynamicFolderName = files.find((file) => fs.lstatSync(path.join(tempExtractPath, file)).isDirectory());

  if (!dynamicFolderName) {
    throw new Error('The dynamic folder was not found in the ZIP file');
  }

  const dynamicFolderPath = path.join(tempExtractPath, dynamicFolderName);
  fs.copySync(dynamicFolderPath, destinationPath, {
    overwrite: false,
    errorOnExist: false,
    filter: (src, dest) => {
      const fileName = path.basename(src);
      const destinationFile = path.join(destinationPath, fileName);
      const fileExists = fs.existsSync(destinationFile);

      return !fileExists;
    },
  });

  fs.removeSync(tempExtractPath);
}

async function tempDirAction(method, fileName = '') {
  const tempDirectoryPath = path.join(__dirname, 'tempDir');
  const tempFilePath = path.join(tempDirectoryPath, fileName);

  if (method === 'create') {
    await fs.mkdirp(tempDirectoryPath);
    return tempFilePath;
  } else {
    await fs.remove(tempDirectoryPath);
    return tempFilePath;
  }
}

async function downloadFile(fileData, destinationPath) {
  const tempFilePath = await tempDirAction('create', fileData.name);

  const response = await axios.get(fileData.url, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'binary');
  fs.writeFileSync(tempFilePath, buffer);

  await unzipFile(tempFilePath, destinationPath, fileData.name);
}

async function downloadInstantClientFiles() {
  try {
    const currentPlatform = os.platform();
    const instantClientFiles = urlPerSystem[currentPlatform];
    const instantClientDestination = path.join(__dirname, 'instantclient', currentPlatform);

    if (!fs.pathExistsSync(instantClientDestination) || fs.readdirSync(instantClientDestination).length === 0) {
      await fs.mkdirp(instantClientDestination);

      const promiseList = instantClientFiles.map((file) => downloadFile(file, instantClientDestination));
      await Promise.all(promiseList);
      await tempDirAction('remove');

      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      console.log('\n============================================================');
      console.log('|        Instant Client files downloaded successfully       |');
      console.log('============================================================');
    }
  } catch (error) {
    console.error(`\nError downloading file: ${error}`);
  }
}

downloadInstantClientFiles();
