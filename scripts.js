"strict"

const API_KEY = 'at_O5AamMHaE9r4yUuBRuoweVQjoqvGd'

window.onload = () => {
    // displays users current IP address
    getInputData('')   
    // Initialize map
    let map = L.map('map',{
        zoomControl:false
    }).setView([0,0], 13);
    // Initialize tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    // Initialize icon marker
    var myIcon = L.icon({
        iconUrl: './images/icon-location.svg',
        alt:'Marker',
        iconSize: [38, 45]
    });

    /**
 * Update map marker location and pan to marker
 * @param  {Number} data   latitude number
 * @param  {Number} data   longitude number
 * @return {Object}   update map object
 */    
    let latLangHandle = function updateLatLng(lat,lng) {
        map.panTo([lat,lng])
        L.marker(map.getCenter(), {icon: myIcon}).addTo(map);
    }

    /**
 * Display data on page and pass lat, long values
 * @param  {Object} data   IP data object
 * @return {Function}   Pass latitude and longitude values to map
 */
    function displayData(data) {
        const resultsDiv = document.querySelector('#results')
        const errDiv = resultsDiv.querySelector('.error-display')
        const displayDiv = resultsDiv.querySelector('.data-display')
        // Hide loading div
        resultsDiv.querySelector('.loading').classList.remove('active')
        // Display error message
        if( data.code ) {
            errDiv.querySelector('p').innerHTML = data.messages
            errDiv.classList.add('active')
            displayDiv.classList.remove('active')
        }
        // Display IP address on page
        displayDiv.querySelector('#ip-address p').innerHTML = data.ip
        displayDiv.querySelector('#location p').innerHTML = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`
        displayDiv.querySelector('#timezone p').innerHTML = `UTC ${data.location.timezone}`
        displayDiv.querySelector('#isp p').innerHTML = data.isp
    
        displayDiv.classList.add('active')
        // Hide error message if showing
        errDiv.classList.remove('active')
        
        return latLangHandle(data.location.lat,data.location.lng)
    }

/**
 * IP data fetch
 * @param  {String} input   IP address
 * @return {Function}   Pass data object to function
 */
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
    
/**
 * Get form value
 * @param  {Element} e The form element
 * @return {Function}      Pass form value to function
 */
    function handleSubmit(e) {
        e.preventDefault()
        const value = e.target.querySelector('input').value
        let resultDivs = document.querySelectorAll('#results > div')
        resultDivs.forEach( div => {
            if(div.classList.contains('loading')) {
                if(!div.classList.contains('active')) {
                    div.classList.add('active')
                }
            } else {
                div.classList.remove('active')
                console.log(div)
            }
            
        } )
        return getInputData(value)
    }
    
/**
 * Set up form event listener
 * @return {function}   form submit listener
 */
    function formSetup() {
        const form = document.querySelector('#ip-form')
        if( !form ) return
        form.onsubmit = e => handleSubmit(e)
    }

    formSetup()
}