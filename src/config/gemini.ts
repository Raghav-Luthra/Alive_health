import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAxWIMq8ZXOTUP-TTgNCHdyJHP_nDTYRJk';

export const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
