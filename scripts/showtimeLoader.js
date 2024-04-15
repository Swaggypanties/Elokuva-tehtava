// showtimeLoader.js
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const theaterId = urlParams.get('theaterId');
    const moviesInfo = {};

    // Fetch additional movie information from Events
    fetch('https://www.finnkino.fi/xml/Events/')
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "application/xml");
        const events = xmlDoc.getElementsByTagName("Event");

        Array.from(events).forEach(event => {
            const title = event.getElementsByTagName("Title")[0].textContent;
            const shortSynopsis = event.getElementsByTagName("ShortSynopsis")[0] ? 
                                  event.getElementsByTagName("ShortSynopsis")[0].textContent : 
                                  "No short synopsis available.";
            const genre = event.getElementsByTagName("Genres")[0] ? 
                          event.getElementsByTagName("Genres")[0].textContent : 
                          "Genre not available";
            const productionYear = event.getElementsByTagName("ProductionYear")[0] ? 
                                   event.getElementsByTagName("ProductionYear")[0].textContent : 
                                   "Year not available";
            const lengthInMinutes = event.getElementsByTagName("LengthInMinutes")[0] ? 
                                    event.getElementsByTagName("LengthInMinutes")[0].textContent : 
                                    "Length not available";

            moviesInfo[title] = { 
                synopsis: shortSynopsis,
                genre: genre,
                productionYear: productionYear,
                lengthInMinutes: lengthInMinutes
            };
        });

        // After fetching movies info, fetch the schedule
        return fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`);
    })
    .then(response => response.text())
    .then(str => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(str, "application/xml");
        const shows = xmlDoc.getElementsByTagName("Show");

        const moviesContainer = document.getElementById('moviesContainer');
        Array.from(shows).forEach(show => {
            const title = show.getElementsByTagName("Title")[0].textContent;
            const imageUrl = show.getElementsByTagName("EventSmallImagePortrait")[0].textContent;
            const showTimes = show.getElementsByTagName("dttmShowStart")[0].textContent;

            const movieDiv = document.createElement('div');
            movieDiv.className = 'movie';

            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = title;

            const titleParagraph = document.createElement('p');
            titleParagraph.textContent = title;

            const showTimeParagraph = document.createElement('p');
            showTimeParagraph.textContent = `Showtime: ${formatShowtime(showTimes)}`;

            const genreParagraph = document.createElement('p');
            genreParagraph.textContent = `Genre: ${moviesInfo[title].genre}`;

            const yearParagraph = document.createElement('p');
            yearParagraph.textContent = `Year: ${moviesInfo[title].productionYear}`;

            const lengthParagraph = document.createElement('p');
            lengthParagraph.textContent = `Duration: ${moviesInfo[title].lengthInMinutes} minutes`;

            const synopsisParagraph = document.createElement('p');
            synopsisParagraph.textContent = moviesInfo[title].synopsis;

            movieDiv.appendChild(img);
            movieDiv.appendChild(titleParagraph);
            movieDiv.appendChild(genreParagraph);
            movieDiv.appendChild(yearParagraph);
            movieDiv.appendChild(lengthParagraph);
            movieDiv.appendChild(showTimeParagraph);
            movieDiv.appendChild(synopsisParagraph);

            moviesContainer.appendChild(movieDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching movie schedule:', error);
    });
});

function formatShowtime(showtimeStr) {
    const showDate = new Date(showtimeStr);
    return showDate.toLocaleString(); // Adjust formatting as needed
}

function formatShowtime(showtimeStr) {
    const showDate = new Date(showtimeStr);
    // Extract day, month, and year from the date object
    const day = showDate.getDate(); // Gets the day of the month (1-31)
    const month = showDate.getMonth() + 1; // Gets the month (0-11, where January is 0)
    const year = showDate.getFullYear(); // Gets the full year (e.g., 2021)

    // Format the date as day/month/year
    // Ensuring day and month are two digits using 'padStart'
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
}

// showtimeLoader.js
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const theaterId = urlParams.get('theaterId');
    const theaterName = urlParams.get('theaterName');

    // Display the theater name
    const theaterHeading = document.getElementById('Theater');
    if (theaterName) {
        theaterHeading.textContent = ` ${decodeURIComponent(theaterName)}`;
    } else {
        theaterHeading.textContent = "Theater not found";
    }

    if (theaterId) {
        // existing fetch calls to populate movies based on theaterId
        fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`)
        .then(response => response.text())
        .then(handleData)
        .catch(error => {
            console.error('Error fetching movie schedule:', error);
        });
    }

    function handleData(str) {
        // existing logic to parse XML and display movies
    }
});
