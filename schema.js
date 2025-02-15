const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Employee {
    id: ID
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type Query {
    getEmployees: [Employee]
    getEmployeeById(id: ID!): Employee
  }

  type Mutation {
    addEmployee(first_name: String, last_name: String, email: String, gender: String, designation: String, salary: Float, date_of_joining: String, department: String): Employee
    updateEmployee(id: ID!, first_name: String, last_name: String, email: String, gender: String, designation: String, salary: Float): Employee
    deleteEmployee(id: ID!): Employee
  }
`);

module.exports = schema;
