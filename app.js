var streaming = false;
var width = 0;
var height = 0;
var video = document.getElementById("video");

var takePictureBtn = document.getElementById("takePicture");
var canvas = document.getElementById('canvas');
var photo = document.getElementById('photo');

// Making the canvas solid pink initially
clearTakenPicture(video.clientWidth, video.clientHeight);

// This is enough to get the webcam stream up and running
function getWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
            video.srcObject = stream;
            video.play();
        }).catch(function (err) {
            console.log("An error occured: " + err);
        });
}

// Get the webcam stream
getWebcam();


// This method is just to set the width and height of the video playback
video.addEventListener('canplay', function (e) {
    if (!streaming) {
        height = video.videoHeight/* / (video.videoWidth / width);*/
        width = video.videoWidth

        // You can change the actual resolution of the video here
        // video.setAttribute('height', height);
        // video.setAttribute('width', width);

        streaming = true;
    }
});

// Making the picture taken render as solid pink rectangle initially
function clearTakenPicture(width, height) {
    var context = canvas.getContext('2d');
    context.fillStyle = 'pink';
    context.fillRect(0, 0, width, height);

    var data = canvas.toDataURL('img/png');
    photo.setAttribute('src', data);
}

// To take a picture
takePictureBtn.addEventListener('click', function (e) {
    var context = canvas.getContext('2d');
    if (streaming) {
        canvas.width = width;
        canvas.height = height;

        // If a filter is selected
        var filter = document.querySelector('input[name="filter"]:checked').id;
        if (filter != null) {
            // Apply the filter to the canvas
            context.filter = filter;
        }
        context.drawImage(video, 0, 0, width, height);
        var data = canvas.toDataURL('img/png');
        photo.setAttribute('src', data);
    }
});


// To stop the video stream
var stopButton = document.getElementById('stopButton');
stopButton.addEventListener('click', function (e) {
    // The only MediaStreamTrack we have is the video track as requested from navigation API
    var tracks = video.srcObject.getTracks();
    tracks[0].stop();
    streaming = false;
});

// To get the webcam stream again
var playButton = document.getElementById('playButton');
playButton.addEventListener('click', function (e) {
    getWebcam();
});

// Apply the filter to the webcam stream as a css filter
document.getElementsByName("filter").forEach(element => {
    element.addEventListener("change", function (e) {
        var id = e.currentTarget.getAttribute("id");
        video.style.filter = e.currentTarget.getAttribute("id");
    });
});
var saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', function (e) {
    // using download js to ...download the taken picture
    download(photo.getAttribute('src'), "my-image.png", "image/png");
});