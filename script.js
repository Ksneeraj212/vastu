const canvas = document.getElementById('floorPlanCanvas');
const ctx = canvas.getContext('2d');
const centerCoordinates = document.getElementById('centerCoordinates');
let isSelecting = false;
let selectionPoints = [];
let imgData = null;

// Create an image element to load the image
const img = new Image();

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  redrawCanvas();
};

// Function to redraw the canvas
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, img.width, img.height);

  // Redraw previously drawn lines
  if (selectionPoints.length > 1) {
    ctx.beginPath();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.moveTo(selectionPoints[0].x, selectionPoints[0].y);

    for (let i = 1; i < selectionPoints.length; i++) {
      ctx.lineTo(selectionPoints[i].x, selectionPoints[i].y);
    }

    ctx.closePath();
    ctx.stroke();
  }
}

// Calculate the center of a polygon given its vertices
function calculatePolygonCenter(vertices) {
  const n = vertices.length;
  let sumX = 0;
  let sumY = 0;

  for (const vertex of vertices) {
    sumX += vertex.x;
    sumY += vertex.y;
  }

  const centerX = sumX / n;
  const centerY = sumY / n;

  return { x: centerX, y: centerY };
}

// Event listener for mouse click
canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  if (!isSelecting) {
    // If not in the selecting state, start a new selection
    isSelecting = true;
    selectionPoints = [];
  }

  selectionPoints.push({ x: clickX, y: clickY });
  redrawCanvas();
});


document.getElementById('calculateCenterButton').addEventListener('click', () => {
  if (selectionPoints.length > 2) {
    // Calculate the center of the enclosed area
    const center = calculatePolygonCenter(selectionPoints);

    // Display the center coordinates
    centerCoordinates.textContent = `(${center.x.toFixed(2)}, ${center.y.toFixed(2)})`;

    // Redraw the canvas with the yellow dot at the center
    redrawCanvas();
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.arc(center.x, center.y, 4, 0, 2 * Math.PI);
    ctx.fill();

    // Load and place the image at the center
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, center.x - image.width / 2, center.y - image.height / 2);
    };
    image.src = 'images /Wheelimage.png'; // Replace with the path to your image
  }
});




// Event listener for file input change
document.getElementById('imageInput').addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});
