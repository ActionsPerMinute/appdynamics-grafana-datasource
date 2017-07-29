import * as dateMath from 'app/core/utils/datemath';

/*
    This is the class where all AppD logic should reside.
    This gets Application Names, Metric Names and queries the API
*/

export class AppDynamicsSDK {

    username: string;
    password: string;
    tenant: string;
    url: string;

    constructor(instanceSettings, private backendSrv) {

        // Controller settings
        this.username = instanceSettings.username;
        this.password = instanceSettings.password;
        this.url = instanceSettings.url;
        this.tenant = instanceSettings.tenant;

    }

    query(options) {
        const startTime = (Math.ceil(dateMath.parse(options.range.from)));
        const endTime = (Math.ceil(dateMath.parse(options.range.to)));

        const grafanaResponse = {data: []};

        // For each one of the metrics the user entered:
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

                // A single metric can have multiple results if the user chose to use a wildcard
                // Iterates on every result.
                response.data.forEach( (metricElement) => {
                    const dividers = metricElement.metricPath.split('|');
                    const legend = dividers.length > 3 ? dividers[3] : metricElement.metricPath;
                    grafanaResponse.data.push({target: legend,
                                               datapoints: this.convertMetricData(metricElement, callback)});
                });
            }).then ( () => {
                callback();
            });
    }

    // This helper method just converts the AppD response to the Grafana format
    convertMetricData(metricElement, resolve) {
        const responseArray = [];

        metricElement.metricValues.forEach( (metricValue) => {
            responseArray.push([metricValue.current, metricValue.startTimeInMillis]);
        });

        return responseArray;
    }

    testDatasource() {
        return this.backendSrv.datasourceRequest({
            url: this.url + '/api/controllerflags', // TODO: Change this to a faster controller api call.
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

        // Here we are obtaining an array of elements, if they happen to be of type folder, we add a '|' to help the user.
        const elements = arrayResponse.map( (element) =>  prefix + element.name + (element.type === 'folder' ? '|' : '' ));

        // Only return the elements that match what the user typed, this is the essence of autocomplete.
        return elements.filter( (element) => {
            return element.toLowerCase().indexOf(query.toLowerCase()) !== -1;
        });
    }
}
