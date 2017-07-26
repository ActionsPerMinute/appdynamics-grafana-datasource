import {AppDynamicsSDK} from './appd_sdk';

export class AppDynamicsDatasource {

    appD: AppDynamicsSDK;

    constructor(instanceSettings, private $q, private backendSrv, private templateSrv) {

        this.appD = new AppDynamicsSDK(instanceSettings, backendSrv);
        this.templateSrv = templateSrv;

    }

    query(options) {
        return this.appD.query(options);
  }

    testDatasource() {
        return this.appD.testDatasource();

    }
    annotationQuery() {
        // TODO implement annotationQuery
    }

    getApplicationNames(query) {
        const interpolated = {
            target: this.templateSrv.replace(query, null, 'regex')
        };
        return this.appD.getApplicationNames(query);
    }
}
