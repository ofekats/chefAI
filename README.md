# 🧠 ChefAI – AI-Powered Recipe Generator

ChefAI is a web application that helps you create delicious recipes based on the ingredients you have at home.  
It intelligently validates your ingredients using the **Spoonacular API**, and then uses AI models like **Mistral (via Hugging Face)** and **Cohere** to generate creative, detailed recipes.

<img src="https://github.com/user-attachments/assets/5fc03326-adea-40be-a903-4278d60a9966" alt="cookingAnimation" width="100"/>


---
## 🍽️ [Try It Yourself](https://chefaiok.netlify.app)  

https://chefaiok.netlify.app   
Launch the live app and generate your own AI-powered recipes 🍝

---

## 👩‍🍳 How It Works

1. User enters a list of ingredients
2. Each ingredient is checked using the **Spoonacular API**:
   - If a close match is found → the ingredient is automatically corrected
   - If invalid → the user is asked to revise the list
3. A recipe is generated using **Mistral** or **Cohere**
4. The full recipe is displayed to the user

---

## 🚀 Features

- ✅ **Ingredient validation** with Spoonacular (including typo correction)
- 🧠 **Recipe generation** using LLMs:
  - ✨ **Cohere** 
  - ✨ **Mistral** 
- 📝 **Correction system** – suggests the most relevant match if a word is unclear (e.g., "black" → "blackberries")
- ⚡ **Serverless architecture** using **Netlify Functions**
- 🌐 **Deployed on Netlify**

---

## 🛠️ Tech Stack

- React
- Netlify Functions (serverless backend)
- Spoonacular API (ingredient lookup)
- Hugging Face Inference API (Mistral)
- Cohere API (text generation)
- CSS

---

This project was inspired by and built during practice using [Scrimba](https://scrimba.com/) 

---
