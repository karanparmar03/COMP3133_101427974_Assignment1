const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./schema'); // Import schema from the schema.js file
const Employee = require('./models/Employee'); // Import the Employee model

const app = express();

// MongoDB Atlas connection string (use the connection string you got from Atlas)
const dbURI = "mongodb+srv://101427974:P2vhLUmbz2nEX4pr@cluster0.hr7uu.mongodb.net/employee-management?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB Atlas
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define resolvers
const root = {
  getEmployees: () => Employee.find(),
  
  getEmployeeById: async ({ id }) => {
    return await Employee.findById(id); // Fetch employee by ID
  },

  addEmployee: async ({ first_name, last_name, email, gender, designation, salary, date_of_joining, department }) => {
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

  updateEmployee: async ({ id, first_name, last_name, email, gender, designation, salary }) => {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { first_name, last_name, email, gender, designation, salary, updated_at: new Date() },
      { new: true } // Return updated document
    );
    return updatedEmployee;
  },

  deleteEmployee: async ({ id }) => {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    return deletedEmployee;
  }
};

// Set up the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Allows you to interact with the GraphQL API in a browser
}));

// Start the Express server
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
