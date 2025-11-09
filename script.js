class HandTracker {
    constructor() {
        this.video = document.getElementById('video');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.hands = null;
        this.camera = null;
        this.isRunning = false;
        
        this.initializeMediaPipe();
    }

    async initializeMediaPipe() {
        try {
            this.hands = new Hands({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                }
            });

            this.hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.5
            });

            this.hands.onResults(this.onResults.bind(this));
            
            // Hide status when ready
            document.getElementById('status').style.display = 'none';
            document.getElementById('startBtn').disabled = false;
        } catch (error) {
            console.error('MediaPipe initialization error:', error);
            document.getElementById('status').style.display = 'block';
            this.updateStatus('error', 'Failed to load MediaPipe. Please refresh the page.');
        }
    }

    onResults(results) {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw the video frame
        this.ctx.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);
        
        if (results.multiHandLandmarks) {
            for (let i = 0; i < results.multiHandLandmarks.length; i++) {
                const landmarks = results.multiHandLandmarks[i];
                const handedness = results.multiHandedness[i];
                
                // Draw bounding box and label
                this.drawBoundingBox(landmarks, handedness);
                
                // Draw hand landmarks and connections
                this.drawHandLandmarks(landmarks);
            }
        }
        
        this.ctx.restore();
    }

    drawBoundingBox(landmarks, handedness) {
        const points = landmarks.map(landmark => [
            landmark.x * this.canvas.width,
            landmark.y * this.canvas.height
        ]);
        
        const xs = points.map(p => p[0]);
        const ys = points.map(p => p[1]);
        
        const minX = Math.min(...xs) - 20;
        const maxX = Math.max(...xs) + 20;
        const minY = Math.min(...ys) - 20;
        const maxY = Math.max(...ys) + 20;
        
        // Draw green bounding box
        this.ctx.strokeStyle = '#00FF00';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
        
        // Draw label with corrected mirrored handedness
        let label = handedness.label || 'Hand';
        // Fix mirrored labels: front-facing camera shows reversed perspective
        if (label === 'Left') {
            label = 'Right';
        } else if (label === 'Right') {
            label = 'Left';
        }
        
        // Save current context and flip text back to normal orientation
        this.ctx.save();
        this.ctx.scale(-1, 1); // Flip text horizontally
        this.ctx.fillStyle = '#00FF00';
        this.ctx.font = 'bold 16px Arial';
        // Adjust position for flipped coordinates
        this.ctx.fillText(label, -(minX + (maxX - minX)), minY - 5);
        this.ctx.restore();
    }

    drawHandLandmarks(landmarks) {
        // Hand connections (skeleton)
        const connections = [
            [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
            [0, 5], [5, 6], [6, 7], [7, 8],           // Index finger
            [9, 10], [10, 11], [11, 12],              // Middle finger
            [13, 14], [14, 15], [15, 16],             // Ring finger
            [17, 18], [18, 19], [19, 20],             // Pinky
            [0, 17], [5, 9], [9, 13], [13, 17]        // Palm connections
        ];

        // Draw connections (skeleton lines)
        this.ctx.strokeStyle = '#FF6B6B';
        this.ctx.lineWidth = 2;
        
        connections.forEach(connection => {
            const start = landmarks[connection[0]];
            const end = landmarks[connection[1]];
            
            this.ctx.beginPath();
            this.ctx.moveTo(start.x * this.canvas.width, start.y * this.canvas.height);
            this.ctx.lineTo(end.x * this.canvas.width, end.y * this.canvas.height);
            this.ctx.stroke();
        });

        // Draw landmarks (joint points)
        landmarks.forEach((landmark, index) => {
            const x = landmark.x * this.canvas.width;
            const y = landmark.y * this.canvas.height;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            
            // Different colors for different finger parts
            if (index === 0) {
                this.ctx.fillStyle = '#FF0000'; // Wrist - red
            } else if (index <= 4) {
                this.ctx.fillStyle = '#FF9500'; // Thumb - orange
            } else if (index <= 8) {
                this.ctx.fillStyle = '#FFFF00'; // Index - yellow
            } else if (index <= 12) {
                this.ctx.fillStyle = '#00FF00'; // Middle - green
            } else if (index <= 16) {
                this.ctx.fillStyle = '#0000FF'; // Ring - blue
            } else {
                this.ctx.fillStyle = '#8B00FF'; // Pinky - purple
            }
            
            this.ctx.fill();
            
            // Add white border to landmarks
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }

    async startCamera() {
        try {
            this.updateStatus('loading', 'Starting camera...');
            
            this.camera = new Camera(this.video, {
                onFrame: async () => {
                    if (this.hands && this.isRunning) {
                        await this.hands.send({ image: this.video });
                    }
                },
                width: 640,
                height: 480
            });
            
            await this.camera.start();
            this.isRunning = true;
            
            // Hide status when camera is active
            document.getElementById('status').style.display = 'none';
            document.getElementById('startBtn').disabled = true;
            document.getElementById('stopBtn').disabled = false;
            
        } catch (error) {
            console.error('Camera start error:', error);
            document.getElementById('status').style.display = 'block';
            this.updateStatus('error', 'Camera access denied. Please allow camera permissions and refresh.');
        }
    }

    stopCamera() {
        this.isRunning = false;
        
        if (this.camera) {
            this.camera.stop();
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Hide status when stopped
        document.getElementById('status').style.display = 'none';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('stopBtn').disabled = true;
    }

    updateStatus(type, message) {
        const statusEl = document.getElementById('status');
        statusEl.className = `status ${type}`;
        statusEl.textContent = message;
    }
}

// Global variables for UI functions
let handTracker;

// Initialize when page loads
window.addEventListener('load', () => {
    handTracker = new HandTracker();
});

// UI functions
function startCamera() {
    if (handTracker) {
        handTracker.startCamera();
    }
}

function stopCamera() {
    if (handTracker) {
        handTracker.stopCamera();
    }
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden && handTracker && handTracker.isRunning) {
        handTracker.stopCamera();
    }
});