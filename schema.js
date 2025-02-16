const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type User {
    id: ID!
    username: String!
    email: String!
    created_at: String
  }

  type LoginResponse {
    token: String!
  }

  type Employee {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  # Custom response for mutations
  type EmployeeResponse {
    success: Boolean!
    message: String!
    employee: Employee
  }

  # Custom response for delete mutation
  type DeleteResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    getEmployees: [Employee]
    getEmployeeById(id: ID!): Employee
    getEmployeeByDesignation(designation: String!): [Employee]
    getEmployeeByDepartment(department: String!): [Employee]
    login(username: String!, password: String!): LoginResponse
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User

    addEmployee(
      first_name: String!,
      last_name: String!,
      email: String!,
      gender: String!,
      designation: String!,
      salary: Float!,
      date_of_joining: String!,
      department: String!,
      employee_photo: String
    ): EmployeeResponse

    updateEmployee(
      id: ID!,
      first_name: String,
      last_name: String,
      email: String,
      gender: String,
      designation: String,
      salary: Float,
      department: String,
      employee_photo: String
    ): EmployeeResponse  # Updated to return success message

    deleteEmployee(id: ID!): DeleteResponse  # Returns a success message instead of Employee object
  }
`);

module.exports = schema;
