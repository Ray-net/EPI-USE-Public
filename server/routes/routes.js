const express = require('express');
const route = express.Router()

const services = require('../service/service');
const controller = require('../controller/controller');

/**
 *  @description Root Route
 *  @method GET /
 */
route.get('/', services.home_routes);
/**
 *  @description get the table view page
 *  @method GET /table-view
 */
route.get('/table-view', services.table_view);
/**
 *  @description get the view employee page
 *  @method GET /view-employee
 */
route.get('/view-employee', services.view_employee);
/**
 *  @description get api calls to perform all actions required by the system
 * 
 */
route.post('/api/create', controller.create);
route.get('/api/findall', controller.find);
route.get('/api/findsalary/:min/:max', controller.findsalaryrange);
route.get('/api/findone', controller.findone);
route.post('/api/update', controller.update);
route.get('/api/delete', controller.delete);
route.post('/api/uploads', controller.upload);
route.get('/api/encrypt', controller.encrypt);

module.exports = route



