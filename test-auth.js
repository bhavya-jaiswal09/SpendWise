// Test script to verify authentication APIs
const API_URL = 'http://localhost:5000/api/auth';

async function testRegister() {
  console.log('\n=== Testing Registration ===');
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data.data?.token;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testLogin() {
  console.log('\n=== Testing Login ===');
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    return data.data?.token;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testProtected(token) {
  console.log('\n=== Testing Protected Route ===');
  try {
    const response = await fetch('http://localhost:5000/api/test/protected', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testProtectedNoToken() {
  console.log('\n=== Testing Protected Route (No Token) ===');
  try {
    const response = await fetch('http://localhost:5000/api/test/protected', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runTests() {
  let token;
  
  // Test duplicate registration (should fail)
  console.log('\n=== Testing Duplicate Email ===');
  await testRegister();
  
  // Test login
  token = await testLogin();
  
  // Test protected route without token
  await testProtectedNoToken();
  
  // Test protected route with token
  if (token) {
    await testProtected(token);
  }
}

runTests();
