import * as dateMath from 'app/core/utils/datemath';

export class AppDynamicsSDK {

    username: string;
    password: string;
    tenant: string;
    url: string;

    constructor(instanceSettings, private backendSrv) {

        // Controller settings porra
        this.username = instanceSettings.username;
        this.password = instanceSettings.password;
        this.url = instanceSettings.url;
        this.tenant = instanceSettings.tenant;

    }

    query(options) {
        const startTime = (Math.ceil(dateMath.parse(options.range.from)));
        const endTime = (Math.ceil(dateMath.parse(options.range.to)));

        const grafanaResponse = {data: []};

        const requests = options.targets.map((target) => {
            return new Promise((resolve) => {
                this.getMetrics(target, grafanaResponse, startTime, endTime, resolve);

            });
        });

        return Promise.all(requests).then( () => {
            return grafanaResponse;
        } );

    }

    getMetrics(target, grafanaResponse, startTime, endTime, callback) {
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
            }).then ( (response) => {

                const dividers = target.metric.split('|');
                const legend = dividers.length > 3 ? dividers[3] : dividers[dividers.length - 1];
                grafanaResponse.data.push({target: target.application + ' - ' + legend,
                                           datapoints: this.convertMetricData(response, callback)});
            }).then ( () => {
                callback();
            });
    }

    convertMetricData(metrics, resolve) {
        const responseArray = [];

        if (metrics.data.length > 0) {
            metrics.data[0].metricValues.forEach( (metricValue) => {
            responseArray.push([metricValue.current, metricValue.startTimeInMillis]);
            });
        }
        return responseArray;
    }

    testDatasource() {
        return this.backendSrv.datasourceRequest({
            url: this.url + '/api/controllerflags',
            method: 'GET'
            }).then( (response) => {
                if (response.status === 200) {
                    return { status: 'success', message: 'Data source is working', title: 'Success' };
                }else {
                    return { status: 'failure', message: 'Data source is not working', title: 'Failure' };
                }

            });
    }
    annotationQuery() {
        // TODO implement annotationQuery
    }

    getApplicationNames(query) {
        return this.backendSrv.datasourceRequest({
            url: this.url + '/controller/rest/applications',
            method: 'GET',
            params: { output: 'json'}
            }).then( (response) => {
                if (response.status === 200) {
                    return this.getFilteredNames(query, response.data);
                }else {
                    return [];
                }

            }).catch( (error) => {
                return [];
            });
    }

    getMetricNames(app, query) {

        const params = { output: 'json'};
        if (query.indexOf('|') > -1) {
            params['metric-path'] = query;
        }

        return this.backendSrv.datasourceRequest({
            url: this.url + '/controller/rest/applications/' + app +  '/metrics',
            method: 'GET',
            params
            }).then( (response) => {
                if (response.status === 200) {
                    console.log(response.data);
                    return this.getFilteredNames(query, response.data);
                }else {
                    return [];
                }

            }).catch( (error) => {
                return [];
            });

    }

    getFilteredNames(query, arrayResponse) {

        let prefix = '';

        if (query.indexOf('|') > -1) {
            prefix = query.slice(0, query.lastIndexOf('|') + 1);
        }

        const elements = arrayResponse.map( (element) =>  prefix + element.name);
        return elements.filter( (element) => {
            return element.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
    }
}
