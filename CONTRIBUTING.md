# Contributing

Please don't be afraid to help, any code or ideas are welcome.

Read on the Grafana Datasource developer guide [here](http://docs.grafana.org/plugins/developing/datasources/)

All coding is done at src folder, and we let gulp (tsc) compile the changes to the dist folder.

Please note that we have to extend one class (query_ctrl.ts) from one of the Grafana classes, if you care about the typescript compiler errors, you need to put the [Grafana app folder](https://github.com/grafana/grafana/tree/master/public/app) inside your node_modules.
