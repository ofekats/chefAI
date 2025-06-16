import { useState } from "react"
import ClaudeRecipe from "./ClaudeRecipe"
import IngredientsList from "./IngredientsList"

export default function Main() {

    const [ingredients, setIngredients] = useState([])
    const [showRes, setShowRes] = useState(false)

    const ingredientsListItems = ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prev => [...prev, newIngredient])
    }


    function ShowRecipe(){
        setShowRes(prev => !prev)
    }

    
    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button>Add ingredient</button>
            </form>
            <IngredientsList
            ingredientsLen = {ingredients.length}
            ingredientsListItems = {ingredientsListItems}
            ShowRecipe = {ShowRecipe}
            />
            {showRes && <ClaudeRecipe/>}
        </main>
    )
}