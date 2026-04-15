import axios from 'axios';

async function reproSignup() {
  const email = `test_${Date.now()}@example.com`;
  try {
    console.log(`Trying signup with: ${email}`);
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      username: 'testuser',
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

reproSignup();
