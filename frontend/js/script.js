document.addEventListener('DOMContentLoaded', () => {
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const resultsGrid = document.getElementById('results-grid');
  const resultsCount = document.getElementById('results-count');

  // API Endpoint (Relative for Vercel, or full URL for local testing)
  // For standard setup where backend is on same port or serverless
  const API_URL = '/api/search-cars';

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    // 1. Add user message to chat
    appendMessage('user', message);
    chatInput.value = '';

    // 2. Add loading state
    const loadingId = appendLoading();

    try {
      // 3. Call backend API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // 4. Remove loading state and add assistant response
      removeLoading(loadingId);
      appendMessage('assistant', data.reply);

      // 5. Update results grid
      renderResults(data.results);

    } catch (error) {
      console.error('Error fetching cars:', error);
      removeLoading(loadingId);
      appendMessage('assistant', 'Sorry, I encountered an error while searching. Please make sure the backend is running and the API endpoint is correct.');
    }
  });

  function appendMessage(role, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
  }

  function appendLoading() {
    const id = 'loading-' + Date.now();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = id;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = `
      <div class="loading-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
    return id;
  }

  function removeLoading(id) {
    const loadingEl = document.getElementById(id);
    if (loadingEl) {
      loadingEl.remove();
    }
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function renderResults(cars) {
    if (!cars || cars.length === 0) {
      resultsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🚙</div>
          <p>No cars found matching your criteria. Try adjusting your search.</p>
        </div>
      `;
      resultsCount.textContent = '0 cars found';
      return;
    }

    resultsCount.textContent = `${cars.length} car${cars.length > 1 ? 's' : ''} found`;
    
    // Uses the generateCarCard function from CarCard.js
    let html = '';
    cars.forEach(car => {
      html += generateCarCard(car);
    });
    
    resultsGrid.innerHTML = html;
  }
});
