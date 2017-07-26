# AppDynamics Grafana Datasource

AppDynamics datasource for grafana.

![example_dashboard](http://imgur.com/MIBYyCY.jpg)

## With docker

The plugin is not yet on the grafana plugins list, so it can't be installed with grafana-cli.

1. docker run -d -p 3000:3000 --name grafana grafana/grafana
2. docker exec -it grafana bash -c 'curl -sf -o /tmp/v0.0.1-alpha.tar.gz -L https://codeload.github.com/dlopes7/appdynamics-grafana-datasource/tar.gz/v0.0.1-alpha; tar -xvf /tmp/v0.0.1-alpha.tar.gz -C /var/lib/grafana/plugins'
3. docker restart grafana

## Without docker

1. Install and bring grafana up (tested with grafana 4.4)
2. Clone this project to the grafana plugins folder (default /var/lib/grafana/plugins)
3. Configure a Datasource, the access should be "proxy" because of cross scripting.

![config](http://i.imgur.com/NsSTbDn.png)

## For the devs out there:

1. Clone
2. npm install
3. gulp
4. Code away!