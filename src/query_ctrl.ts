import angular from 'angular';
import { QueryCtrl } from 'app/plugins/sdk';

export class AppDynamicsQueryCtrl extends QueryCtrl {

    static templateUrl = 'partials/query.editor.html';
    appD: any;
    getApplicationNames: any;
    getMetricNames: any;
    transformLegendOptions: object[];

    constructor($scope, $injector, private $q, private uiSegmentSrv, private templateSrv)  {
        super($scope, $injector);

        this.uiSegmentSrv = uiSegmentSrv;
        this.appD = this.datasource.appD;

        this.getApplicationNames = (query, callback) => {
            this.appD.getApplicationNames(query)
            .then(callback);
        };

        this.getMetricNames = (query, callback) => {
            this.appD.getMetricNames(this.target.application, query)
            .then(callback);
        };

    }

    toggleEditorMode() {
        this.target.rawQuery = !this.target.rawQuery;
    }

    onChangeInternal() {
        this.panelCtrl.refresh(); // Asks the panel to refresh data.
    }
}
