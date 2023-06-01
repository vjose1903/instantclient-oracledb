# @vjose1903/instantclient-oracledb 
A library that contains Oracle Instant Client drivers and provides functionality to initialize oracledb with the corresponding drivers. It allows using oracledb without the need to install it directly in other projects, as it is included and exported by this library.

---
**Table of Contents**
1. [Install the library](#id1)
2. [Importing the library](#id2)
3. [Usage](#id3)
   - [Initializing Oracle Instant Client](#id4)
   - [Using oracledb](#id5)
4. [Example: Executing a query](#id6)
---
<div id='id1' />

## Install the library
```
npm install @vjose1903/instantclient-oracledb
```
When running the `npm i` command, an automatic validation will be performed on the corresponding path to check if any files exist or  if the folder is empty. If the path is empty or doesn't contain any files, the required Instant Client files will be downloaded from the Oracle repository.
This process is defined in the `postinstall` script specified in the `package.json` file. The `postinstall` script is executed automatically after the installation of dependencies, ensuring that the required Instant Client files are available for your project. 
During the `postinstall` step, a loading indicator may be displayed to indicate the progress of the download. Please note that the download time may vary depending on your internet connection speed. It is recommended to have appropriate permissions on the destination path to avoid any writing issues.

<div id='id2' />

## Importing the library

Import the `InstantClientOracledb` or the `oracledb` from the library:

##### Javascript:
```javascript
const { InstantClientOracledb, oracledb } = require("@vjose1903/instantclient-oracledb");
```

##### Typescript:
```typescript
import { InstantClientOracledb, oracledb } from "@vjose1903/instantclient-oracledb";
```


<div id='id3' />

## Usage


<div id='id4' />

#### Initializing Oracle Instant Client
The library provides a method called `forRoot` to initialize the Oracle Instant Client. This method must be called before using `oracledb`.

```javascript
import { InstantClientOracledb } from "@vjose1903/instantclient-oracledb";
...
...

InstantClientOracledb.initOracleClient()
  .then(() => {
    // Instant Client has been initialized successfully, you can now use oracledb
  })
  .catch((error) => {
    // Error initializing the Instant Client
  });
```



<div id='id5' />

#### Using oracledb
Once the Instant Client is initialized, you can use the `oracledb`  from the library to interact with Oracle Database.

```javascript
import { oracledb } from "@vjose1903/instantclient-oracledb";
...
...

oracledb.getConnection({ /* connection options */ })
  .then((connection) => {
    // Connection successfully established, you can now use the connection object
  })
  .catch((error) => {
    // Handle connection error
  });
```



<div id='id6' />

##### Example: Executing a query
```javascript
import { oracledb } from "@vjose1903/instantclient-oracledb";
...
...

const sql = "SELECT * FROM employees";

oracledb.getConnection({ /* connection options */ })
  .then((connection) => {
    connection.execute(sql)
      .then((result) => {
        // Handle query result
      })
      .catch((error) => {
        // Handle query error
      })
      .finally(() => {
        // Release the connection
        connection.close();
      });
  })
  .catch((error) => {
    // Handle connection error
  });
```