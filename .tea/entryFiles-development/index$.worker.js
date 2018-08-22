require('./config$');

function success() {
require('../..//app');
require('../../components/tabs/index');
require('../../components/tabs/tab-content/index');
require('../../components/vtabs/index');
require('../../components/vtabs/vtab-content/index');
require('../../components/popup/index');
require('../../pages/index/index');
require('../../pages/todos/todos');
require('../../pages/add-todo/add-todo');
require('../../pages/order-center/order-center');
require('../../pages/help/help');
require('../../pages/service/service');
require('../../pages/order-detail/order-detail');
require('../../pages/phone-brand/phone-brand');
require('../../pages/assess-result/assess-result');
require('../../pages/submit-courier/submit-courier');
require('../../pages/submit-order/submit-order');
require('../../pages/recycling-car/recycling-car');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();