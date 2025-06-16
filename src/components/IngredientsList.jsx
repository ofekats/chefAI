import useState from "react"

export default function IngredientsList(props){
    const ingredientsListItems = props.ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))

    //show the list of ingridients only if it has something
    if(props.ingredients.length > 0){
        return (
            <section>
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
            {/* show the get recipy button only if you have more then 3 ingridients */}
            {props.ingredients.length > 3 && <div className="get-recipe-container">
                <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from your list of ingredients.</p>
                </div>
                <button onClick={props.ShowRecipe}>Get a recipe</button>
            </div>
            }
            
        </section>
        )
    }
}