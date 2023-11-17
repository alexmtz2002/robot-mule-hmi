// Get the video element by ID
const video = document.getElementById('camera-feed');

// Get the camera selection menu
const select = document.getElementById('camera-select');

// Add event listener to handle camera selection
select.addEventListener('click', event => {
  // Get the selected device ID from the menu
  const deviceId = select.value;

  // Set up constraints with the selected device ID
  const constraints = {
    video: {
      deviceId: {
        exact: deviceId
      },
    },
  };

  // Request access to the camera with the specified constraints
  navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      // Set the video element's source to the camera stream
      video.srcObject = stream;
    })
    .catch(error => {
      console.error('Error accessing media devices.', error);
    });
});

// Ask for permission to use the camera initially
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    // Set the video element's source to the camera stream
    video.srcObject = stream;

    // Get a list of available cameras
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        // Filter the list to only include video input devices
        const videoDevices = devices.filter(device => device.kind === 'videoinput');

        // Create a list of options for the camera selection menu
        const options = videoDevices.map(device => {
          return `<option value="${device.deviceId}">${device.label}</option>`;
        });

        // Add the options to the camera selection menu
        select.innerHTML = options.join('');
      })
      .catch(error => {
        console.error('Error fetching video devices:', error);
      });
  })
  .catch(error => {
    // Handle permission denied scenarios
    if (error.name === 'NotAllowedError') {
      console.error('Permission to access camera was denied by the user.');
    } else {
      console.error('Error accessing camera:', error);
    }
  });

// Add event listener to the back button
const backButton = document.getElementById('back-button');
backButton.addEventListener('click', () => {
  // Navigate back to the index.html page
  window.location.href = 'index.html';
});

// Clean up the video stream on page exit
window.addEventListener('beforeunload', () => {
  if (video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }
});
