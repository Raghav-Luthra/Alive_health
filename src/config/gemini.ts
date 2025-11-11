import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBwVrCkd5Y8K7s_Lb7C5CT8fJI1HolXUXc';

export const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
