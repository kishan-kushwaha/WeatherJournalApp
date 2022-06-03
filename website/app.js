const myApiKey = 'ae684c8809f260571a8216177ef33e56&units=metric'; // Personal API Key for OpenWeatherMap API
const url = 'https://api.openweathermap.org/data/2.5/weather';


// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1  + '.' + d.getDate() + '.' + d.getFullYear();

const userInfo = document.getElementById('userInfo');

//get button id
const generateButton = document.getElementById('generate');
//apply click action on button using button
generateButton.addEventListener('click', clickedAction);

//click action on generate button
function clickedAction(event) {
    event.preventDefault();

    //get user input
    const zipCode = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;

    if (zipCode === '') {
        generateButton.classList.add('invalid');
    }
    else{
        generateButton.classList.remove('invalid');
        getWeatherData(url, zipCode, myApiKey)
            .then(function(data) {
                postData('/add', { temp:temp, date: newDate, content: content });
            }).then(function() {
                updateUI()
            }).catch(function(error) {
                console.log(error);
                alert('The zip code is  not valid.Please Try again');

            });
        userInfo.reset();
    } 


}

// get weather data 
const getWeatherData = async(url, zipCode, myApiKey) => {
    const res = await fetch(`${url}?q=${zipCode}&appid=${myApiKey}`);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

//post weather data 
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content
        })
    });

    try {
        const newData = await response.json();
        return newData;
    } catch (error) {
        console.log(error);
    }
};

//update ui dynamically 
const updateUI = async() => {
    const request = await fetch('/all');
    try {
        const uiData = await request.json();
        console.log(uiData);
            document.getElementById('date').innerHTML = uiData.date;
            document.getElementById('temp').innerHTML = uiData.temp + ' degree C';
            document.getElementById('content').innerHTML = uiData.content;
    } catch (error) {
        console.log('error', error);
    }
};

