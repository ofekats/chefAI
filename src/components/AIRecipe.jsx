import ReactMarkdown from 'react-markdown'

export default function AIRecipe(props){
    console.log(props.recipe)
    
    return (
        <>
            <h1>Recipe from ai!</h1>
            <ReactMarkdown>{props.recipe}</ReactMarkdown>
        </>
    )
}