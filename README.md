# Hand Tracking Computer Vision System

A real-time hand tracking system available in two versions:
- **Python Desktop App**: Uses your Mac's front-facing camera
- **Web Browser App**: Runs in any modern browser with camera access

Both versions detect hands in real-time, draw green bounding boxes, label detected hands, and display hand skeletal tracking with 21 landmark points.

## 🖥️ Desktop Version (Python)

### Features
- **Hand Detection**: Uses MediaPipe for accurate hand detection
- **Bounding Box**: Green rectangular boxes around detected hands
- **Labeling**: "Hand" label above each detected hand
- **Skeletal Tracking**: 21 hand landmarks with connections showing finger joints
- **Multi-hand Support**: Can track up to 2 hands simultaneously
- **Real-time Processing**: Optimized for smooth real-time performance

### Requirements
- Python 3.x
- OpenCV
- MediaPipe
- NumPy
- Mac with front-facing camera

### Installation
```bash
pip install -r requirements.txt
```

### Usage
```bash
python3 hand_tracker.py
```

- The camera window will open showing the live feed
- Hold your hand(s) in front of the camera
- Green boxes will appear around detected hands with "Hand" labels
- Hand landmarks and skeletal connections will be overlaid
- Press 'q' to quit the application

### Configuration
You can adjust detection sensitivity in the `HandTracker` class:
- `min_detection_confidence`: Minimum confidence for hand detection (default: 0.7)
- `min_tracking_confidence`: Minimum confidence for hand tracking (default: 0.5)
- `max_num_hands`: Maximum number of hands to detect (default: 2)

## 🌐 Web Version

### Features
- **Browser-Based**: No installation required - runs in any modern browser
- **Real-Time Detection**: Live hand tracking using your device's camera
- **Privacy-First**: All processing happens locally in your browser
- **Mobile Friendly**: Works on desktop and mobile devices
- **Zero Backend**: Static site that can be deployed anywhere

### Quick Start (Local)
```bash
# Simple HTTP server (Python)
python3 -m http.server 8000

# Or using Node.js
npx serve .

# Or using PHP
php -S localhost:8000
```
Visit `http://localhost:8000`

### Deployment on Netlify

**Quick Deploy**:
1. Go to [netlify.com](https://netlify.com)
2. Drag the entire project folder to the deploy area
3. Your app will be live instantly!

**Git Integration** (Recommended):
```bash
git init
git add .
git commit -m "Initial commit - Hand Tracker Web App"
git remote add origin https://github.com/yourusername/hand-tracker-web.git
git push -u origin main
```
Then connect your GitHub repo to Netlify for auto-deploy.

### Browser Requirements
- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: iOS 14.3+ / macOS 11+
- **Mobile**: iOS Safari, Chrome Mobile, Android Chrome

### Required Files for Web Deployment
- `index.html` - Main web page
- `script.js` - Hand tracking functionality  
- `netlify.toml` - Netlify configuration
- `_headers` - Security headers

## 🔒 Permissions & Privacy

- **Camera Access**: Required for hand detection
- **HTTPS**: Required for web camera API (Netlify provides this automatically)
- **Privacy**: All processing happens locally - no data sent to servers
- **Security**: Camera feed never leaves your device

## 🎯 How It Works

1. **MediaPipe Hands**: Google's ML model for hand detection
2. **Camera Access**: WebRTC (web) or OpenCV (desktop)
3. **Real-time Rendering**: Canvas API (web) or OpenCV (desktop)
4. **Local Processing**: No server required

## 🛠️ Customization

### Desktop (hand_tracker.py)
Edit the `HandTracker` class parameters:
- Detection confidence thresholds
- Maximum number of hands
- Bounding box styling

### Web (script.js)
Modify:
- Detection sensitivity (`minDetectionConfidence`)
- Number of hands (`maxNumHands`) 
- Landmark colors and styles
- Bounding box appearance

## 📈 Performance

- **Desktop**: Optimized OpenCV processing
- **Web**: ~50KB total size, 30+ FPS on modern devices
- **Efficient**: Client-side processing only
- **Scalable**: No server costs or limits