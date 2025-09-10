import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCbkB5-zV7XrODvkM9x0LfHhKtN61e9E_E';

export const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });