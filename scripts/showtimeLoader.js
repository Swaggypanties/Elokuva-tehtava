document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const theaterId = urlParams.get('theaterId');
    const moviesInfo = {};

    
    fetch('https://www.finnkino.fi/xml/Events/') //Komento lähettää pyynnön osoitteeseen
    .then(response => response.text()) //vastaus muutetaa teksti muotoon
    .then(data => {
        const parser = new DOMParser();  //Käytetään jäsentelyy varten
        const xmlTiedosto = parser.parseFromString(data, "application/xml"); //Muutetaan merkkijonoks
        const events = xmlTiedosto.getElementsByTagName("Event");

        Array.from(events).forEach(event => {       //Tässä haetaan elokuvan tiedot ja jos sitä ei ole niin ohjelma ilmoittaa X not available
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

        // Tämä hakee elokuvien näytösajat ja kuvan
        return fetch(`https://www.finnkino.fi/xml/Schedule/?area=${theaterId}`);
    })
    .then(response => response.text())
    .then(str => {
        const parser = new DOMParser();
        const xmlTiedosto = parser.parseFromString(str, "application/xml");
        const shows = xmlTiedosto.getElementsByTagName("Show");

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

            const MovieTitle = document.createElement('p');
            MovieTitle.textContent = title;

            //Nämä tuo tiedot esille
            const showTimeInfo = document.createElement('p');
            showTimeInfo.textContent = `Showtime: ${formatShowtime(showTimes)}`;

            const genreInfo = document.createElement('p');
            genreInfo.textContent = `Genre: ${moviesInfo[title].genre}`;

            const yearInfo = document.createElement('p');
            yearInfo.textContent = `Year: ${moviesInfo[title].productionYear}`;

            const lengthInfo = document.createElement('p');
            lengthInfo.textContent = `Duration: ${moviesInfo[title].lengthInMinutes} minutes`;

            const synopsisInfo = document.createElement('p');
            synopsisInfo.textContent = moviesInfo[title].synopsis;

            movieDiv.appendChild(img);
            movieDiv.appendChild(MovieTitle);
            movieDiv.appendChild(genreInfo);
            movieDiv.appendChild(yearInfo);
            movieDiv.appendChild(lengthInfo);
            movieDiv.appendChild(showTimeInfo);
            movieDiv.appendChild(synopsisInfo);

            moviesContainer.appendChild(movieDiv);
        });
    })
    .catch(error => {
        console.error('Error fetching movie schedule:', error);
    });
});

// Tämä muuttaa aika formaattia
function formatShowtime(showtimeStr) {
    const showDate = new Date(showtimeStr);
    const day = showDate.getDate();
    const month = showDate.getMonth() + 1;
    const year = showDate.getFullYear();
    const hours = showDate.getHours();
    const minutes = showDate.getMinutes();
    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} at ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
