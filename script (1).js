// Get references to DOM elements
const welcomeContainer = document.getElementById("welcome-container");
const uploadArea = document.getElementById("upload-area");
const fileInput = document.getElementById("fileInput");
const viewerContainer = document.getElementById("viewer-container");
const imageCanvas = document.getElementById("imageCanvas");
const context = imageCanvas.getContext("2d");

let uploadedImage = new Image();
let circles = [];
let scale = 1;
let offsetX = 0; // Horizontal offset for image movement
let offsetY = 0; // Vertical offset for image movement

// Show upload area on "Get Started" button click
document.getElementById("getStartedBtn").addEventListener("click", () => {
    welcomeContainer.classList.add("hidden");
    uploadArea.classList.remove("hidden");
});

// Drag and drop functionality
uploadArea.addEventListener("dragover", (event) => {
    event.preventDefault(); // Prevent default behavior
});

uploadArea.addEventListener("drop", (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
});

// Click to upload file
uploadArea.addEventListener("click", () => {
    fileInput.click();
});

// Handle file input
fileInput.addEventListener("change", () => {
    handleFiles(fileInput.files);
});

// Handle paste event for image
document.addEventListener("paste", (event) => {
    const items = (event.clipboardData || window.clipboardData).items;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
            const file = item.getAsFile();
            handleFiles([file]);
        }
    }
});

// Function to handle uploaded files
function handleFiles(files) {
    const file = files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.src = e.target.result;
            uploadedImage.onload = () => {
                imageCanvas.width = uploadedImage.width;
                imageCanvas.height = uploadedImage.height;
                drawImage();
                viewerContainer.classList.remove("hidden");
                uploadArea.classList.add("hidden"); // Hide the upload area
            };
        };
        reader.readAsDataURL(file);
    }
}

// Function to draw image with zoom and offsets
function drawImage() {
    context.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    context.drawImage(uploadedImage, offsetX, offsetY, uploadedImage.width * scale, uploadedImage.height * scale);
    drawCircles();
}

// Add circles on click
imageCanvas.addEventListener("click", (event) => {
    const rect = imageCanvas.getBoundingClientRect();
    const x = (event.clientX - rect.left - offsetX) / scale;
    const y = (event.clientY - rect.top - offsetY) / scale;
    const circleSize = document.getElementById("circleSize").value;

    circles.push({ x, y, size: circleSize });
    drawImage();
});

// Draw circles on the canvas
function drawCircles() {
    circles.forEach((circle, index) => {
        context.beginPath();
        context.arc(circle.x * scale + offsetX, circle.y * scale + offsetY, circle.size / 2, 0, Math.PI * 2);
        context.strokeStyle = document.getElementById("circleColor").value; // Circle outline color
        context.lineWidth = 2; // Circle border width
        context.stroke(); // Draw the circle

        // Draw the number inside the circle
        context.fillStyle = document.getElementById("fontColor").value; // Font color
        context.font = `${document.getElementById("fontSize").value}px Arial`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(index + 1, circle.x * scale + offsetX, circle.y * scale + offsetY); // Display the number
    });
}

// Zoom functionality
document.getElementById("zoomInBtn").addEventListener("click", () => {
    scale *= 1.1; // Increase scale by 10%
    drawImage();
});

document.getElementById("zoomOutBtn").addEventListener("click", () => {
    scale /= 1.1; // Decrease scale by 10%
    drawImage();
});

// Move image with sliders
document.getElementById("horizontalSlider").addEventListener("input", (event) => {
    offsetX = parseInt(event.target.value);
    drawImage();
});

document.getElementById("verticalSlider").addEventListener("input", (event) => {
    offsetY = parseInt(event.target.value);
    drawImage();
});

// Function to download the image with annotations
function downloadImage() {
    const link = document.createElement('a');
    link.download = 'annotated_image.png';
    link.href = imageCanvas.toDataURL();
    link.click();
}
