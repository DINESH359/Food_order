import { useContext } from "react";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/userProgressContext";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../utils/currencyFormatter";
import Button from "./UI/Button";
import CartItem from "./CartItem";
import PaymentButton from  './PaymentButton'; // Import the PaymentButton component

export default function Cart() {
    const cartCtx = useContext(CartContext);
    const userProgressCTX = useContext(UserProgressContext);

    const cartTotal = cartCtx.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity * item.price,
        0
    );

    function closeDialog() {
        userProgressCTX.hideCart();
    }

    function handleGoToCheckout() {
        userProgressCTX.showCheckout();
    }

    return (
        <Modal className="cart" open={userProgressCTX.progress === 'cart' || userProgressCTX.progress === 'checkout'}>
            {userProgressCTX.progress === 'cart' && (
                <>
                    <h2>Your Cart</h2>
                    <ul>
                        {cartCtx.items.map((item) => (
                            <CartItem 
                                key={item.id} 
                                name={item.name} 
                                quantity={item.quantity} 
                                price={item.price}
                                onIncrease={() => { cartCtx.addItem(item) }}
                                onDecrease={() => { cartCtx.removeItem(item.id) }}
                            />
                        ))}
                    </ul>
                    <p className="cart-total">
                        {currencyFormatter.format(cartTotal)}
                    </p>
                    <p className="modal-actions">
                        <Button textOnly onClick={closeDialog}>Close</Button>
                        {cartCtx.items.length > 0 && (
                            <Button onClick={handleGoToCheckout}>Go to Checkout</Button>
                        )}
                    </p>
                </>
            )}
            {userProgressCTX.progress === 'checkout' && (
                <PaymentButton />
            )}
        </Modal>
    );
}
