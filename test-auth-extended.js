// Test additional scenarios
const API_URL = 'http://localhost:5000/api/auth';

async function testNewRegistration() {
  console.log('\n=== Testing New Registration ===');
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'securepass456',
        confirmPassword: 'securepass456',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Success:', data.success);
    if (data.data?.token) {
      console.log('Token received:', data.data.token.substring(0, 20) + '...');
    }
    console.log('User:', data.data?.user);
    return data.data?.token;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testLoginWithWrongPassword() {
  console.log('\n=== Testing Login with Wrong Password ===');
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'jane@example.com',
        password: 'wrongpassword',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', data.message);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testGetCurrentUser(token) {
  console.log('\n=== Testing Get Current User (/me) ===');
  try {
    const response = await fetch(`${API_URL}/me`, {
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

async function testMissingFields() {
  console.log('\n=== Testing Registration with Missing Fields ===');
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Incomplete User',
        email: 'incomplete@example.com',
        // missing password
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', data.message);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testPasswordMismatch() {
  console.log('\n=== Testing Registration with Password Mismatch ===');
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Mismatch User',
        email: 'mismatch@example.com',
        password: 'password123',
        confirmPassword: 'different456',
      }),
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', data.message);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testLogout() {
  console.log('\n=== Testing Logout ===');
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testInvalidToken() {
  console.log('\n=== Testing Protected Route with Invalid Token ===');
  try {
    const response = await fetch('http://localhost:5000/api/test/protected', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid.token.here',
      },
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', data.message);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runTests() {
  // Test validation
  await testMissingFields();
  await testPasswordMismatch();
  
  // Test new registration and login flow
  const token = await testNewRegistration();
  
  if (token) {
    await testGetCurrentUser(token);
  }
  
  await testLoginWithWrongPassword();
  await testInvalidToken();
  await testLogout();
}

runTests();
