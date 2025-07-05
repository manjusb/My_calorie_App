import React, { useState, useRef } from 'react';

const App = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [calories, setCalories] = useState(null);
    const [foodDescription, setFoodDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Handles image selection from the input
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            setCalories(null); // Clear previous results
            setFoodDescription('');
            setError('');
        } else {
            setSelectedImage(null);
            setImagePreviewUrl(null);
            setCalories(null);
            setFoodDescription('');
            setError('Please select an image file.');
        }
    };

    // Converts the selected image file to a base64 string
    const imageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Get base64 part
            reader.onerror = (error) => reject(error);
        });
    };

    // Estimates calories using the Gemini API
    const estimateCalories = async () => {
        if (!selectedImage) {
            setError('Please select an image first.');
            return;
        }

        setLoading(true);
        setError('');
        setCalories(null);
        setFoodDescription('');

        try {
            const base64ImageData = await imageToBase64(selectedImage);

            const prompt = "Analyze this food image. Provide a brief description of the food and estimate its calorie content. If you cannot determine the food, set description to 'Cannot determine food type' and calories to 'N/A'.";

            const payload = {
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: prompt },
                            {
                                inlineData: {
                                    mimeType: selectedImage.type, // Use actual mime type of the image
                                    data: base64ImageData
                                }
                            }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: "OBJECT",
                        properties: {
                            "description": { "type": "STRING" },
                            "calories": { "type": "STRING" }
                        },
                        required: ["description", "calories"]
                    }
                }
            };

            const apiKey = ""; // API key will be provided by the Canvas environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${errorData.error.message || 'Unknown error'}`);
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const jsonText = result.candidates[0].content.parts[0].text;
                try {
                    const parsedJson = JSON.parse(jsonText);
                    if (parsedJson.description && parsedJson.calories) {
                        setFoodDescription(parsedJson.description.trim());
                        setCalories(parsedJson.calories.trim());
                    } else {
                        setFoodDescription("Could not parse description or calories from the JSON response.");
                        setCalories("N/A");
                    }
                } catch (jsonError) {
                    setError(`Failed to parse JSON response: ${jsonError.message}. Raw response: ${jsonText}`);
                    setFoodDescription('');
                    setCalories(null);
                }

            } else {
                setFoodDescription('No content found in the API response.');
                setCalories('N/A');
            }

        } catch (err) {
            console.error("Error estimating calories:", err);
            setError(`Failed to estimate calories: ${err.message}`);
            setFoodDescription('');
            setCalories(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4 font-sans">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md border border-gray-200">
                <h1 className="text-3xl font-extrabold text-center text-purple-800 mb-6">
                    Food Calorie Estimator
                </h1>

                <div className="mb-6">
                    <label htmlFor="image-upload" className="block text-gray-700 text-sm font-semibold mb-2">
                        Upload Food Image
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        className="hidden" // Hide the default file input
                    />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                    >
                        Choose Image
                    </button>
                </div>

                {imagePreviewUrl && (
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Image Preview:</h2>
                        <img
                            src={imagePreviewUrl}
                            alt="Selected Food"
                            className="max-w-full h-auto rounded-lg shadow-lg border border-gray-300 mx-auto"
                            style={{ maxHeight: '250px', objectFit: 'contain' }}
                        />
                    </div>
                )}

                <button
                    onClick={estimateCalories}
                    disabled={!selectedImage || loading}
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg
                        ${!selectedImage || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Estimating...
                        </div>
                    ) : (
                        'Estimate Calories'
                    )}
                </button>

                {error && (
                    <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {foodDescription && calories && (
                    <div className="mt-6 p-5 bg-blue-50 border border-blue-200 rounded-xl shadow-inner">
                        <h2 className="text-xl font-semibold text-blue-800 mb-3">Estimation Results:</h2>
                        <p className="text-gray-700 mb-2">
                            <strong className="text-blue-700">Description:</strong> {foodDescription}
                        </p>
                        <p className="text-gray-700">
                            <strong className="text-blue-700">Estimated Calories:</strong> {calories}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
