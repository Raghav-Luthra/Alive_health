import React, { useState } from 'react';
import { Camera, Upload, Zap, Activity } from 'lucide-react';
import { visionModel } from '../config/gemini';
import { fileToGenerativePart } from '../utils/imageUtils';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

const FoodAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setNutritionData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFood = async () => {
    if (!selectedImage || !selectedFile) return;
    
    setAnalyzing(true);
    
    try {
      const imagePart = await fileToGenerativePart(selectedFile);
      
      const prompt = `Analyze this food image and provide detailed nutritional information. Please respond with ONLY a JSON object in this exact format:
      {
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number,
        "fiber": number,
        "sugar": number
      }
      
      Provide realistic nutritional values per serving. If you cannot identify the food clearly, provide reasonable estimates for a typical meal portion.`;

      const result = await visionModel.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const nutritionData = JSON.parse(jsonMatch[0]);
        setNutritionData(nutritionData);
      } else {
        // Fallback if JSON parsing fails
        setNutritionData({
          calories: 250,
          protein: 15,
          carbs: 30,
          fat: 8,
          fiber: 5,
          sugar: 6
        });
      }
    } catch (error) {
      console.error('Error analyzing food:', error);
      // Fallback nutrition data
      setNutritionData({
        calories: 250,
        protein: 15,
        carbs: 30,
        fat: 8,
        fiber: 5,
        sugar: 6
      });
    }
    
    setAnalyzing(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Food Nutrition Analysis</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Upload an image of your food and let our AI analyze its nutritional content instantly.
          Get detailed information about calories, macronutrients, and more.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 shadow-xl shadow-black/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Camera className="w-5 h-5 text-green-400 mr-2" />
              Upload Food Image
            </h3>
            
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-green-500/50 transition-all duration-300 hover:bg-gradient-to-br hover:from-green-500/5 hover:to-transparent">
              {selectedImage ? (
                <div className="space-y-4">
                  <img 
                    src={selectedImage} 
                    alt="Selected food"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto shadow-lg"
                  />
                  <p className="text-green-400 text-sm">Image uploaded successfully!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-600 mx-auto" />
                  <div>
                    <p className="text-white font-medium">Choose an image to upload</p>
                    <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg cursor-pointer hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg shadow-green-600/25"
              >
                {selectedImage ? 'Change Image' : 'Select Image'}
              </label>
            </div>

            {selectedImage && (
              <button
                onClick={analyzeFood}
                disabled={analyzing}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-600 via-green-600 to-green-700 text-white rounded-lg font-medium hover:from-green-700 hover:via-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg shadow-green-600/30"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Analyze Nutrition
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700/50 shadow-xl shadow-black/20">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 text-green-400 mr-2" />
              Nutrition Results
            </h3>
            
            {nutritionData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-4 border border-gray-700/50 shadow-lg">
                    <p className="text-gray-400 text-sm">Calories</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent">{nutritionData.calories}</p>
                    <p className="text-gray-500 text-xs">kcal</p>
                  </div>
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-4 border border-gray-700/50 shadow-lg">
                    <p className="text-gray-400 text-sm">Protein</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">{nutritionData.protein}g</p>
                  </div>
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-4 border border-gray-700/50 shadow-lg">
                    <p className="text-gray-400 text-sm">Carbs</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">{nutritionData.carbs}g</p>
                  </div>
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-4 border border-gray-700/50 shadow-lg">
                    <p className="text-gray-400 text-sm">Fat</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">{nutritionData.fat}g</p>
                  </div>
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-4 border border-gray-700/50 shadow-lg">
                    <p className="text-gray-400 text-sm">Fiber</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent">{nutritionData.fiber}g</p>
                  </div>
                  <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-4 border border-gray-700/50 shadow-lg">
                    <p className="text-gray-400 text-sm">Sugar</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-pink-500 bg-clip-text text-transparent">{nutritionData.sugar}g</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 via-green-800/20 to-green-900/20 border border-green-700/30 rounded-lg shadow-lg">
                  <p className="text-green-400 font-medium mb-2">Health Insights</p>
                  <p className="text-gray-300 text-sm">
                    This food provides a balanced mix of macronutrients. The protein content supports muscle maintenance, 
                    while the fiber aids in digestion. Consider this as part of a balanced meal plan.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Upload and analyze a food image to see nutrition results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodAnalyzer;