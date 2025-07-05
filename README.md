# My_calorie_App
Food Calorie Estimator App
A simple web application built with React that allows users to upload a food image and get an estimated calorie count and description using the Gemini AI model.

Table of Contents
About the App

Features

Technologies Used

Setup and Installation (Local)

Usage

API Key

About the App
This application provides a convenient way to get quick calorie estimations for various food items by simply uploading their pictures. It leverages the power of Google's Gemini AI to analyze the image content and provide relevant information.

Features
Image Upload: Easily select and upload food images from your device.

Image Preview: View a preview of the selected image before processing.

AI-Powered Calorie Estimation: Utilizes the gemini-2.0-flash model to analyze food images and provide estimated calorie counts and descriptions.

Structured Output: The AI response is parsed from a structured JSON format for reliable data extraction.

Loading Indicator: Provides visual feedback during the calorie estimation process.

Error Handling: Displays informative messages for any issues during image selection or API communication.

Responsive Design: Built with Tailwind CSS to ensure a clean and adaptive user interface across different devices (mobile, tablet, desktop).

Technologies Used
React: A JavaScript library for building user interfaces.

Tailwind CSS: A utility-first CSS framework for rapid UI development.

Google Gemini API: For image analysis and calorie estimation (gemini-2.0-flash model).

JavaScript (ES6+): Core programming language.

HTML5/CSS3: For structuring and styling the web application.

Setup and Installation (Local)
To run this application locally on your machine, follow these steps:

Clone the repository:

git clone https://github.com/your-username/food-calorie-estimator.git
cd food-calorie-estimator

(Replace your-username/food-calorie-estimator.git with the actual repository URL once you create it.)

Install dependencies:

npm install
# or
yarn install

Set up your Gemini API Key:

Obtain an API key from Google Cloud Console for the Gemini API.

In the src/App.js file, locate the apiKey variable:

const apiKey = ""; // API key will be provided by the Canvas environment

For local development, you might want to replace "" with your actual API key, or better yet, use environment variables (e.g., a .env file) to keep your API key secure. If using a .env file, you would typically access it like process.env.REACT_APP_GEMINI_API_KEY.

Create a .env file in the root of your project:

REACT_APP_GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"

Then, in src/App.js, change const apiKey = ""; to:

const apiKey = process.env.REACT_APP_GEMINI_API_KEY || "";

Remember to restart your development server after creating or modifying .env files.

Start the development server:

npm start
# or
yarn start

This will open the application in your default web browser at http://localhost:3000.

Usage
Open the Application: Navigate to the application in your web browser.

Upload Image: Click the "Choose Image" button to select a food image from your device.

Preview Image: The selected image will be displayed in the "Image Preview" section.

Estimate Calories: Click the "Estimate Calories" button. The application will send the image to the Gemini API for analysis.

View Results: Once the analysis is complete, the "Estimation Results" section will display the food description and the estimated calorie count. Any errors will also be shown.

API Key
This application uses the Google Gemini API for image analysis. An API key is required to make requests to the Gemini model. For local development, you can embed your API key directly in the code (as shown in the setup instructions) or, preferably, use environment variables for better security. When deploying to a production environment, ensure your API key is managed securely (e.g., through server-side environment variables or a proxy).
