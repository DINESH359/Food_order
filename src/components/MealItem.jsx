import { currencyFormatter } from '../utils/currencyFormatter.js'
import Button from "../components/UI/Button.jsx";
import { useContext, useState } from 'react';
import CartContext from '../store/CartContext.jsx';



export default function MealItem({ meal }) {
    const [addToCartButton, setAddToCartButton] = useState('Add to Cart')
    const cartCtx = useContext(CartContext);
    function handleAddMealToCart() {
        setAddToCartButton('Added to cart');
        cartCtx.addItem(meal);
        setTimeout(() => {
            setAddToCartButton('Add to Cart');
        }, 2000); // Reset button text after 2 seconds
    }

    const buttonClass = addToCartButton === 'Added to cart' ? 'added' : '';

    return (
        <li className="meal-item">
            <article>
                <img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />
                <div>
                    <h3>{meal.name}</h3>
                    <p className="meal-item-price">{currencyFormatter.format(meal.price)}</p>
                    <p className="meal-item-description"> {meal.description}</p>
                </div>
                <p className="meal-item-actions">
                    <Button className={buttonClass} onClick={handleAddMealToCart}>{addToCartButton}</Button>
                </p>
            </article>
        </li>
    )
}