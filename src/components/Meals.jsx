import { useState, useEffect } from "react";
import MealItem from "./MealItem.jsx";

export default function Meals() {

    const [mealsLoader, setMealsLoader] = useState([])

    useEffect(() => {
        async function loadMeals() {
            try {
                let response = await fetch('http://localhost:3000/meals');
                if (!response.ok) {
    
                }
                let meals = await response.json();
                setMealsLoader(meals)
    
    
            } catch (error) {
                console.log(error)
            }
           
        }
        loadMeals()
    }, [])

    return (<ul id="meals">{mealsLoader.map((meal) => (
        <MealItem key={meal.id} meal={meal}></MealItem>
    ))}</ul>)
}