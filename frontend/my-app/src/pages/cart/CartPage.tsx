import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import styles from "./CartPage.module.css";
import { Link } from "react-router-dom";
import { API_URL } from "../../store/store";

const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let result = "+7 ";
    if (digits.length > 1) {
        result += "(" + digits.substring(1, 4);
    }
    if (digits.length >= 4) {
        result += ") ";
        result += digits.substring(4, 7);
    }
    if (digits.length >= 7) {
        result += "-";
        result += digits.substring(7, 9);
    }
    if (digits.length >= 9) {
        result += "-";
        result += digits.substring(9, 11);
    }
    return result;
};

const CartPage: React.FC = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

    const [formData, setFormData] = useState({
        name: "",
        phone: "+7 ",
        email: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const totalPrice = cartItems.reduce((sum, item) => {
        const price = item.discont_price ?? item.price;
        return sum + price * item.quantity;
    }, 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "phone") {
            if (value.length <= 18) {
                const formatted = formatPhoneNumber(value);
                setFormData((prev) => ({
                    ...prev,
                    phone: formatted
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.phone.length < 18) {
            alert("Please enter full phone number");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                customer: formData,
                items: cartItems
            };

            const response = await fetch(`${API_URL}/order/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cartItems, customer: formData, totalItems }),
            });


            const data = await response.json();

            if (data.status === "OK") {
                setShowModal(true);
                clearCart();
                setFormData({
                    name: "",
                    phone: "+7 ",
                    email: ""
                });
                setOrderPlaced(true);
            } else {
                alert("Something went wrong. Please try again.");
            }

        } catch (error) {
            alert("Error: " + error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (cartItems.length === 0 && !showModal) {
        return (
            <div className={styles.container}>
                <h1>Shopping cart</h1>
                <p>Looks like you have no items in your basket currently.</p>
                <Link to="/products" className={styles.button}>
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Shopping Cart</h1>

            <button className={styles.clearBtn} onClick={clearCart} disabled={isSubmitting}>
                Clear Cart
            </button>

            <div className={styles.flexWrapper}>
                <ul className={styles.cartList}>
                    {cartItems.map((item) => {
                        const price = item.discont_price ?? item.price;
                        return (
                            <li key={item.id} className={styles.cartItem}>
                                <img
                                    src={`${API_URL}${item.image}`}
                                    alt={item.title}
                                    className={styles.image}
                                />
                                <div className={styles.info}>
                                    <h3>{item.title}</h3>
                                    <div className={styles.quantity}>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={isSubmitting || item.quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            disabled={isSubmitting}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        className={styles.removeBtn}
                                        onClick={() => removeFromCart(item.id)}
                                        disabled={isSubmitting}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div className={styles.subtotal}>
                                    <b>${(price * item.quantity).toFixed(2)}</b>
                                </div>
                            </li>
                        );
                    })}
                </ul>

                <div className={styles.orderDetails}>
                    <h2>Order Details</h2>
                    <p>{totalItems} items</p>
                    <h2>Total: ${totalPrice.toFixed(2)}</h2>

                    <form className={styles.firstOrder_form} onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="+7 (___) ___-__-__"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            maxLength={18}
                            disabled={isSubmitting}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isSubmitting}
                        />
                        <input
                            type="submit"
                            value={orderPlaced ? "The Order is Placed" : isSubmitting ? "Ordering..." : "Order"}
                            disabled={isSubmitting || orderPlaced}
                            className={orderPlaced ? styles.orderPlacedBtn : ""}
                        />

                    </form>
                </div>
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Congratulations!</h2>
                        <p>Your order has been successfully placed on the website.</p>
                        <p>A manager will contact you shortly to confirm your order.</p>
                        <button onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
