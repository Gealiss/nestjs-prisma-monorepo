const apiUrl = import.meta.env.VITE_API_URL;

// A test element to display the API URL from env file
const apiUrlElement = document.getElementById('api-url');

if (apiUrlElement) {
  apiUrlElement.textContent = apiUrl || 'Not defined';
}

const healthBtn = document.getElementById('health-btn');
const healthResult = document.getElementById('health-result');
const responseContent = document.getElementById('response-content');

if (healthBtn && healthResult && responseContent) {
  healthBtn.addEventListener('click', async () => {
    healthResult.classList.remove('hidden');
    responseContent.textContent = 'Loading...';
    responseContent.classList.remove('error');

    try {
      const response = await fetch(`${apiUrl}/health`);
      const data = await response.json();

      responseContent.textContent = JSON.stringify(data, null, 2);

      if (!response.ok) {
        responseContent.classList.add('error');
      }
    } catch (error) {
      responseContent.textContent = `Error: ${error.message}`;
      responseContent.classList.add('error');
    }
  });
}

console.log('Vite App Initialized');
console.log('API URL:', apiUrl);
