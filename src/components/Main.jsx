import { useState } from "react"
import AIRecipe from "./AIRecipe"
import IngredientsList from "./IngredientsList"
import getRecipeFromMistral from "../getRecipe"

export default function Main() {

    const [ingredients, setIngredients] = useState([])
    const [recipe, setRecipe] = useState()

    function addIngredient(formData) {
        const newIngredient = formData.get("ingredient")
        setIngredients(prev => [...prev, newIngredient])
    }

    function removeIngredient(ingredientToRemove) {
        setIngredients(prev => prev.filter(ingredient => ingredient !== ingredientToRemove))
    }

    function removeAllIngredient() {
        setIngredients([])
    }


    async function GetRecipe(){
        setRecipe(await getRecipeFromMistral(ingredients))
        console.log("recipe:" , recipe)
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
            GetRecipe = {GetRecipe}
            removeIngredient= {removeIngredient}
            />
            {recipe && <AIRecipe recipe={recipe}/>}
        </main>
    )
}