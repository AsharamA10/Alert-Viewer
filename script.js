// Fetch vehicles from the backend
function fetchVehicles() {
  
    return Promise.resolve([
      {
        "friendly_name": "KA12A3456",
        "id": "dd70a7e5-8397-4914-bbbb-4d6bb521ec67"
      },
      {
        "friendly_name": "MH12A3456",
        "id": "cc70a7e5-8397-4914-bbbb-4d6bb521ec67"
      }
    ]);
  }
  
  // Fetch alerts from the backend
  function fetchAlerts() {
   
    return Promise.resolve([
      {
        "id": "6049dbd2-45bc-4e34-9ea2-c82ced0279f1",
        "alert_type": "Unsafe driver",
        "vehicle_id": "cc70a7e5-8397-4914-bbbb-4d6bb521ec67",
        "driver_friendly_name": "Ramesh",
        "vehicle_friendly_name": "KA12A3456",
        "timestamp": "2023-03-01T04:25:45.424Z",
        "isFalseAlarm": false
      },
      {
        "id": "5149dbd2-45bc-4e34-9ea2-c82ced0279f1",
        "alert_type": "Distracted driver",
        "vehicle_id": "dd70a7e5-8397-4914-bbbb-4d6bb521ec67",
        "driver_friendly_name": "Suresh",
        "vehicle_friendly_name": "MH12A3456",
        "timestamp": "2023-03-01T04:24:45.424Z",
        "isFalseAlarm": false
      }
    ]);
  }
  
  // Render alerts on the page
  function renderAlerts(alerts) {
    const alertsContainer = document.getElementById('alertsContainer');
    alertsContainer.innerHTML = '';
  
    if (alerts.length === 0) {
      alertsContainer.innerHTML = '<p>No alerts found.</p>';
      return;
    }
  
    alerts.forEach(alert => {
      const alertElement = document.createElement('div');
      alertElement.classList.add('alert-item');
  
      const alertHeader = document.createElement('div');
      alertHeader.classList.add('alert-header');
  
      const alertType = document.createElement('span');
      alertType.classList.add('alert-type');
      alertType.textContent = alert.alert_type;
  
      const timestamp = document.createElement('span');
      timestamp.classList.add('timestamp');
      timestamp.textContent = new Date(alert.timestamp).toLocaleString();
      timestamp.dataset.alertId = alert.id; 

      const markFalseAlarmBtn = document.createElement('button');
      markFalseAlarmBtn.classList.add('mark-false-alarm');
      markFalseAlarmBtn.textContent = alert.isFalseAlarm ? '🚨 Mark as Alarm' : '🔕 Mark as False Alarm';
      markFalseAlarmBtn.dataset.alertId = alert.id; 
      markFalseAlarmBtn.onclick = () => markAsFalseAlarm(alert.id);
  
      alertHeader.appendChild(alertType);
      alertHeader.appendChild(timestamp);
      alertHeader.appendChild(markFalseAlarmBtn);
  
      const alertDetails = document.createElement('div');
      alertDetails.classList.add('alert-details');
  
      const driverInfo = document.createElement('p');
      driverInfo.innerHTML = `<strong>Driver:</strong> ${alert.driver_friendly_name} | <strong>Vehicle:</strong> ${alert.vehicle_friendly_name}`;
  
      alertDetails.appendChild(driverInfo);
  
      alertElement.appendChild(alertHeader);
      alertElement.appendChild(alertDetails);
  
      alertsContainer.appendChild(alertElement);
    });
  }
  
  // Search alerts by text
  function searchByText(alerts, searchText) {
    return alerts.filter(alert => {
      const alertText = `${alert.alert_type} ${alert.driver_friendly_name} ${alert.vehicle_friendly_name}`;
      return alertText.toLowerCase().includes(searchText.toLowerCase());
    });
  }
  
  // Search alerts by vehicle number
  function searchByVehicle(alerts, vehicleNumber) {
    return alerts.filter(alert => alert.vehicle_friendly_name.toLowerCase().includes(vehicleNumber.toLowerCase()));
  }
  
  // Search alerts by date range
  function searchByDateRange(alerts, startDate, endDate) {
    return alerts.filter(alert => {
      const alertDate = new Date(alert.timestamp);
      return alertDate >= startDate && alertDate <= endDate;
    });
  }
  
  // Initialize the page
  function initializePage() {
    const searchTextInput = document.getElementById('searchText');
    const vehicleDropdownBtn = document.getElementById('vehicleDropdownButton');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const vehicleDropdown = document.getElementById('vehicleDropdown');
    let alerts = [];
  
    // Fetch vehicles and populate the vehicle select dropdown
    fetchVehicles().then(vehicles => {
      populateVehicleDropdown(vehicles);
    });
  
    // Fetch alerts and render them on the page
    fetchAlerts().then(data => {
      alerts = data;
      renderAlerts(alerts);
    });
  
    // Event listener for free text search
    searchTextInput.addEventListener('input', () => {
      const searchText = searchTextInput.value;
      const filteredAlerts = searchByText(alerts, searchText);
      renderAlerts(filteredAlerts);
    });
  
    // Event listener for date range search
    startDateInput.addEventListener('input', filterByDateRange);
    endDateInput.addEventListener('input', filterByDateRange);
  }
  
  //function to clear the search
  function clearSearch() {
    const searchTextInput = document.getElementById('searchText');
    searchTextInput.value = '';
    renderAlerts(alerts);
  }
  
  //function to filter alerts by date range
  function filterByDateRange() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const filteredAlerts = searchByDateRange(alerts, startDate, endDate);
    renderAlerts(filteredAlerts);
  }
  
  //Function to populate the vehicle dropdown
  function populateVehicleDropdown(vehicles) {
    const vehicleDropdown = document.getElementById('vehicleDropdown');
  
    //Create an "All Vehicles" option
    const allVehiclesOption = document.createElement('span');
    allVehiclesOption.textContent = 'All Vehicles';
    allVehiclesOption.onclick = () => filterByVehicle(''); // Empty string indicates all vehicles
    vehicleDropdown.appendChild(allVehiclesOption);
  
    //Create options for each vehicle
    vehicles.forEach(vehicle => {
      const span = document.createElement('span');
      span.textContent = vehicle.friendly_name;
      span.onclick = () => filterByVehicle(vehicle.friendly_name);
      vehicleDropdown.appendChild(span);
    });
  }
  
  //Function to filter alerts by vehicle
  function filterByVehicle(vehicleNumber) {
    const filteredAlerts = vehicleNumber
      ? alerts.filter(alert => alert.vehicle_friendly_name === vehicleNumber)
      : [...alerts]; // If empty string, show alerts for all vehicles
    renderAlerts(filteredAlerts);
  
    // Highlight the selected vehicle in the dropdown and update the UI
    updateSelectedVehicle(vehicleNumber);
  }
  
  // Function to update the selected vehicle in the UI
  function updateSelectedVehicle(vehicleNumber) {
    const vehicleDropdown = document.getElementById('vehicleDropdown');
    const selectVehicleButton = document.getElementById('selectVehicleButton');

    // Remove the 'selected' class from all options
    Array.from(vehicleDropdown.children).forEach(option => option.classList.remove('selected'));
  
    // Add the 'selected' class to the clicked option (or 'All Vehicles' if empty string)
    const selectedOption = vehicleNumber
      ? vehicleDropdown.querySelector(`span:contains("${vehicleNumber}")`)
      : vehicleDropdown.firstChild;
  
    if (selectedOption) {
      selectedOption.classList.add('selected');
    }
  
    selectVehicleButton.textContent = vehicleNumber || 'All Vehicles';
  }
  
  // function for case-insensitive string matching
  function containsText(string, searchText) {
    return string.toLowerCase().includes(searchText.toLowerCase());
  }
  
  // function to mark an alert as a false alarm
  function markAsFalseAlarm(alertId) {
    // Implement this based on backend logic (e.g., make an API call to update the status)
    console.log(`Marking alert with ID ${alertId} as a false alarm`);

    
    // Toggle the button text after marking as false alarm
    toggleButtonText(alertId);
    updateTimestamp(alertId);
  }
  
 
  
  // function to mark an alert as a false alarm or alarm
