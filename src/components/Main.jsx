import { useState, useRef, useEffect } from "react"
import AIRecipe from "./AIRecipe"
import IngredientsList from "./IngredientsList"
import getRecipeFromMistral, { checkIngredients } from "../getRecipe"

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

    function updateIngredient(oldIng, newIng) {
        setIngredients(prev =>
            prev.map(ing => (ing === oldIng ? newIng : ing))
        );
    }


    async function GetRecipe(){
        setErrorMessage("")
        setIsLoading(true)
        try {
        const res = await checkIngredients(ingredients);
        if (res.error && res.error.includes("daily limit")) {
        setErrorMessage("Sorry, the Spoonacular API daily limit has been reached. Please try again later.");
        setIsLoading(false);
        return;
        }
        if (res.error && res.error.includes("undefined in the API")) {
        setErrorMessage(res.error + "\nPlease enter a valid ingredient.");
        setIsLoading(false);
        return;
        }
        if (res.error) {
        setErrorMessage("Sorry, try again later.");
        setIsLoading(false);
        return;
        }
        const answer = res.answer;

        if (res.corrections) {
            console.log(res.corrections)
            for (const [original, corrected] of Object.entries(res.corrections)) {
                updateIngredient(original, corrected);
            }
        }

        if (answer === "YES") {
            const recipe = await getRecipeFromMistral(ingredients);
            setRecipe(recipe);
        } else {
            setErrorMessage("Please enter a valid list of ingredients.");
            setTimeout(() => setErrorMessage(""), 5000);
        }
    } catch (err) {
        console.error(err);
        setErrorMessage("Something went wrong. Please try again.");
        setTimeout(() => setErrorMessage(""), 5000);
    }
        setIsLoading(false)
    }

    
    return (
        <main>
            <div className="form-container">
                <form action={addIngredient} className="add-ingredient-form">
                    <input
                        type="text"
                        placeholder="e.g. oregano"
                        aria-label="Add ingredient"
                        name="ingredient"
                    />
                    <button>Add ingredient</button>
                </form>
                <p className="instructions">you need at least 4 ingredients </p>
            </div>
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
            {errorMessage && <pre className="error-message">{errorMessage}</pre>}
            <div ref={resultRef}>
                {recipe && <AIRecipe recipe={recipe} />}
            </div>
        </main>
    )
}