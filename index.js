// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var cont = 0;
var date = 0;
const dates = {
  "Monday": 0,
  "Tuesday": 1,
  "Wednesday": 2,
  "Thursday": 3,
  "Friday": 4
};
const locations = [
  {
    "name": "Sennott Square",
    "address": "3802 Forbes Ave Pittsburgh, PA 15260 United States",
    "Doors": "ramp",
    "Elevators": "✅",
    "Desks": "❌",
    "Bathrooms": "✅",
    "details": "https://www.ieee-iri.org/studentaffairs_subdomain/sensq.html"
  },
  {
    "name": "Wesley W. Posvar Hall",
    "address": "230 S Bouquet St Pittsburgh, PA 15260 United States",
    "Doors": "Main Entrance",
    "Elevators": "✅",
    "Desks": "Unknown",
    "Bathrooms": "✅",
    "details": "https://www.ieee-iri.org/studentaffairs_subdomain/wwph.html"
  },
  {
    "name": "Cathedral of Learning",
    "address": "4200 Fifth Ave Pittsburgh, PA 15260 United States",
    "Doors": "✅",
    "Elevators": "✅",
    "Desks": "❌",
    "Bathrooms": "✅",
    "details": "https://www.ieee-iri.org/studentaffairs_subdomain/cl.html"
  },
  {
    "name": "Victoria Building",
    "address": "3500 Victoria St Pittsburgh, PA  15213 United States",
    "Doors": "✅",
    "Elevators": "Unknown",
    "Desks": "Unknown",
    "Bathrooms": "Unknown",
    "details": "https://www.ieee-iri.org/studentaffairs_subdomain/victo.html"
  }
];

