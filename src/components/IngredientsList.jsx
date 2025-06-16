import useState from "react"


export default function IngredientsList(props){
    //show the list of ingridients only if it has something
    if(props.ingredientsLen > 0){
        return (
            <section>
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">{props.ingredientsListItems}</ul>
            {/* show the get recipy button only if you have more then 3 ingridients */}
            {props.ingredientsLen > 3 && <div className="get-recipe-container">
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