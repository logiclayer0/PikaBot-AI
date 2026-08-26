import speech_recognition as sr

class SpeechService:
    def __init__(self):
        self.recognizer = sr.Recognizer()

    def listen_and_convert(self) -> str:
        with sr.Microphone() as source:
            self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
            try:
                audio = self.recognizer.listen(source, timeout=5)
                text = self.recognizer.recognize_google(audio)
                return text
            except sr.WaitTimeoutError:
                return "Listening timed out."
            except sr.UnknownValueError:
                return "Speech not recognized."
            except Exception as e:
                return f"Speech error: {str(e)}"