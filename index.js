const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema'); // Import schema from schema.js
const Employee = require('./models/Employee'); // Import Employee model
const resolvers = require('./resolvers'); 

const app = express();
app.use(express.json()); // Middleware to parse JSON (useful for incoming requests)

// MongoDB Atlas connection string (use the connection string from Atlas)
const dbURI = "mongodb+srv://101427974:P2vhLUmbz2nEX4pr@cluster0.hr7uu.mongodb.net/employee-management?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(' Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define resolvers
const root = {
  getEmployees: async () => {
    console.log("📌 Fetching all employees...");
    return await Employee.find();
  },

  getEmployeeById: async ({ id }) => {
    console.log(` Fetching employee by ID: ${id}`);
    return await Employee.findById(id);
  },

  getEmployeeByDepartment: async ({ department }) => {
    console.log(` Searching employees in department: ${department}`);
    return await Employee.find({ department });
  },

  addEmployee: async ({ first_name, last_name, email, gender, designation, salary, date_of_joining, department }) => {
    console.log(" Adding new employee...");
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
    return await newEmployee.save();
  },

  updateEmployee: async ({ id, first_name, last_name, email, gender, designation, salary, department }) => {
    console.log(` Updating employee with ID: ${id}`);
    return await Employee.findByIdAndUpdate(
      id,
      { first_name, last_name, email, gender, designation, salary, department, updated_at: new Date() },
      { new: true }
    );
  },

  deleteEmployee: async ({ id }) => {
    console.log(` Deleting employee with ID: ${id}`);
    return await Employee.findByIdAndDelete(id);
  }
};

// Set up the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Allows interactive GraphQL testing
}));

// Start the Express server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}/graphql`);
});
