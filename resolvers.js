const Employee = require('./models/Employee');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    // Get all employees
    getAllEmployees: async () => {
      try {
        return await Employee.find();
      } catch (error) {
        throw new Error('Error fetching employees: ' + error.message);
      }
    },

    // Get employee by ID
    getEmployeeById: async (_, { id }) => {
      try {
        const employee = await Employee.findById(id);
        if (!employee) {
          throw new Error(`Employee with ID ${id} not found`);
        }
        return employee;
      } catch (error) {
        throw new Error('Error fetching employee by ID: ' + error.message);
      }
    },

    // Login query
    login: async (_, { username, password }) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
        return { token };
      } catch (error) {
        throw new Error('Error during login: ' + error.message);
      }
    },

    // Search employees by designation
    getEmployeeByDesignation: async (_, { designation }) => {
      try {
        const employees = await Employee.find({
          designation: { $regex: new RegExp(designation, 'i') },
        });

        if (employees.length === 0) {
          throw new Error(`No employees found with designation: ${designation}`);
        }

        return employees;
      } catch (error) {
        throw new Error('Error fetching employees by designation: ' + error.message);
      }
    },

    // Search employees by department
    getEmployeeByDepartment: async (_, { department }) => {
      try {
        const departmentTrimmed = department.trim();
        const employees = await Employee.find({
          department: { $regex: new RegExp(departmentTrimmed, 'i') },
        });

        if (employees.length === 0) {
          throw new Error(`No employees found in department: ${departmentTrimmed}`);
        }

        return employees;
      } catch (error) {
        throw new Error('Error fetching employees by department: ' + error.message);
      }
    }
  },

  Mutation: {
    // Signup mutation
    signup: async (_, { username, email, password }) => {
      try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });

        await newUser.save();
        return newUser;
      } catch (error) {
        throw new Error('Error during signup: ' + error.message);
      }
    },

    // Add new employee
    addEmployee: async (_, { first_name, last_name, email, gender, designation, salary, date_of_joining, department }) => {
      try {
        // Validate required fields
        if (!first_name || !last_name || !email || !gender || !designation || !salary || !date_of_joining || !department) {
          throw new Error('All fields are required. Please provide values for all fields.');
        }

        // Check for an existing employee with the same email
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
          throw new Error(`An employee with email ${email} already exists.`);
        }

        // Validate that salary is a number
        if (isNaN(salary)) {
          throw new Error('Salary must be a valid number.');
        }

        // Create the new employee
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
          updated_at: new Date(),
        });

        await newEmployee.save();
        return {
          success: true,
          message: 'Employee added successfully!',
          employee: newEmployee,
        };
      } catch (error) {
        throw new Error('Error adding employee: ' + error.message);
      }
    },

    // Update employee by ID
    updateEmployee: async (_, { id, first_name, last_name, email, gender, designation, salary }) => {
      try {
        if (!first_name || !last_name || !email || !gender || !designation || !salary) {
          throw new Error('All fields are required. Please provide values for all fields.');
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
          id,
          { first_name, last_name, email, gender, designation, salary, updated_at: new Date() },
          { new: true }
        );

        if (!updatedEmployee) {
          throw new Error(`Employee with ID ${id} not found`);
        }

        return updatedEmployee;
      } catch (error) {
        throw new Error('Error updating employee: ' + error.message);
      }
    },

    // Delete employee by ID
    deleteEmployee: async (_, { id }) => {
      try {
        const deletedEmployee = await Employee.findByIdAndDelete(id);
        if (!deletedEmployee) {
          throw new Error(`Employee with ID ${id} not found`);
        }
        return deletedEmployee;
      } catch (error) {
        throw new Error('Error deleting employee: ' + error.message);
      }
    },
  },
};

module.exports = resolvers;
