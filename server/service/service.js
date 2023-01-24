/**
 * @description takes user to the index page
 * @param res used to show what actions will be performed after function executes
 * @returns redirect the user to the tree view page
 */
exports.home_routes = (req, res) => {
  // Make a get request to /api/users
  res.render("index");
};
/**
 * @description takes user to the tableView page
 * @param res used to show what actions will be performed after function executes
 * @returns redirect the user to the table view page
 */
exports.table_view = (req, res) => {
  res.render("tableView");
};
/**
 * @description takes user to the viewEmployee page
 * @param res used to show what actions will be performed after function executes
 * @returns redirect the user to the view employee page
 */
exports.view_employee = (req, res) => {
  res.render("viewEmployee");
};
