import { useState } from "react"

export default function IngredientsList(props){
    const [hoveredIngredient, setHoveredIngredient] = useState(null);

  const ingredientsListItems = props.ingredients.map(ingredient => (
    <li
      key={ingredient}
      className="ingredientItem"
      style={{
        border: hoveredIngredient === ingredient ? "2px solid #ff4d4d" : "2px solid transparent"
      }}
    >
      {ingredient}
      <button
        className="removeIngredient"
        onClick={() => props.removeIngredient(ingredient)}
        onMouseEnter={() => setHoveredIngredient(ingredient)}
        onMouseLeave={() => setHoveredIngredient(null)}
      >X</button>
        </li>
    ))

    //show the list of ingridients only if it has something
    if(props.ingredients.length > 0){
        return (
            <section>
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">{ingredientsListItems}</ul>
            <button className="clearIngredients" onClick={props.removeAllIngredient}>clear all</button>
            {/* show the get recipy button only if you have more then 3 ingridients */}
            {props.ingredients.length > 3 && <div className="get-recipe-container">
                <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe from your list of ingredients.</p>
                </div>
                <button onClick={props.GetRecipe}>Get a recipe</button>
            </div>
            }
            
        </section>
        )
    }
}