"strict"

const API_KEY = 'at_O5AamMHaE9r4yUuBRuoweVQjoqvGd'

function displayData(data) {
    const resultsDiv = document.querySelector('#results')
    const errDiv = resultsDiv.querySelector('.error-display')
    const displayDiv = resultsDiv.querySelector('.data-display')
    
    resultsDiv.querySelector('.loading').classList.remove('active')

    if( data.code ) {
        errDiv.querySelector('p').innerHTML = data.messages
        errDiv.classList.add('active')
        displayDiv.classList.remove('active')
    }
    displayDiv.querySelector('#ip-address p').innerHTML = data.ip
    displayDiv.querySelector('#location p').innerHTML = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`
    displayDiv.querySelector('#timezone p').innerHTML = `UTC ${data.location.timezone}`
    displayDiv.querySelector('#isp p').innerHTML = data.isp

    displayDiv.classList.add('active')
    errDiv.classList.remove('active')

    let latLng = [data.location.lat, data.location.lng]
    console.log(latLng)
    return window.localStorage.setItem('coordinates', JSON.stringify(latLng))
}

async function getInputData (input) {
    const IP_INPUT = input
    const URI = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${IP_INPUT}`

    try {
        const response = await fetch(URI)
        const data = await response.json()
        return displayData(data)
    } catch(err) {
        return console.error(err)
    }
}

function handleSubmit(e) {
    e.preventDefault()
    const value = e.target.querySelector('input').value
    return getInputData(value, false)
}

function formSetup() {
    const form = document.querySelector('#ip-form')
    if( !form ) return
    form.onsubmit = e => handleSubmit(e)
}

function mapSetup() {

        let coordinates = JSON.parse(window.localStorage.getItem('coordinates'))

        // setup map container
        let map = L.map('map')
        map.setView(coordinates, 13);
        // populate map
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);
    
        // add marker
        var myIcon = L.icon({
            iconUrl: './images/icon-location.svg',
            alt:'Marker',
            iconSize: [38, 45]
        });
        let marker = L.marker(map.getCenter(), {icon: myIcon}).addTo(map);
}


window.onload = () => {
    // displays users current IP address
    getInputData('', true)
    .then( () => mapSetup() )    
    formSetup()
    
}