import React, { useContext, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CartContext from '../store/CartContext';
import UserProgressContext from '../store/userProgressContext';
import { currencyFormatter } from '../utils/currencyFormatter';
import './PaymentButton.css';  // Import the CSS file

const stripePromise = loadStripe('pk_test_51PUv8PRsxvgjsoL9NIDqceUqPRsikj1PBEHsKW9dJKOV2yXhuv2QUJw6fcxr0DSNSyFe6mBW3t2JgcKGzQcGYFt700mBRNZt7E'); // Replace with your test publishable key

export default function PaymentButton() {
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);
    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price, 0);
    const [paymentStatus, setPaymentStatus] = useState(null); // State to manage payment status
    const [selectedCardType, setSelectedCardType] = useState('credit'); // State to manage selected card type

    const handlePaymentStatus = (status) => {
        setPaymentStatus(status);
        setTimeout(() => {
            setPaymentStatus(null);
        }, 5000); // Reset payment status after 5 seconds
    };

    return (
        <Elements stripe={stripePromise}>
            <div className="payment-form">
                <div className="progress-bar">
                    <div className="progress" style={{ width: '50%' }}></div>
                    <span>50% completed</span>
                </div>
                <div className="card-type-selection">
                    <label>
                        <input
                            type="radio"
                            value="credit"
                            checked={selectedCardType === 'credit'}
                            onChange={() => setSelectedCardType('credit')}
                        />
                        Credit Card
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="debit"
                            checked={selectedCardType === 'debit'}
                            onChange={() => setSelectedCardType('debit')}
                        />
                        Debit Card
                    </label>
                </div>
                <CheckoutForm
                    cartTotal={cartTotal}
                    userProgressCtx={userProgressCtx}
                    handlePaymentStatus={handlePaymentStatus}
                    selectedCardType={selectedCardType}
                />
                {paymentStatus === 'success' && (
                    <p className="success">Payment Successful!</p>
                )}
                {paymentStatus === 'error' && (
                    <p className="error">Payment failed. Please try again.</p>
                )}
            </div>
        </Elements>
    );
}

function CheckoutForm({ cartTotal, userProgressCtx, handlePaymentStatus, selectedCardType }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false); // State to manage loading state
    const [errorMessage, setErrorMessage] = useState(null); // State to manage error message
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            // Make a POST request to your server to fetch the client secret
            const response = await fetch('https://your-domain.com/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: cartTotal, cardType: selectedCardType }), // Adjust payload as per your server endpoint requirements
            });

            if (!response.ok) {
                throw new Error('Failed to fetch Payment Intent');
            }

            const { clientSecret } = await response.json();

            // Confirm the card payment using the retrieved client secret
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: nameOnCard,
                    },
                },
            });

            if (error) {
                console.error(error);
                setErrorMessage(error.message);
                handlePaymentStatus('error');
            } else {
                setErrorMessage(null);
                handlePaymentStatus('success');
                userProgressCtx.showCheckout();
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Something went wrong. Please try again.');
            handlePaymentStatus('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="payment-form">
            <div className="card-details">
                <label>
                    Card number
                    <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card number"
                        required
                    />
                </label>
                <div className="expiry-cvv">
                    <div className="expiry">
                        <label>
                            MM/YY
                            <input
                                type="text"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                placeholder="MM/YY"
                                required
                            />
                        </label>
                    </div>
                    <div className="cvv">
                        <label>
                            CVV
                            <input
                                type="text"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                placeholder="CVV"
                                required
                            />
                        </label>
                    </div>
                </div>
                <label>
                    Name on card
                    <input
                        type="text"
                        value={nameOnCard}
                        onChange={(e) => setNameOnCard(e.target.value)}
                        placeholder="Name on card"
                        required
                    />
                </label>
            </div>
            {errorMessage && <p className="error">{errorMessage}</p>}
            <button type="submit" className="save-button" disabled={!stripe || loading}>
                {loading ? 'Processing...' : 'Save and continue'}
            </button>
        </form>
    );
}