let weekTrip = [[
  {
    "origin": "Sennott Square",
    "destination": "Cathedral of Learning",
    "starttime": "12:15 pm",
    "endtime": "12:30 pm",
    "interval": 10
  },
  {
    "origin": "Cathedral of Learning",
    "destination": "Wesley W. Posvar Hall",
    "starttime": "1:45 pm",
    "endtime": "4:30 pm",
    "interval": 195
  }
],
[
  {
    "origin": "Sennott Square",
    "destination": "Victoria Building",
    "starttime": "12:15 pm",
    "endtime": "12:30 pm",
    "interval": 10
  }
]];
let dayTrip = weekTrip[date];
function initMap() {

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer1 = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "red"
    }
  });

  const directionsRenderer2 = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "blue"
    }
  });

  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.4443, lng: -79.95332 },
    zoom: 18,
  });

  document.getElementById("routeInfo").innerHTML = "";
  directionsRenderer1.setMap(map);
  directionsRenderer1.setPanel(document.getElementById("routeInfo"));
  directionsRenderer2.setMap(map);
  directionsRenderer2.setPanel(document.getElementById("routeInfo"));
  updateSidebar(dayTrip[cont]);
  let origin = returnInformation(dayTrip[cont].origin).address;

  let destination = returnInformation(dayTrip[cont].destination).address;


  directionsService
    .route({
      origin: origin,
      destination: destination,
      // provideRouteAlternatives: false,
      // optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    })
    .then((response) => {

      const route = response.routes[0];
      const distance = route.legs[0].distance.text;
      console.log(distance);
      const duration = route.legs[0].duration.text;
      let intDuration = extractNumber(duration);
      if (intDuration > dayTrip[cont].interval - 5) {
        directionsRenderer1.setDirections(response);
        document.getElementById("ifLate").innerText = "You'll be Late!";
        document.getElementById("ifLate").style.color = "red";
      }
      else {
        document.getElementById("ifLate").innerText = "Arrive On Time :)";
        document.getElementById("ifLate").style.color = "black";
        directionsRenderer2.setDirections(response);
      }

    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}

function returnInformation(name) {
  // issuing an HTTP Get request to get all the blogs

  for (let location of locations) {
    if (location.name == name) {
      return location;
    }
  }
}

function extractNumber(timeStr) {
  const match = timeStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function updateSidebar(trip) {
  const startBuilding = document.getElementById("startBuilding");
  const startAddress = document.getElementById("startAddress");
  const leaveTime = document.getElementById("leaveTime");
  const endBuilding = document.getElementById("endBuilding");
  const endAddress = document.getElementById("endAddress");
  const arriveTime = document.getElementById("arriveTime");
  startBuilding.innerText = "Building: " + trip.origin;
  startAddress.innerText = "Address: " + returnInformation(trip.origin).address;
  leaveTime.innerText = "Earlist Pretend Leave Time: " + trip.starttime;
  endBuilding.innerText = "Building: " + trip.destination;
  endAddress.innerText = "Address: " + returnInformation(trip.origin).address;
  arriveTime.innerText = "Latest Pretend Arrive Time: " + trip.endtime;
}



document.getElementById("viewNext").addEventListener("click", function () {
  if (cont < dayTrip.length - 1) { // 防止数组越界
    cont++;
    initMap(); // 重新调用 initMap 更新地图
  }
});

document.getElementById("viewPrev").addEventListener("click", function () {
  if (cont > 0) { // 防止数组越界
    cont--;
    initMap(); // 重新调用 initMap 更新地图
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const wheelchairCheckbox = document.getElementById("wheelchairAccess");
  const startTableElement = document.getElementById("startTable");
  const endTableElement = document.getElementById("endTable");
  const startTable = createAccessibilityTable("startTableDetail",returnInformation(dayTrip[cont].origin));
  const endTable = createAccessibilityTable("endTableDetail", returnInformation(dayTrip[cont].destination));

  wheelchairCheckbox.addEventListener("change", function () {
    if (this.checked) {
      // Remove the accessibility table if it exists
      const existingStartTable = document.getElementById("startTableDetail");
      const existingEndTable = document.getElementById("endTableDetail");
      if (existingStartTable || existingEndTable) {
        existingStartTable.remove();
        existingEndTable.remove();
      }
      else {
        startTableElement.appendChild(startTable);
        endTableElement.appendChild(endTable);
        // infoElement.appendChild(table);
      }
    } else {

    }
  })

  function createAccessibilityTable(id, building) {
    const table = document.createElement("table")
    table.id = id,
    table.style.width = "100%"
    table.style.borderCollapse = "collapse"
    table.style.marginTop = "20px"

    const headerRow = table.insertRow()
    const headers = ["Doors", "Elevators", "Desks", "Bathrooms"]
    headers.forEach((header) => {
      const th = document.createElement("th")
      th.textContent = header
      th.style.border = "1px solid black"
      th.style.padding = "5px"
      headerRow.appendChild(th)
    })

    const dataRow = table.insertRow()
    headers.forEach((header) => {
      const td = dataRow.insertCell()
      td.textContent =  building[header]// Placeholder, to be replaced with actual data
      td.style.border = "1px solid black"
      td.style.padding = "5px"
    })

    return table
  }

  const dayButtons = document.querySelectorAll('.dayButton');
  let currentDay = 'Monday'; // Default to Monday

  dayButtons.forEach(button => {
    button.addEventListener('click', function () {
      const selectedDay = this.getAttribute('data-day');
      updateActiveDay(selectedDay);
    });
  });

  function updateActiveDay(selectedDay) {
    // Remove 'active' class from all buttons
    dayButtons.forEach(button => button.classList.remove('active'));

    // Add 'active' class to the selected button
    const activeButton = document.querySelector(`.dayButton[data-day="${selectedDay}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }

    // Update the current day
    currentDay = selectedDay;
    date = dates[currentDay];
    dayTrip = weekTrip[date];
    cont = 0;
    initMap();
    // Log the selected day (you can replace this with your own logic)
    console.log(`Selected day: ${currentDay}`);

    // Here you would typically update your sidebar content based on the selected day
    updateSidebarContent(currentDay);
  }

  function updateSidebarContent(day) {
    // This is a placeholder function. You should implement this to update
    // the sidebar content based on the selected day.
    console.log(`Updating sidebar content for ${day}`);
    //Example: document.getElementById('startBuilding').textContent = `Building: (Data for ${day})`;
  }

  // Initialize with Monday selected
  updateActiveDay('Monday');
});


window.initMap = initMap;

