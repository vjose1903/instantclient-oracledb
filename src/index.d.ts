declare module '@vjose1903/instantclient-oracledb' {
  import * as oracledb from 'oracledb';

  export class InstantClientOracledb {
    static initOracleClient(): Promise<any>;
  }

  export const oracledb: typeof oracledb;
}
