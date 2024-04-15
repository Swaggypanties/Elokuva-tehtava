// theaterLoader.js
document.addEventListener('DOMContentLoaded', function() {
    const uri = 'https://www.finnkino.fi/xml/TheatreAreas/';
    const selectElement = document.getElementById('theaterDropdown');
    const searchButton = document.getElementById('searchButton');

    fetch(uri)
    .then(response => response.text())
    .then(str => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(str, "application/xml");
        const theaters = xmlDoc.getElementsByTagName("TheatreArea");

        Array.from(theaters).forEach(theater => {
            const id = theater.getElementsByTagName("ID")[0].textContent;
            const name = theater.getElementsByTagName("Name")[0].textContent;
            const option = document.createElement('option');
            option.value = id;
            option.textContent = name;
            selectElement.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching theater areas:', error));

    // Event listener for search button click
    searchButton.addEventListener('click', function() {
        const selectedTheaterId = selectElement.value;
        const selectedTheaterName = selectElement.options[selectElement.selectedIndex].text;
        // Now you can use selectedTheaterId to fetch more data or perform other actions
        console.log('Selected Theater ID:', selectedTheaterId, 'Name:', selectedTheaterName);

        window.location.href = `Showtime.html?theaterId=${encodeURIComponent(selectedTheaterId)}&theaterName=${encodeURIComponent(selectedTheaterName)}`;

    });
});
