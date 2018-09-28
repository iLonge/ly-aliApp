
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../components/tabs/index');
require('../../components/tabs/tab-content/index');
require('../../components/vtabs/index');
require('../../components/vtabs/vtab-content/index');
require('../../components/popup/index');
require('../../pages/index/index');
require('../../pages/order-center/order-center');
require('../../pages/help/help');
require('../../pages/service/service');
require('../../pages/submit-status/submit-status');
require('../../pages/assess/assess');
require('../../pages/help-detail/help-detail');
require('../../pages/help-list/help-list');
require('../../pages/search/search');
require('../../pages/order-detail/order-detail');
require('../../pages/phone-brand/phone-brand');
require('../../pages/assess-result/assess-result');
require('../../pages/deliver/deliver');
require('../../pages/submit-order-detail/submit-order-detail');
require('../../pages/submit-order/submit-order');
require('../../pages/recycling-car/recycling-car');
require('../../pages/agreement/agreement');
require('../../pages/common-recycling-problems/common-recycling-problems');
require('../../pages/return-address/return-address');
require('../../pages/recycling-online/recycling-online');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
