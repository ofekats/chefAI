import ReactMarkdown from 'react-markdown'

export default function AIRecipe(props){
    
    return (
        <>
            <h1>Recipe from ai:</h1>
            <ReactMarkdown>{props.recipe}</ReactMarkdown>
        </>
    )
}