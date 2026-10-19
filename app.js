let map;
let marker;

const demoTrips = [
  { title: "Osaka Food Walk", location: "Umeda, Osaka", date: "2026-10-12", gender: "all", tag: "EVERYONE", text: "Explore famous food spots around Umeda together." },
  { title: "Kyoto Autumn Day", location: "Kyoto", date: "2026-11-03", gender: "female", tag: "GIRLS", text: "Shrines, cafés and scenic streets in Kyoto." },
  { title: "Tokyo City Explore", location: "Shibuya, Tokyo", date: "2026-10-20", gender: "male", tag: "BOYS", text: "Visit popular city spots and local restaurants." }
];

const demoTravelers = [
  { name: "Traveler A", place: "Osaka", gender: "female", text: "Looking for someone to explore cafés and attractions with." },
  { name: "Traveler B", place: "Kyoto", gender: "male", text: "Planning a one-day Kyoto trip and looking for company." },
  { name: "Traveler C", place: "Tokyo", gender: "all", text: "Interested in sightseeing and trying local food." }
];

function renderTrips(filter = "all") {
  const container = document.getElementById("travelCards");
  const items = demoTrips.filter(x => filter === "all" || x.gender === filter || x.gender === "all");
  container.innerHTML = items.map(x => `
    <article class="travel-card">
      <div class="card-image"></div>
      <div class="card-content">
        <span class="card-tag">${x.tag}</span>
        <h3>${x.title}</h3>
        <p>${x.location} · ${x.date}</p>
        <p>${x.text}</p>
      </div>
    </article>
  `).join("");
}

function renderTravelers(filter = "all") {
  const container = document.getElementById("travelerCards");
  const items = demoTravelers.filter(x => filter === "all" || x.gender === filter || x.gender === "all");
  container.innerHTML = items.map(x => `
    <article class="traveler-card">
      <div class="traveler-avatar"></div>
      <div><span class="card-tag">${x.gender === "all" ? "EVERYONE" : x.gender.toUpperCase()}</span>
      <h3>${x.name}</h3><p>${x.place}</p><p>${x.text}</p></div>
    </article>
  `).join("");
}

function initMap() {
  const defaultCenter = { lat: 34.7025, lng: 135.4959 };
  map = new google.maps.Map(document.getElementById("mapContainer"), {
    center: defaultCenter,
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  });
  marker = new google.maps.Marker({ position: defaultCenter, map, title: "Osaka" });

  const input = document.getElementById("destinationInput");
  const autocomplete = new google.maps.places.Autocomplete(input, { fields: ["geometry", "name", "formatted_address"] });
  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    map.setCenter(place.geometry.location);
    map.setZoom(14);
    marker.setPosition(place.geometry.location);
  });
}
window.initMap = initMap;

document.addEventListener("DOMContentLoaded", () => {
  renderTrips();
  renderTravelers();

  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      button.classList.add("active");
      const gender = button.dataset.gender;
      renderTrips(gender);
      renderTravelers(gender);
    });
  });

  document.getElementById("searchButton").addEventListener("click", () => {
    const destination = document.getElementById("destinationInput").value.trim();
    if (!destination) return;
    if (map && window.google) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: destination }, (results, status) => {
        if (status === "OK" && results[0]) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(14);
          marker.setPosition(results[0].geometry.location);
          document.getElementById("map").scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  });

  document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("wanderly_user");
    window.location.href = "index.html";
  });
});