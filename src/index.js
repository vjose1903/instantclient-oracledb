const { getInstantClientPath, initClient } = require("./utils/utils");
const oracledb = require("oracledb");

class InstantClientOracledb {
  static initialized = false;

  static initOracleClient() {
    if (!this.initialized) {
      const instantClientPath = getInstantClientPath();

      initClient(instantClientPath)
        .then(() => {
          this.initialized = true;
          console.log("The Instant Client has been initialized successfully");
        })
        .catch((error) => {
          console.error("Error initializing the Instant Client:", error);
        });
    } else {
      console.error("Oracle instant client is already initialized.");
    }
  }
}

module.exports = { InstantClientOracledb, oracledb };
