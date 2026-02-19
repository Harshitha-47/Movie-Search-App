// OMDb API Key - Replace with your own key from http://www.omdbapi.com/apikey.aspx
const API_KEY = 'b13f58a2'; // Get free API key from omdbapi.com
const API_URL = 'https://www.omdbapi.com/';

// Get DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const yearFilter = document.getElementById('yearFilter');
const industryFilter = document.getElementById('industryFilter');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const movieContainer = document.getElementById('movieContainer');

// Language mapping
const languageMap = {
    'hindi': 'Hindi',
    'telugu': 'Telugu',
    'tamil': 'Tamil',
    'kannada': 'Kannada',
    'malayalam': 'Malayalam'
};

// Initialize year filter
function initYearFilter() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1980; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
}

// Event listeners
searchBtn.addEventListener('click', searchMovie);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovie();
});

// Search movie
async function searchMovie() {
    const movieName = searchInput.value.trim();
    const year = yearFilter.value;
    const industry = industryFilter.value;

    if (!movieName) {
        showError('Please enter a movie name');
        return;
    }

    hideAll();
    loading.classList.add('show');

    try {
        let url = `${API_URL}?apikey=${API_KEY}&t=${encodeURIComponent(movieName)}&plot=full`;
        
        if (year) {
            url += `&y=${year}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        loading.classList.remove('show');

        if (data.Response === 'False') {
            showError(data.Error || 'Movie not found. Please try another search.');
            return;
        }

        // Filter by language/industry if selected
        if (industry && !data.Language.toLowerCase().includes(languageMap[industry].toLowerCase())) {
            showError(`This movie is not from ${languageMap[industry]} cinema. Try searching without industry filter.`);
            return;
        }

        // Check if movie is from 1980 onwards
        const movieYear = parseInt(data.Year);
        if (movieYear < 1980) {
            showError('This app only shows movies from 1980 onwards.');
            return;
        }

        displayMovie(data);

    } catch (err) {
        loading.classList.remove('show');
        showError('Failed to fetch movie data. Please check your API key or try again later.');
        console.error(err);
    }
}

// Display movie details
function displayMovie(movie) {
    document.getElementById('poster').src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster';
    document.getElementById('title').textContent = movie.Title;
    document.getElementById('year').textContent = `📅 ${movie.Year}`;
    document.getElementById('language').textContent = `🗣️ ${movie.Language}`;
    document.getElementById('genre').textContent = `🎭 ${movie.Genre}`;
    document.getElementById('director').textContent = movie.Director !== 'N/A' ? movie.Director : 'Not Available';
    document.getElementById('cast').textContent = movie.Actors !== 'N/A' ? movie.Actors : 'Not Available';
    document.getElementById('boxoffice').textContent = movie.BoxOffice !== 'N/A' ? movie.BoxOffice : 'Not Available';
    document.getElementById('plot').textContent = movie.Plot !== 'N/A' ? movie.Plot : 'No plot available';
    
    // Rating
    const rating = parseFloat(movie.imdbRating);
    document.getElementById('rating').textContent = movie.imdbRating !== 'N/A' ? `⭐ ${movie.imdbRating}/10` : 'N/A';
    
    // Hit or Flop determination
    const statusEl = document.getElementById('status');
    if (movie.imdbRating !== 'N/A') {
        if (rating >= 7.0) {
            statusEl.textContent = '🎉 HIT';
            statusEl.className = 'status hit';
        } else {
            statusEl.textContent = '💔 FLOP';
            statusEl.className = 'status flop';
        }
    } else {
        statusEl.textContent = '';
        statusEl.className = 'status';
    }

    // IMDb link
    document.getElementById('imdbLink').href = `https://www.imdb.com/title/${movie.imdbID}/`;

    movieContainer.classList.add('show');
}

// Show error
function showError(message) {
    error.textContent = message;
    error.classList.add('show');
    setTimeout(() => error.classList.remove('show'), 4000);
}

// Hide all sections
function hideAll() {
    error.classList.remove('show');
    movieContainer.classList.remove('show');
}

// Initialize
initYearFilter();

// Note: To use this app, you need to:
// 1. Get a free API key from http://www.omdbapi.com/apikey.aspx
// 2. Replace 'YOUR_API_KEY' with your actual API key
// 3. Example searches: "Baahubali", "Dangal", "KGF", "RRR", "3 Idiots"
