"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateMath = require("app/core/utils/datemath");
var AppDynamicsSDK = (function () {
    function AppDynamicsSDK(instanceSettings, backendSrv) {
        this.backendSrv = backendSrv;
        // Controller settings porra
        this.username = instanceSettings.username;
        this.password = instanceSettings.password;
        this.url = instanceSettings.url;
        this.tenant = instanceSettings.tenant;
    }
    AppDynamicsSDK.prototype.query = function (options) {
        var _this = this;
        var startTime = (Math.ceil(dateMath.parse(options.range.from)));
        var endTime = (Math.ceil(dateMath.parse(options.range.to)));
        var grafanaResponse = { data: [] };
        var requests = options.targets.map(function (target) {
            return new Promise(function (resolve) {
                _this.getMetrics(target, grafanaResponse, startTime, endTime, resolve);
            });
        });
        return Promise.all(requests).then(function () {
            return grafanaResponse;
        });
    };
    AppDynamicsSDK.prototype.getMetrics = function (target, grafanaResponse, startTime, endTime, callback) {
        var _this = this;
        return this.backendSrv.datasourceRequest({
            url: this.url + '/controller/rest/applications/' + target.application + '/metric-data',
            method: 'GET',
            params: {
                'metric-path': target.metric,
                'time-range-type': 'BETWEEN_TIMES',
                'start-time': startTime,
                'end-time': endTime,
                'rollup': 'false',
                'output': 'json'
            },
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            var dividers = target.metric.split('|');
            var legend = dividers.length > 3 ? dividers[3] : dividers[dividers.length - 1];
            grafanaResponse.data.push({ target: target.application + ' - ' + legend,
                datapoints: _this.convertMetricData(response, callback) });
        }).then(function () {
            callback();
        });
    };
    AppDynamicsSDK.prototype.convertMetricData = function (metrics, resolve) {
        var responseArray = [];
        if (metrics.data.length > 0) {
            metrics.data[0].metricValues.forEach(function (metricValue) {
                responseArray.push([metricValue.current, metricValue.startTimeInMillis]);
            });
        }
        return responseArray;
    };
    AppDynamicsSDK.prototype.testDatasource = function () {
        return this.backendSrv.datasourceRequest({
            url: this.url + '/api/controllerflags',
            method: 'GET'
        }).then(function (response) {
            if (response.status === 200) {
                return { status: 'success', message: 'Data source is working', title: 'Success' };
            }
            else {
                return { status: 'failure', message: 'Data source is not working', title: 'Failure' };
            }
        });
    };
    AppDynamicsSDK.prototype.annotationQuery = function () {
        // TODO implement annotationQuery
    };
    AppDynamicsSDK.prototype.getApplicationNames = function (query) {
        var _this = this;
        return this.backendSrv.datasourceRequest({
            url: this.url + '/controller/rest/applications',
            method: 'GET',
            params: { output: 'json' }
        }).then(function (response) {
            if (response.status === 200) {
                return _this.getFilteredNames(query, response.data);
            }
            else {
                return [];
            }
        }).catch(function (error) {
            return [];
        });
    };
    AppDynamicsSDK.prototype.getMetricNames = function (app, query) {
        var _this = this;
        var params = { output: 'json' };
        if (query.indexOf('|') > -1) {
            params['metric-path'] = query;
        }
        return this.backendSrv.datasourceRequest({
            url: this.url + '/controller/rest/applications/' + app + '/metrics',
            method: 'GET',
            params: params
        }).then(function (response) {
            if (response.status === 200) {
                console.log(response.data);
                return _this.getFilteredNames(query, response.data);
            }
            else {
                return [];
            }
        }).catch(function (error) {
            return [];
        });
    };
    AppDynamicsSDK.prototype.getFilteredNames = function (query, arrayResponse) {
        var prefix = '';
        if (query.indexOf('|') > -1) {
            prefix = query.slice(0, query.lastIndexOf('|') + 1);
        }
        var elements = arrayResponse.map(function (element) { return prefix + element.name; });
        return elements.filter(function (element) {
            return element.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
    };
    return AppDynamicsSDK;
}());
exports.AppDynamicsSDK = AppDynamicsSDK;
