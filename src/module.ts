import { AppDynamicsDatasource } from './datasource';
import { AppDynamicsQueryCtrl } from './query_ctrl';

class AppDynamicsConfigCtrl {
    static templateUrl = 'partials/config.html';
}

class AppDynamicsQueryOptionsCtrl {
    static templateUrl = 'partials/query.options.html';
}

export {
    AppDynamicsDatasource as Datasource,
    AppDynamicsConfigCtrl as ConfigCtrl,
    AppDynamicsQueryCtrl as QueryCtrl,
    AppDynamicsQueryOptionsCtrl as QueryOptionsCtrl
};
