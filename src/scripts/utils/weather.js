import * as THREE from 'three'

const resultsBox = document.getElementById("resultsBox");
const inputBox = document.getElementById("rem")

document.getElementById("rem").onkeyup = function() {
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

function display(locations) {
  const content = locations.map((list)=>{
    return "<li onclick=selectInput(this)>" + list + "</li>";
  });
  resultsBox.innerHTML = "<ul>" + content.join('') + "</ul>";
}

