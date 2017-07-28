# AppDynamics Grafana Datasource

AppDynamics datasource for grafana.

![example_dashboard](http://imgur.com/MIBYyCY.jpg)

## With docker

The plugin is not yet on the grafana plugins list, so it can't be installed with grafana-cli.

With the commands below, grafana will start on localhost:3000 (192.168.99.100:3000 if on windows)
Any changes you make to the code will be synced with the docker container, which us useful.

1. ``git clone https://github.com/dlopes7/appdynamics-grafana-datasource``
2. ``docker run -d -p 3000:3000 --name grafana -v `pwd`:/var/lib/grafana/plugins/appdynamics-grafana-datasource/ grafana/grafana``

## Without docker

1. Install and bring grafana up (tested with grafana 4.4)
2. Clone this project to the grafana plugins folder (default /var/lib/grafana/plugins)

## Note on the Datasource config

Use proxy access and basic authentication!

![config](http://i.imgur.com/NsSTbDn.png)

## For the devs out there:

1. Clone
2. npm install
3. gulp
4. Code away!