import { useState } from "react"
import AIRecipe from "./AIRecipe"
import IngredientsList from "./IngredientsList"
import getRecipeFromMistral from "../getRecipe"

export default function Main() {

    const [ingredients, setIngredients] = useState([])
    const [showRes, setShowRes] = useState(false)
    const [recipe, setRecipe] = useState({})

    

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prev => [...prev, newIngredient])
    }


    async function ShowRecipe(){
        setRecipe(await getRecipeFromMistral(ingredients))
        console.log("recipe:" , recipe)
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
            ingredients = {ingredients}
            ShowRecipe = {ShowRecipe}
            />
            {showRes && <AIRecipe recipe={recipe}/>}
        </main>
    )
}