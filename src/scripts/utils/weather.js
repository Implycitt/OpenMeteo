import * as THREE from 'three'

const resultsBox = document.getElementById("resultsBox");
const inputBox = document.getElementById("rem")

inputBox.onkeyup = function() {
  let input = inputBox.value;
  const search_city = "https://geocoding-api.open-meteo.com/v1/search";
  let locations = []

  fetch(`${search_city}?name=${input}`)
  .then(response => {
      return response.json();
  })
  .then(data => {
    try {
      for (let i = 0; i < 4; i++) {
          locations.push(`${data.results[i].name}, ${data.results[i].country}`);
      }
      display(locations);
    } catch (error) {
      console.log(error);
    }
  })
}

inputBox?.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    weather();
  }
})

document.getElementById("searching")?.addEventListener('click', () => {
  weather();
})

function display(locations) {
  const content = locations.map((list)=>{
    return "<li onclick=selectInput(this)>" + list + "</li>";
  });
  resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

function weather() {
  document.getElementById("weather").removeAttribute("hidden");
  const search_city = "https://geocoding-api.open-meteo.com/v1/search";
  const cityName = document.getElementById("rem").value;
  const date = new Date();

  fetch(`${search_city}?name=${cityName}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const lat = data.results[0].latitude;
      const lon = data.results[0].longitude;

      const timezone = data.results[0].timezone;
      timezone.replace("/", "%2F");

      const api_url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,rain,relativehumidity_2m,is_day,precipitation,rain,snowfall,windspeed_10m&hourly=cloudcover,temperature_2m&daily=rain_sum,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=${timezone}`;
      fetch(api_url)
        .then(res => {
          return res.json();
        })
        .then(d => {
          const minutes = date.getMinutes();
          const isday = d.current.is_day;
          const cloudcover = d.hourly.cloudcover;
          const timeandday = d.current.time.split("T");
          const time = timeandday[1].toString().substr(0, 2);
          const day = timeandday[0];
          const rain = d.daily.rain_sum[0];
          const humidity = d.current.relativehumidity_2m;
          const currenttemp = d.current.temperature_2m;
          const windspeed = d.current.windspeed_10m;
          const minTemp = d.daily.temperature_2m_min[0];
          const maxTemp = d.daily.temperature_2m_max[0];
          const sunset = d.daily.sunset[0].split("T")[1];
          const sunrise = d.daily.sunrise[0].split("T")[1];

          document.querySelector(".weather").style.display = "block";
          document.getElementById("city").innerHTML = cityName;
          document.getElementById("currenttemp").innerHTML = currenttemp + "°C";
          document.getElementById("mintemp").innerHTML = minTemp + "°C";
          document.getElementById("maxtemp").innerHTML = maxTemp + "°C";
          document.getElementById("humidity").innerHTML = humidity + "%";
          document.getElementById("time").innerHTML = `${time}:${minutes}`;
          document.getElementById("day").innerHTML = day;
          document.getElementById("wind").innerHTML = windspeed + "Km/H";
          document.getElementById("sunrise").innerHTML = sunrise;
          document.getElementById("sunset").innerHTML = sunset;
          document.getElementById("rain").innerHTML = rain + "mm";

          const image = document.getElementById("weatherIcon");
          if (isday == 1 && rain > 0 && currenttemp < 0) {
            image.src="./icons/daysnow.png";
          } else if (isday == 0 && rain > 0 && currenttemp < 0) {
            image.src="./icons/nightsnow.png";
          } else if (isday == 0 && rain > 0) {
            image.src="./icons/nightrain.png";
          } else if (isday == 1 && rain > 0) {
            image.src="./icons/dayrain.png";
          } else if (isday == 0) {
            image.src="./icons/night.png";
          } else {
            image.src="./icons/day.png";
          }

        })
      .catch(error => console.log(error));
    });
}
