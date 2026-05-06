const apiUrl = import.meta.env.VITE_API_URL;

// A test element to display the API URL from env file
const apiUrlElement = document.getElementById('api-url');

if (apiUrlElement) {
  apiUrlElement.textContent = apiUrl || 'Not defined';
}

console.log('Vite App Initialized');
console.log('API URL:', apiUrl);
