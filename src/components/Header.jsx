import { useContext } from "react";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/userProgressContext";
import logo from "../assets/logo.jpg";
import Button from "./UI/Button";

export default function Header() {
    const cartCtx = useContext(CartContext);
    const userProgressCTX = useContext(UserProgressContext);

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity;
    }, 0);

    function handleShowCart() {
        userProgressCTX.showCart();
    }

    return (
        <header id="main-header">
            <div id="title">
                <img src={logo} alt="logo" />
                <h1>ZOMATO -TOMATO</h1>
            </div>
            <nav>
                <Button textOnly onClick={handleShowCart}>
                    Cart ({totalCartItems})
                </Button>
            </nav>
        </header>
    );
}
