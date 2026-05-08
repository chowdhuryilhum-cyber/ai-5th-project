/**
 * Component to generate a Car Card HTML string
 * @param {Object} car - Car data object
 * @returns {string} - HTML string
 */
function generateCarCard(car) {
  // Format price with commas
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(car.price);

  // Format mileage
  const formattedMileage = new Intl.NumberFormat('en-US').format(car.mileage) + ' mi';

  return `
    <a href="${car.link}" class="car-card" target="_blank" rel="noopener noreferrer">
      <div class="car-image-wrapper">
        <span class="car-badge">${car.year}</span>
        <img src="${car.image}" alt="${car.brand} ${car.model}" class="car-image" loading="lazy">
      </div>
      
      <div class="car-details">
        <div class="car-title-row">
          <h3 class="car-title">${car.brand} ${car.model}</h3>
          <span class="car-price">${formattedPrice}</span>
        </div>
        
        <div class="car-meta">
          <span class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${formattedMileage}
          </span>
        </div>
        
        <div class="car-footer">
          <span class="car-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${car.location}
          </span>
          <button class="view-btn">View Deal</button>
        </div>
      </div>
    </a>
  `;
}
