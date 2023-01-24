var employee = require("../model/model");
const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
app.use(fileUpload());
const path = require("path");
var md5 = require("nodejs-md5");
/**
 *  @description upload to server envirment
 *  @param req holds the data used to upload image
 * @param res used to show what actions will be performed after function executes
 */
exports.upload = (req, res) => {
  // validate request
  if (!req.body) {
    res.status(400).send({ message: "Content can not be emtpy!" });
    return;
  }
  console.log(req);
  const file = req.body.img.files;
  const filePath = path.join(__dirname, "libs", "images", `${file.name}`);

  file.mv(filePath, (err) => {
    if (err) return res.status(500).send(err);
    return filePath;
  });
};
/**
 *  @description upload to MongoDB. creates new employee
 *  @param req holds the data used to create the new user
 * @param res used to show what actions will be performed after function executes
 * @returns error message if any error occur with MongoDB or req param are incorrect
 * @returns redirects the user to the tree view page
 */
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: "Content can not be emtpy!" });
    return;
  }

  const createEmployee = new employee({
    name: req.body.name,
    surname: req.body.surname,
    dateOfBirth: req.body.dob,
    manager: req.body.manager,
    employeeNumber: req.body.employeenumber,
    role: req.body.role,
    salary: req.body.salary,
    email: req.body.email,
  });
  console.log(createEmployee);

  createEmployee
    .save(createEmployee)
    .then((data) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating a create operation",
      });
    });
};
/**
 *  @description find all employees in MongoDB database
 *  @param req holds the data used to find all users
 * @param res used to show what actions will be performed after function executes
 * @returns error message if any error occur with MongoDB or req param are incorrect
 * @returns return the wanted employees
 */
exports.find = (req, res) => {
  employee
    .find()
    .then((employee) => {
      res.send(employee);
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message:
            err.message || "Error Occurred while retriving user information",
        });
    });
};
/**
 *  @description find one employees in MongoDB database
 *  @param req holds the data used to find  the employee
 * @param res used to show what actions will be performed after function executes
 * @returns error message if any error occur with MongoDB or req param are incorrect
 * @returns return the wanted employee
 */
exports.findone = (req, res) => {
  if (req.query.id) {
    const id = req.query.id;

    employee
      .findOne({ employeeNumber: id })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found user with id " + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Erro retrieving user with id " + id });
      });
  }
};
/**
 *  @description updates one employee in MongoDB database. Changes the 
 *    employee manager fields of other employees if this employee was their 
 *    manager if the employee number is updated
 *  @param req holds the data used to update the employee
 * @param res used to show what actions will be performed after function executes
 * @returns error message if any error occur with MongoDB or req param are incorrect
 * @returns return the wanted employee
 */
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not be empty" });
  }
  let id = req.body.originalId;

  const createEmployee = {
    name: req.body.name,
    surname: req.body.surname,
    dateOfBirth: req.body.dob,
    manager: req.body.manager,
    employeeNumber: req.body.employeenumber,
    role: req.body.role,
    salary: req.body.salary,
    email: req.body.email,
  };

  employee
    .updateOne({ employeeNumber: id }, createEmployee)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({
            message: `Cannot Update user with ${id}. Maybe user not found!`,
          });
      } else {
        if (req.body.originalId != req.body.employeenumber) {
            employee
            .find()
            .then((allworker) => {
              allworker.forEach((element) => {
                if (element.manager == req.body.originalId) {
                  const createEmployee = {
                    name: element.name,
                    surname: element.surname,
                    dateOfBirth: element.dob,
                    manager: req.body.employeenumber,
                    employeeNumber: element.employeeNumber,
                    role: element.role,
                    salary: element.salary,
                    email: element.email,
                  };
                  employee
                    .updateOne(
                      { employeeNumber: element.employeeNumber },
                      createEmployee
                    )
                    .then((data) => {
                      if (!data) {
                        res
                          .status(404)
                          .send({
                            message: `Cannot Update user with ${id}. Maybe user not found!`,
                          });
                      }
                    })
                    .catch((err) => {
                      res
                        .status(500)
                        .send({ message: "Error Update user information" });
                    });
                }
              });
            })
            .catch((err) => {
              res
                .status(500)
                .send({
                  message:
                    err.message ||
                    "Error Occurred while retriving user information",
                });
            });
        }
        res.send(data);
      }
    })
    .catch((err) => {
      res.status(500).send({ message: "Error Update user information" });
    });
};
/**
 *  @description finds all employees in MongoDB database taht is in range.
 *  @param req holds the data used to find the employees
 * @param res used to show what actions will be performed after function executes
 * @returns error message if any error occur with MongoDB or req param are incorrect
 * @returns return the wanted employees
 */
exports.findsalaryrange = (req, res) => {
  if (req.params.min && req.params.max) {
    const min = req.params.min;
    const max = req.params.max;

    console.log(min);
    employee
      .find({ salary: { $gt: Number(min), $lt: Number(max) } })
      .then((data) => {
        if (!data) {
          res.status(404).send({ message: "Not found user with id " + id });
        } else {
          res.send(data);
        }
      })
      .catch((err) => {
        res.status(500).send({ message: "Erro retrieving user with id " + id });
      });
  }
};
/**
 *  @description deletes one employee in MongoDB database. Changes the 
 *    employee manager fields of other employees if this employee was their 
 *    manager
 *  @param req holds the data used to update the employee
 * @param res used to show what actions will be performed after function executes
 * @returns error message if any error occur with MongoDB or req param are incorrect
 * @returns redirect the user to the tree view page
 */
exports.delete = (req, res) => {
  const id = req.query.id;
  employee
    .deleteOne({ employeeNumber: id })
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` });
      } else {
        employee
          .find()
          .then((allworker) => {
            allworker.forEach((element) => {
              if (element.manager == id) {
                const createEmployee = {
                  name: element.name,
                  surname: element.surname,
                  dateOfBirth: element.dob,
                  manager: "",
                  employeeNumber: element.employeeNumber,
                  role: element.role,
                  salary: element.salary,
                  email: element.email,
                };
                employee
                  .updateOne(
                    { employeeNumber: element.employeeNumber },
                    createEmployee
                  )
                  .then((data) => {
                    if (!data) {
                      res
                        .status(404)
                        .send({
                          message: `Cannot Update user with ${id}. Maybe user not found!`,
                        });
                    }
                  })
                  .catch((err) => {
                    res
                      .status(500)
                      .send({ message: "Error Update user information" });
                  });
              }
            });
          })
          .catch((err) => {
            res
              .status(500)
              .send({
                message:
                  err.message ||
                  "Error Occurred while retriving user information",
              });
          });
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};
exports.encrypt = (req, res) => {
  const str = req.query.str;
  md5.string(str, function (err, md5) {
    if (err) {
      res.status(404).send({ message: "Not found user with id " + id });
    } else {
      res.send(md5);
    }
  });
};