function toggleMarkAlarmStatus(alertId) {
    // Implement this based on backend logic (e.g., make an API call to update the status)
    const alert = alerts.find(alert => alert.id === alertId);
  
    if (alert) {
      if (alert.alert_status === 'false_alarm') {
        alert.alert_status = 'alarm';
        console.log(`Marking alert with ID ${alertId} as an alarm`);
      } else {
        alert.alert_status = 'false_alarm';
        console.log(`Marking alert with ID ${alertId} as a false alarm`);
      }
  
      // Toggle the button text after marking
      toggleButtonText(alertId);
    }
  }
  
  // function to toggle button text
  function toggleButtonText(alertId) {
    const markFalseAlarmBtn = document.querySelector(`button[data-alert-id="${alertId}"]`);
  
    if (markFalseAlarmBtn) {
      const buttonText = markFalseAlarmBtn.textContent;
  
      if (buttonText.includes('Mark as False Alarm')) {
        markFalseAlarmBtn.textContent = '🚨 Mark as Alarm';
      } else if (buttonText.includes('Mark as Alarm')) {
        markFalseAlarmBtn.textContent = '🔕 Mark as False Alarm';
      }
  
      // Update timestamp for the alert
      updateTimestamp(alertId);
    }
  }
  
  // function to update the timestamp for an alert
  function updateTimestamp(alertId) {
    const alert = alerts.find(alert => alert.id === alertId);
  
    if (alert) {
      const timestampSpan = document.querySelector(`span[data-alert-id="${alertId}"]`);
  
      if (timestampSpan) {
        // Update the timestamp with the current date and time
        const currentTimestamp = new Date().toLocaleString();
        timestampSpan.textContent = currentTimestamp;
      }
    }
  }
  
  // Initialize the page when the DOM is ready
  document.addEventListener('DOMContentLoaded', initializePage);
  
  
  
  
