import cv2
import mediapipe as mp
import numpy as np

class HandTracker:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )
        self.mp_draw = mp.solutions.drawing_utils
        self.mp_draw_styles = mp.solutions.drawing_styles
        
    def detect_hands(self, frame):
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)
        return results
    
    def draw_bounding_box(self, frame, landmarks):
        h, w, c = frame.shape
        x_coords = [landmark.x * w for landmark in landmarks.landmark]
        y_coords = [landmark.y * h for landmark in landmarks.landmark]
        
        x_min, x_max = int(min(x_coords) - 20), int(max(x_coords) + 20)
        y_min, y_max = int(min(y_coords) - 20), int(max(y_coords) + 20)
        
        cv2.rectangle(frame, (x_min, y_min), (x_max, y_max), (0, 255, 0), 2)
        cv2.putText(frame, "Hand", (x_min, y_min - 10), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
    
    def draw_landmarks(self, frame, landmarks):
        self.mp_draw.draw_landmarks(
            frame, landmarks, self.mp_hands.HAND_CONNECTIONS,
            self.mp_draw_styles.get_default_hand_landmarks_style(),
            self.mp_draw_styles.get_default_hand_connections_style()
        )

def main():
    print("Initializing hand tracking system...")
    print("Note: You may need to grant camera permissions when prompted.")
    
    cap = cv2.VideoCapture(0)
    tracker = HandTracker()
    
    if not cap.isOpened():
        print("\nError: Could not open camera!")
        print("Please check:")
        print("1. Camera permissions in System Preferences > Security & Privacy > Camera")
        print("2. No other applications are using the camera")
        print("3. Camera is properly connected")
        return
    
    print("Hand tracking started successfully!")
    print("- Hold your hand(s) in front of the camera")
    print("- Green boxes will appear around detected hands")
    print("- Hand landmarks will show skeletal tracking")
    print("- Press 'q' to quit")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame")
            break
        
        frame = cv2.flip(frame, 1)
        results = tracker.detect_hands(frame)
        
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                tracker.draw_bounding_box(frame, hand_landmarks)
                tracker.draw_landmarks(frame, hand_landmarks)
        
        cv2.imshow('Hand Tracker', frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()