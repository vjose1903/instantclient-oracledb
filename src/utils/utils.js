const os = require('os');
const path = require('path');
const oracledb = require('oracledb');

function getInstantClientPath() {
  const current_platform = os.platform();
  let oracleClientPath;
  if (current_platform == 'win32' || current_platform == 'darwin' || current_platform == 'linux') {
    oracleClientPath = `./instantclient/${current_platform}`;
  } else {
    return { error: true, msg: "Unsupported system platform, 'available platforms are: Windows, MacOS, Linux'." };
  }

  const fullOracleClientPath = path.resolve(__dirname, oracleClientPath);
  return fullOracleClientPath;
}

function initClient(oracleClientPath) {
  return new Promise((resolve, reject) => {
    try {
      oracledb.initOracleClient({ libDir: oracleClientPath });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { getInstantClientPath, initClient };
