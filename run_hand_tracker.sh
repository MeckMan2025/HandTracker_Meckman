#!/bin/bash

# Hand Tracker Setup and Launch Script
echo "🤖 Hand Tracker Setup & Launch"
echo "================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Python 3 found"

# Check if pip is available
if ! command -v pip3 &> /dev/null && ! python3 -m pip --version &> /dev/null; then
    echo "❌ pip is not available. Please install pip first."
    exit 1
fi

echo "✅ pip found"

# Install dependencies
echo "📦 Installing dependencies..."
if python3 -m pip install -r requirements.txt; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "🎥 Starting Hand Tracker..."
echo "Note: You may need to grant camera permissions when prompted"
echo ""

# Run the hand tracker
python3 hand_tracker.py

echo ""
echo "👋 Hand Tracker closed"