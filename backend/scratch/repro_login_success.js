import axios from 'axios';

async function reproLoginSuccess() {
  const email = 'test_1776259020352@example.com'; // Use the email from previous check
  try {
    console.log(`Trying login with: ${email}`);
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: 'password123'
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

reproLoginSuccess();
