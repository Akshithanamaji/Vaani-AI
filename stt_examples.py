"""
Example usage of the Python Speech-to-Text implementation
"""

import os
import base64
import requests
import json
from speech_to_text import GroqSpeechToText

def example_direct_usage():
    """Example of using the GroqSpeechToText class directly"""
    
    print("=== Direct Usage Example ===")
    
    # Set your Groq API key (you can also set it as environment variable)
    # os.environ['GROQ_API_KEY'] = 'your_groq_api_key_here'
    
    try:
        # Initialize the client
        stt = GroqSpeechToText()
        
        # Example 1: Transcribe from file
        # audio_file = "sample_audio.wav"  # Replace with your audio file
        # result = stt.transcribe_from_file(
        #     file_path=audio_file,
        #     language="hi",  # Hindi
        #     field_name="name"  # For name recognition context
        # )
        # print("File transcription result:")
        # print(json.dumps(result, indent=2))
        
        # Example 2: Transcribe from base64 (like the original JS version)
        # This is how your frontend would send data
        print("Ready for base64 audio transcription!")
        print("Send base64 encoded audio data to transcribe_from_base64() method")
        
    except ValueError as e:
        print(f"Error: {e}")
        print("Make sure to set your GROQ_API_KEY environment variable")

def example_api_usage():
    """Example of using the Flask API server"""
    
    print("\n=== API Server Usage Example ===")
    
    # This assumes your Flask server is running on localhost:5000
    api_base = "http://localhost:5000"
    
    # Example API call (you would replace this with actual audio data)
    sample_data = {
        "audio": "your_base64_audio_here",
        "mimeType": "audio/wav",
        "language": "hi",
        "fieldName": "name"
    }
    
    print("To use the API server:")
    print("1. Start the server: python flask_stt_server.py")
    print("2. Send POST request to:", f"{api_base}/api/speech-to-text")
    print("3. Sample payload:")
    print(json.dumps(sample_data, indent=2))
    
    # Uncomment below to actually test the API (when server is running)
    """
    try:
        response = requests.post(
            f"{api_base}/api/speech-to-text",
            json=sample_data,
            headers={"Content-Type": "application/json"}
        )
        
        if response.ok:
            result = response.json()
            print("API Response:")
            print(json.dumps(result, indent=2))
        else:
            print(f"API Error: {response.status_code}")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("Could not connect to API server. Make sure it's running.")
    """

def example_frontend_integration():
    """Example of how to integrate with your existing frontend"""
    
    print("\n=== Frontend Integration Guide ===")
    
    js_code = '''
    // Replace your existing fetch call with this:
    // (Change the URL from /api/speech-to-text to your Python server)
    
    const response = await fetch('http://localhost:5000/api/speech-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            audio: base64Audio,
            mimeType: audioBlob.type || 'audio/wav',
            language: 'hi',
            fieldName: fieldName  // for context-aware prompts
        }),
    });
    
    const result = await response.json();
    
    if (result.success) {
        console.log('Transcription:', result.text);
        // Use result.text in your application
    } else {
        console.error('Error:', result.error);
    }
    '''
    
    print("To integrate with your existing React/JS frontend:")
    print("1. Start the Python Flask server")
    print("2. Update your fetch URLs to point to the Python server")
    print("3. The API interface remains the same!")
    print("\nExample JavaScript code:")
    print(js_code)

def setup_guide():
    """Setup instructions"""
    
    print("\n=== Setup Guide ===")
    
    setup_steps = """
    1. Install Python dependencies:
       pip install -r requirements.txt
    
    2. Set your Groq API key:
       # Windows:
       set GROQ_API_KEY=your_groq_api_key_here
       
       # Linux/Mac:
       export GROQ_API_KEY=your_groq_api_key_here
       
       # Or create a .env file:
       echo "GROQ_API_KEY=your_groq_api_key_here" > .env
    
    3. Run the Flask API server:
       python flask_stt_server.py
    
    4. Test the health endpoint:
       curl http://localhost:5000/health
    
    5. Update your frontend to use the new Python API endpoint
    
    The Python implementation provides the exact same API interface as your 
    original Next.js version, so integration should be seamless!
    """
    
    print(setup_steps)

if __name__ == "__main__":
    print("Vaani AI - Python Speech-to-Text Implementation")
    print("=" * 50)
    
    setup_guide()
    example_direct_usage()
    example_api_usage()
    example_frontend_integration()
    
    print("\n" + "=" * 50)
    print("Ready to use! 🎯")
    print("The Python implementation maintains full compatibility with your existing frontend.")