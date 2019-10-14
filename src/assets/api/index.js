/**
 * 包含n个接口请求函数的模块
 */
import { getRequest, postRequest } from './ajax.js';

export default {
    $$path: {
        getadminlogin: '/usermodule/admin/login',
        getadminlist: '/usermodule/admin/list',
        getadminchangestatus: '/usermodule/admin/status',
        getadmindelete: '/usermodule/admin/delete',
        getdiclist: '/dicmodule/dic/list',
        getsingletypecode: '/dicmodule/dic/typecode',
        getdicadd: '/dicmodule/dic/add',
        getdiccheck: '/dicmodule/dic/keycheck',
        getdicupdate: '/dicmodule/dic/update',
        getallcarslist: '/carmodule/car/list',
        getCarsChecked: '/carmodule/car/checked',
        getallorder: '/ordermodule/order/list',
        getorderassess: '/ordermodule/order/assess',
        getuserinfo: '/usermodule/user/infobyid',
        getadminadd: '/usermodule/admin/add',
        getstatuspages: '/ordermodule/order/page',
    },
    getAdminLogin(params) {
        return postRequest(this.$$path.getadminlogin, params);
    },
    getAdminList(params) {
        return getRequest(this.$$path.getadminlist, params);
    },
    getAdminChangeStatus(params) {
        return postRequest(this.$$path.getadminchangestatus, params);
    },
    getAdminDelete(params) {
        return getRequest(this.$$path.getadmindelete, params);
    },
    getDicList(params) {
        return getRequest(this.$$path.getdiclist, params);
    },
    getSingletypeCode(params) {
        return getRequest(this.$$path.getsingletypecode, params);
    },
    getDicAdd(params) {
        return postRequest(this.$$path.getdicadd, params);
    },
    getDicCheck(params) {
        return getRequest(this.$$path.getdiccheck, params);
    },
    getDicUpdate(params) {
        return postRequest(this.$$path.getdicupdate, params);
    },
    getCarsByStatus(params) {
        return getRequest(this.$$path.getallcarslist, params);
    },
    getCarsChecked(params) {
        return getRequest(this.$$path.getCarsChecked, params);
    },
    getAllOrder(params) {
        return getRequest(this.$$path.getallorder, params);
    },
    getOrderAssess(params) {
        return postRequest(this.$$path.getorderassess, params);
    },
    getUserInfobyid(params) {
        return getRequest(this.$$path.getuserinfo, params);
    },
    getAdminAdd(params) {
        return postRequest(this.$$path.getadminadd, params);
    },
    getStatusPages(params) {
        return getRequest(this.$$path.getstatuspages, params);
    }
};