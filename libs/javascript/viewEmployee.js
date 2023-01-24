let employeenr = window.location.search;
let searcharray = employeenr.split("=");
// map to store list of managers with their subordinates
const managementMap = new Map();
//map of all employees map with their employee number to make employee lookup faster
const employeesMap = new Map();
/**
 *  @description load event gets the employee data from database to 
 * populate the employee profile and edit form
 *      
 */
function loadEmployeeData() {
  axios
    .get(`https://epi-use-employee-tree.herokuapp.com/api/findall`)
    .then(async (response) => {
      //console.log('hetre');
      //console.log(response.data);
      employeeData = response.data;
      //console.log(employeeData);
      for (let i = 0; i < employeeData.length; i++) {
        employeesMap.set(employeeData[i].employeeNumber, employeeData[i]);
      }

      for (let i = 0; i < employeeData.length; i++) {
        if (!managementMap.get(employeeData[i].employeeNumber)) {
          managementMap.set(employeeData[i].employeeNumber, []);
        }

        if (employeeData[i].manager != "") {
          if (managementMap.get(employeeData[i].manager)) {
            let workerArray = managementMap.get(employeeData[i].manager);
            workerArray.push(employeeData[i].employeeNumber);
            managementMap.set(employeeData[i].manager, workerArray);
          } else {
            let workerArray = [];
            workerArray.push(employeeData[i].employeeNumber);
            managementMap.set(employeeData[i].manager, workerArray);
          }
        }
      }
    })
    .catch((error) => console.log(error));
  console.log("data");
  axios
    .get(`https://epi-use-employee-tree.herokuapp.com/api/findone?id=${searcharray[1]}`)
    .then((response) => {
      document.querySelector("#name").value = response.data.name;
      document.querySelector("#employeenr").value =
        response.data.employeeNumber;
      document.querySelector("#surname").value = response.data.surname;
      console.log(typeof response.data.dateOfBirth);
      document.querySelector("#dob").value = response.data.dateOfBirth.substr(0, 10);;
      document.querySelector("#salary").value = response.data.salary;
      document.querySelector("#manager").value = response.data.manager;
      document.querySelector("#role").value = response.data.role;
      document.querySelector("#email").value = response.data.email;

      document.querySelector(".name").innerHTML +=
        response.data.name + " " + response.data.surname;
      document.querySelector(".role").innerHTML += response.data.role;
      document.querySelector(".employeenr").innerHTML +=
        response.data.employeeNumber;
      document.querySelector(".manager").innerHTML += response.data.manager;
      document.querySelector(".salary").innerHTML +=
        "R " + response.data.salary;
      axios
        .get(`https://epi-use-employee-tree.herokuapp.com/api/encrypt?str=${response.data.email.trim().toLowerCase()}`)
        .then((response) => {
          document.getElementById(
            "images"
          ).src = `https://www.gravatar.com/avatar/${response.data.split("= ")[1].trim()}?s=200`;
        })
        .catch((error) => console.log(error));

      //console.log(response.data);
    })
    .catch((error) => console.log(error));
}
/**
 *  @description shows the popup edit information page
 */
function openForm() {
  document.getElementById("popup").style.display = "block";
}
/**
 *  @description hides the edit employee popup page
 */
function closeForm() {
  document.getElementById("popup").style.display = "none";
}
/**
 *  @description event that deletes the employee on click
 */

$("#delete").on("click", function () {
      axios
      .get(`https://epi-use-employee-tree.herokuapp.com/api/delete?id=${searcharray[1]}`).then(response => {
        location.replace('/');
      }).catch((error) => console.log(error)); 
});

/**
 *  @description edits an employee event with the filled in data
 * @returns return to employee view page on edit
 * @returns error message if user did not fill in form correctly
 */

$("#editdata").on("click", function () {
  var name = document.getElementById("name").value;
  var employeenr = document.getElementById("employeenr").value;
  var surname = document.getElementById("surname").value;
  var dob = document.getElementById("dob").value;
  var salary = document.getElementById("salary").value;
  var manager = document.getElementById("manager").value;
  var role = document.getElementById("role").value;
  var email = document.getElementById("email").value;
  if( salary == '')
  {
    alert("Salary must be entered")
    return;
  }
  if( name == '')
  {
    alert("Name must be entered")
    return;
  }
  if( employeenr == '')
  {
    alert("Employee number must be entered")
    return;
  }
  if( role == '')
  {
    alert("Role must be entered")
    return;
  }
  if( surname == '')
  {
    alert("Surname must be entered")
    return;
  }
  if(isNaN(salary))
  {
    alert("Salary must be a number")
    return;
  }
  if(typeof dob == 'number')
  {
    alert("Date of Birth must be a date")
    return;
  }
  if (manager == employeenr) {
    alert("You may not be your own manager");
    return;
  }
  if (role != "CEO" && manager == "") {
    alert("You require a manager");
    return;
  }
  if (employeesMap.get(employeenr) != undefined) {
    alert("You need a unique employee number");
    return;
  }
  if(manager != '' && manager != undefined && employeesMap.get(manager) == undefined)
  {
    alert("Need an existing manager");
    return;
  }
  if (role == "CEO") {
    manager = '';
  }
  if(dob == undefined || dob == '')
  {
    alert("Date of Birth need a value");
    return;
  }
  axios
    .post(`https://epi-use-employee-tree.herokuapp.com/api/update`, {
      originalId: searcharray[1],
      name: name,
      surname: surname,
      dob: dob,
      employeenumber: employeenr,
      salary: salary,
      manager: manager,
      role: role,
      email: email,
    })
    .then(alert("success"))
    .catch((error) => console.log(error));
  location.replace(`/view-employee?id=${employeenr}`);
});


