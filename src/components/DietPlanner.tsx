import React, { useState } from 'react';
import { ChefHat, Target, Calendar, CheckCircle } from 'lucide-react';
import { model } from '../config/gemini';

interface DietFormData {
  age: string;
  weight: string;
  height: string;
  gender: string;
  activityLevel: string;
  dietGoal: string;
  healthIssues: string[];
  allergies: string[];
  dietPreference: string;
}

const DietPlanner: React.FC = () => {
  const [formData, setFormData] = useState<DietFormData>({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    dietGoal: '',
    healthIssues: [],
    allergies: [],
    dietPreference: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [dietPlan, setDietPlan] = useState<string | null>(null);

  const healthIssuesOptions = [
    'Diabetes', 'High Blood Pressure', 'Heart Disease', 'High Cholesterol',
    'Thyroid Issues', 'PCOS', 'Digestive Issues', 'None'
  ];

  const allergyOptions = [
    'Nuts', 'Dairy', 'Eggs', 'Gluten', 'Soy', 'Shellfish', 'Fish', 'None'
  ];

  const handleCheckboxChange = (field: 'healthIssues' | 'allergies', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const generateDietPlan = async () => {
    setIsGenerating(true);
    
    try {
      const prompt = `Create a personalized diet plan based on the following information:
      
      Personal Details:
      - Age: ${formData.age} years
      - Gender: ${formData.gender}
      - Weight: ${formData.weight} kg
      - Height: ${formData.height} cm
      - Activity Level: ${formData.activityLevel}
      - Diet Goal: ${formData.dietGoal}
      - Diet Preference: ${formData.dietPreference}
      
      Health Considerations:
      - Health Issues: ${formData.healthIssues.join(', ') || 'None'}
      - Allergies: ${formData.allergies.join(', ') || 'None'}
      
      Please create a comprehensive diet plan that includes:
      1. Daily calorie target calculation
      2. Detailed meal plan with specific foods and portions
      3. Nutritional breakdown for each meal
      4. Key recommendations and tips
      5. Important notes about consulting healthcare professionals
      
      Format the response as clean, readable text with clear sections. Use simple formatting:
      - Use "SECTION:" for main headings
      - Use numbered lists (1., 2., 3.) for meal plans
      - Use simple dashes (-) for bullet points, not asterisks
      - Keep it practical and easy to read without excessive formatting
      - Avoid using asterisks (*) for emphasis or formatting`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let dietPlanText = response.text();
      
      // Clean up the formatting to remove excessive asterisks and improve readability
      dietPlanText = dietPlanText
        .replace(/\*\*\*/g, '') // Remove triple asterisks
        .replace(/\*\*/g, '') // Remove double asterisks (bold)
        .replace(/\*/g, '•') // Replace single asterisks with bullet points
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/SECTION:/g, '\n📋 ') // Replace SECTION: with emoji
        .replace(/Daily Calorie Target/gi, '🎯 Daily Calorie Target')
        .replace(/Meal Plan/gi, '🍽️ Meal Plan')
        .replace(/Breakfast/gi, '🌅 Breakfast')
        .replace(/Lunch/gi, '🌞 Lunch')
        .replace(/Dinner/gi, '🌙 Dinner')
        .replace(/Snacks/gi, '🥜 Snacks')
        .replace(/Recommendations/gi, '💡 Recommendations')
        .replace(/Important/gi, '⚠️ Important')
        .trim();
      
      setDietPlan(dietPlanText);
    } catch (error) {
      console.error('Error generating diet plan:', error);
      setDietPlan(`📋 Personalized Diet Plan

I apologize, but I'm having trouble generating your diet plan right now. Please try again in a moment.

💡 General Recommendations:
• Maintain a balanced diet with adequate protein, healthy fats, and complex carbohydrates
• Stay hydrated with 8-10 glasses of water daily
• Include plenty of fruits and vegetables
• Consult with a registered dietitian for personalized nutrition advice

⚠️ Important Note:
Please consult with a healthcare professional or registered dietitian before making significant dietary changes, especially if you have existing health conditions.
      `);
    }
    
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">AI Diet Planner</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Get a personalized diet plan based on your health profile, goals, and preferences. 
          Our AI considers all your requirements to create an optimal nutrition plan.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 shadow-xl shadow-black/20">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="w-5 h-5 text-green-400 mr-2" />
              Personal Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  className="w-full px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-200"
                  placeholder="25"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-200"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Weight (kg)</label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-200"
                  placeholder="70"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Height (cm)</label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  className="w-full px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-200"
                  placeholder="170"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">Activity Level</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value }))}
                className="w-full px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-200"
              >
                <option value="">Select</option>
                <option value="sedentary">Sedentary (little/no exercise)</option>
                <option value="light">Light (light exercise 1-3 days/week)</option>
                <option value="moderate">Moderate (moderate exercise 3-5 days/week)</option>
                <option value="active">Active (hard exercise 6-7 days/week)</option>
                <option value="very-active">Very Active (very hard exercise, physical job)</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">Diet Goal</label>
              <select
                value={formData.dietGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, dietGoal: e.target.value }))}
                className="w-full px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-200"
              >
                <option value="">Select</option>
                <option value="lose-weight">Lose Weight</option>
                <option value="gain-weight">Gain Weight</option>
                <option value="maintain-weight">Maintain Weight</option>
                <option value="build-muscle">Build Muscle</option>
                <option value="improve-health">Improve Overall Health</option>
              </select>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 shadow-xl shadow-black/20">
            <h3 className="text-xl font-semibold text-white mb-6">Health Considerations</h3>
            
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-3">Health Issues (select all that apply)</label>
              <div className="grid grid-cols-2 gap-3">
                {healthIssuesOptions.map((issue) => (
                  <label key={issue} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.healthIssues.includes(issue)}
                      onChange={() => handleCheckboxChange('healthIssues', issue)}
                      className="text-green-500 focus:ring-green-500 focus:ring-2 rounded accent-green-500"
                    />
                    <span className="text-gray-300 text-sm">{issue}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-3">Allergies (select all that apply)</label>
              <div className="grid grid-cols-2 gap-3">
                {allergyOptions.map((allergy) => (
                  <label key={allergy} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.allergies.includes(allergy)}
                      onChange={() => handleCheckboxChange('allergies', allergy)}
                      className="text-green-500 focus:ring-green-500 focus:ring-2 rounded accent-green-500"
                    />
                    <span className="text-gray-300 text-sm">{allergy}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">Diet Preference</label>
              <select
                value={formData.dietPreference}
                onChange={(e) => setFormData(prev => ({ ...prev, dietPreference: e.target.value }))}
                className="w-full px-3 py-2 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 transition-all duration-200"
              >
                <option value="">Select</option>
                <option value="omnivore">Omnivore</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
                <option value="mediterranean">Mediterranean</option>
              </select>
            </div>

            <button
              onClick={generateDietPlan}
              disabled={isGenerating || !formData.age || !formData.weight || !formData.height}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:via-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg shadow-green-600/30"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating Plan...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5 mr-2" />
                  Generate Diet Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 shadow-xl shadow-black/20">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Calendar className="w-5 h-5 text-green-400 mr-2" />
              Your Personalized Diet Plan
            </h3>
            
            {dietPlan ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent font-medium">Diet Plan Generated Successfully!</span>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-6 border border-gray-700/50 text-sm whitespace-pre-line text-gray-300 leading-relaxed shadow-lg">
                    {dietPlan}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 via-green-800/20 to-green-900/20 border border-green-700/30 rounded-lg shadow-lg">
                  <p className="text-green-400 font-medium mb-2">Important Note</p>
                  <p className="text-gray-300 text-sm">
                    This diet plan is AI-generated based on your inputs. Please consult with a registered 
                    dietitian or healthcare provider before making significant dietary changes, especially 
                    if you have existing health conditions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Fill in your information and click "Generate Diet Plan" to get your personalized nutrition plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;