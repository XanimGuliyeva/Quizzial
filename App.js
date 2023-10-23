import React from "react"
import Start from "./components/Start.js"
import Questions from "./components/Questions.js"



export default function App() {
  
  const [start,setStart] = React.useState(false)
  function handleClick(){
    setStart(prev=>!prev)
  }

  return (
     <div className="app">
      {start ? <Questions /> : <Start onClick={handleClick} />}
    </div>
  );
}
