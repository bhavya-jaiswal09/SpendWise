// Frontend Integration Test
// This simulates what the frontend will do

console.log('\n=== Frontend Integration Test ===\n');

// Test 1: Verify auth service functions
console.log('Test 1: Auth Service Simulation');
const API_URL = 'http://localhost:5000/api/auth';

const getToken = () => localStorage.getItem('authToken');
const setToken = (token) => localStorage.setItem('authToken', token);
const removeToken = () => localStorage.removeItem('authToken');

async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  const token = getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw { response: { status: response.status, data } };
  }

  return { status: response.status, data };
}

// Test 2: Register
console.log('\nTest 2: Frontend Register Flow');
async function testFrontendRegister() {
  try {
    removeToken(); // Clear any existing token
    const response = await apiRequest('/register', 'POST', {
      name: 'Frontend Test User',
      email: 'frontendtest@example.com',
      password: 'testpass123',
      confirmPassword: 'testpass123',
    });
    
    console.log('✓ Registration successful');
    console.log('  - Token saved:', response.data.token ? 'Yes' : 'No');
    
    // Simulate Redux state
    const authState = {
      user: response.data.user,
      isAuthenticated: true,
      loading: false,
      error: null,
    };
    console.log('  - Redux State:', JSON.stringify(authState, null, 2));
    
    if (response.data.token) {
      setToken(response.data.token);
      return response.data.token;
    }
  } catch (error) {
    console.error('✗ Registration failed:', error);
  }
}

// Test 3: Session Restoration
console.log('\nTest 3: Frontend Session Restoration (/me)');
async function testSessionRestore(token) {
  try {
    const response = await apiRequest('/me', 'GET');
    console.log('✓ Session restored');
    console.log('  - User:', JSON.stringify(response.data.user, null, 2));
  } catch (error) {
    console.error('✗ Session restore failed:', error);
  }
}

// Test 4: Logout
console.log('\nTest 4: Frontend Logout Flow');
async function testLogout() {
  try {
    await apiRequest('/logout', 'POST');
    removeToken();
    console.log('✓ Logout successful');
    console.log('  - Token removed from localStorage');
  } catch (error) {
    console.error('✗ Logout failed:', error);
  }
}

// Test 5: Protected Route Access
console.log('\nTest 5: Protected Route Access');
async function testProtectedAccess(token) {
  setToken(token);
  try {
    const response = await fetch('http://localhost:5000/api/test/protected', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log('✓ Protected route access granted');
      console.log('  - User data:', data.data.user);
    } else {
      console.log('✗ Protected route access denied:', data.message);
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

// Run all tests
async function runTests() {
  const token = await testFrontendRegister();
  
  if (token) {
    await testSessionRestore(token);
    await testProtectedAccess(token);
    await testLogout();
    
    // Try to access protected route after logout
    console.log('\nTest 6: Protected Route After Logout');
    const response = await fetch('http://localhost:5000/api/test/protected', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Message:', data.message || 'Success (token still valid until expiry)');
  }
}

runTests();
