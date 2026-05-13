import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const useVoiceCommand = (onSearch) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript.toLowerCase().trim();
        setTranscript(text);
        processCommand(text);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const processCommand = useCallback((text) => {
    if (text.includes('go home') || text === 'home') {
      navigate('/');
    } else if (text.includes('go to cart') || text.includes('open cart') || text === 'cart') {
      navigate('/cart');
    } else if (text.includes('checkout')) {
      navigate('/checkout');
    } else if (text.includes('wishlist')) {
      navigate('/wishlist');
    } else if (text.includes('contact')) {
      navigate('/contact');
    } else if (text.includes('about')) {
      navigate('/about');
    } else if (text.includes('products') || text.includes('shop')) {
      navigate('/products');
    } else if (text.includes('search') || text.includes('show') || text.includes('find')) {
      const query = text.replace(/^(search|show|find)\s+/i, '').trim();
      if (query && onSearch) onSearch(query);
      else navigate(`/products?search=${encodeURIComponent(query)}`);
    } else {
      // Treat entire transcript as search query
      if (onSearch) onSearch(text);
      else navigate(`/products?search=${encodeURIComponent(text)}`);
    }
  }, [navigate, onSearch]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, transcript, supported, startListening, stopListening };
};

export default useVoiceCommand;
