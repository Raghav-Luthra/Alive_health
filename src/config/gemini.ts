import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCUwO82pMLi3UrXtujVHtcMy7jj06mkdlE';

export const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export const visionModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
