
document.addEventListener('DOMContentLoaded', function() {
    const uri = 'https://www.finnkino.fi/xml/TheatreAreas/'; //määrittää muuttuja URI:N
    const selectElement = document.getElementById('theaterDropdown');
    const searchButton = document.getElementById('searchButton');

    fetch(uri) //Komento lähettää pyynnön osoitteeseen
    .then(response => response.text()) //vastaus muutetaa teksti muotoon
    .then(str => {
        const parser = new DOMParser(); //Käytetään jäsentelyy varten
        const xmlTiedosto = parser.parseFromString(str, "application/xml"); //Muutetaan merkkijonoks
        const theaters = xmlTiedosto.getElementsByTagName("TheatreArea"); 

        Array.from(theaters).forEach(theater => {  //käsittelee xml tiedoston ja muuttaa kaikki teatterit listoiks
            const id = theater.getElementsByTagName("ID")[0].textContent; //Haetaan teatterin ID
            const name = theater.getElementsByTagName("Name")[0].textContent; //Haetaan teatterin nimi
            const option = document.createElement('option'); //Luo uuden option select listaan
            option.value = id; //Asettaa Id:lle arvon
            option.textContent = name; //Asettaa nimen näkyviin
            selectElement.appendChild(option); //Lisää äsken luodun option
        });
    })
    .catch(error => console.error('Error fetching theater areas:', error));

    
    searchButton.addEventListener('click', function() { //Kuuntelee klikkausta ja suorittaa sen toiminnon eli tiedot mitä saadaan tästä hyödynnetään sitten seuraavalla sivulla
        const selectedTheaterId = selectElement.value; //Nimi ja teatteri ID haetaan mitä tuli valittuu dropdown listasta
        const selectedTheaterName = selectElement.options[selectElement.selectedIndex].text;
        
        console.log('Selected Theater ID:', selectedTheaterId, 'Name:', selectedTheaterName); //Ilmoittaa konsoliin mitä valittiin

        window.location.href = `Showtime.html?theaterId=${encodeURIComponent(selectedTheaterId)}&theaterName=${encodeURIComponent(selectedTheaterName)}`;
        // vie meidät seuraavalle sivulle ottaen mukaan nämä tiedot mitä saitiin tältä sivulta
            
    });
});
