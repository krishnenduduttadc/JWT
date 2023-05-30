const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Secret key for signing and verifying tokens
const secretKey = 'your-secret-key';

// Mock user data
const users = [
  { id: 1, username: 'john', password: 'password' },
  { id: 2, username: 'jane', password: 'password' }
];

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (user) {
    // Generate a token with the user id and secret key
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected route
app.get('/protected', (req, res) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization;
 // console.log(token)

  if (token) {
    try {
      // Verify the token using the secret key
      const decoded = jwt.verify(token, secretKey);
      const userId = decoded.userId;

      // Find the user by id
      const user = users.find(u => u.id === userId);
      console.log(user)

      if (user) {
        res.json({ message: 'Protected resource accessed successfully' });
      } else {
        res.status(401).json({ message: 'Invalid token' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(401).json({ message: 'No token provided' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

//Create jwt token
// POST http://localhost:3000/login
// {
//   "username": "john",
//   "password": "password"
// }
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4NDk0ODEwMH0.9gvw1BY6-tWD8TNQg04GtuiqCn9MYcC-uIRdsAXsvbI

// http://localhost:3000/protected
// headers tab:
// Authorization
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4NDk1MDExMywiZXhwIjoxNjg0OTUzNzEzfQ.YMJVu5az3Mnt6JihcH4qmtsHBiTiGkVKdNfBVvrvods