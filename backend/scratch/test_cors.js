import axios from 'axios';

async function testCors() {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test_1776259020352@example.com',
      password: 'password123'
    }, {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    console.log('Success:', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Error Message:', error.message);
    }
  }
}

testCors();
