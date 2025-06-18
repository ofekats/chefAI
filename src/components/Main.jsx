import { useState, useRef, useEffect } from "react"
import AIRecipe from "./AIRecipe"
import IngredientsList from "./IngredientsList"
import getRecipeFromMistral from "../getRecipe"

export default function Main() {

    const [ingredients, setIngredients] = useState([])
    const [recipe, setRecipe] = useState()
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const resultRef = useRef(null);

    useEffect(() => {
    if (recipe && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [recipe]);

    function addIngredient(formData) {
    const newIngredient = formData.get("ingredient")?.trim()
    if (!newIngredient) {
        setErrorMessage("Please enter a valid ingredient.")
        setTimeout(() => setErrorMessage(""), 3000)
        return
    }

    setIngredients(prev => {
        const alreadyExists = prev.some(i => i.toLowerCase() === newIngredient.toLowerCase())
        if (alreadyExists) {
            setErrorMessage(`"${newIngredient}" is already in the list.`)
            setTimeout(() => setErrorMessage(""), 3000)
            return prev
        }
        return [...prev, newIngredient]
    })
}


    function removeIngredient(ingredientToRemove) {
        setIngredients(prev => prev.filter(ingredient => ingredient !== ingredientToRemove))
    }

    function removeAllIngredient() {
        setIngredients([])
    }


    async function GetRecipe(){
        setIsLoading(true)
        setRecipe(await getRecipeFromMistral(ingredients))
        setIsLoading(false)
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
            removeAllIngredient= {removeAllIngredient}
            />
            {isLoading && (
            <div className="loading-overlay">
                <img src="/images/cookingAnimation.gif" alt="Loading..." />
            </div>
            )}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div ref={resultRef}>
                {recipe && <AIRecipe recipe={recipe} />}
            </div>
        </main>
    )
}