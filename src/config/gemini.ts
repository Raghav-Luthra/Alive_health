import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBmpbiEt92Jd_IwxYWyzxTONzzflRO8x_g';

export const genAI = new GoogleGenerativeAI(API_KEY);

export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const visionModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
