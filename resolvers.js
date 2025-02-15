const Employee = require('./models/Employee'); // Assuming the updated model is in models/Employee.js

const resolvers = {
  Query: {
    getAllEmployees: async () => {
      return await Employee.find(); // Fetch all employees
    },
    getEmployeeById: async (_, { id }) => {
      return await Employee.findById(id); // Fetch employee by ID
    }
  },

  Mutation: {
    addEmployee: async (_, { first_name, last_name, email, gender, designation, salary, date_of_joining, department }) => {
      const newEmployee = new Employee({
        first_name,
        last_name,
        email,
        gender,
        designation,
        salary,
        date_of_joining,
        department,
        created_at: new Date(),
        updated_at: new Date()
      });
      return await newEmployee.save(); // Save new employee to the database
    },

    updateEmployee: async (_, { id, first_name, last_name, email, gender, designation, salary }) => {
      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        { first_name, last_name, email, gender, designation, salary, updated_at: new Date() },
        { new: true } // Return updated document
      );
      return updatedEmployee;
    },

    deleteEmployee: async (_, { id }) => {
      const deletedEmployee = await Employee.findByIdAndDelete(id);
      return deletedEmployee;
    }
  }
};

module.exports = resolvers;
