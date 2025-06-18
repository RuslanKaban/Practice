import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../../store/store";
import { useCart } from "../../context/CartContext";
import styles from "./ProductPage.module.css";

interface Product {
    id: number;
    title: string;
    price: number;
    discont_price: number | null;
    description: string;
    image: string;
}

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false); // <-- Новый стейт для кнопки

    const { addToCart } = useCart();

    useEffect(() => {
        if (!id) return;

        fetch(`${API_URL}/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.status === "ERR") {
                    setError(data.message);
                    setProduct(null);
                } else {
                    setProduct(data[0]);
                    setError(null);
                }
            })
            .catch(() => setError("Ошибка загрузки товара"));
    }, [id]);

    if (error) return <p className={styles.error}>Ошибка: {error}</p>;
    if (!product) return <p className={styles.loading}>Загрузка...</p>;

    const discountPercent =
        product.discont_price && product.price
            ? Math.round(
                ((product.price - product.discont_price) / product.price) * 100
            )
            : 0;

    const priceToShow = product.discont_price ?? product.price;

    const handleAddToCart = () => {
        addToCart(
            {
                id: product.id,
                title: product.title,
                price: product.price,
                discont_price: product.discont_price,
                image: product.image ?? "",
            },
            quantity
        );
        setAdded(true); // Помечаем, что товар добавлен
    };

    return (
        <div className={styles.container}>
            {product.image && (
                <img
                    src={`${API_URL}${product.image}`}
                    alt={product.title}
                    className={styles.image}
                />
            )}

            <div className={styles.details}>
                <h1 className={styles.title}>{product.title}</h1>

                <div className={styles.priceBlock}>
                    <span className={styles.price}>${priceToShow}</span>
                    {product.discont_price && (
                        <>
                            <span className={styles.oldPrice}>${product.price}</span>
                            <span className={styles.discount}>-{discountPercent}%</span>
                        </>
                    )}
                </div>

                <div className={styles.quantityBlock}>
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                </div>

                <button
                    className={`${styles.addToCart} ${added ? styles.added : ""}`}
                    onClick={handleAddToCart}
                    disabled={added}
                >
                    {added ? "Added" : "Add to cart"}
                </button>


                <div className={styles.description}>
                    <h3>Description</h3>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
