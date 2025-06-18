import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../store/store";
import styles from "./DiscountProducts.module.css";

interface Product {
  id: number;
  title: string;
  price: number;
  discont_price?: number | null;
  description?: string;
  image?: string;
}

const DiscountedProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [sortBy, setSortBy] = useState<
    "none" | "price-asc" | "price-desc" | "title-asc" | "title-desc"
  >("none");

  useEffect(() => {
    fetch(`${API_URL}/products/all`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки продуктов");
        return res.json();
      })
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка товаров...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  // Фильтруем только товары со скидкой
  const filteredProducts = products
    .filter((p) => p.discont_price !== null && p.discont_price !== undefined) // Только со скидкой
    .filter((p) => {
      const price = p.discont_price ?? p.price;
      if (priceFrom && price < Number(priceFrom)) return false;
      if (priceTo && price > Number(priceTo)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "none") return 0;
      if (sortBy === "price-asc") {
        const priceA = a.discont_price ?? a.price;
        const priceB = b.discont_price ?? b.price;
        return priceA - priceB;
      }
      if (sortBy === "price-desc") {
        const priceA = a.discont_price ?? a.price;
        const priceB = b.discont_price ?? b.price;
        return priceB - priceA;
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Discounted Products</h1>

      <div className={styles.filters}>
        <div className={styles.priceFilter}>
          <label htmlFor="priceFrom">Price</label>
          <input
            id="priceFrom"
            type="number"
            min="0"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            placeholder="from"
            className={styles.priceInput}
          />
          <input
            id="priceTo"
            type="number"
            min="0"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            placeholder="to"
            className={styles.priceInput}
          />
        </div>

        {/* Кнопка "Discounted items" убрана */}

        <div className={styles.filterItem}>
          <label htmlFor="sortBy">Sorted</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="none">None</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
        </div>
      </div>

      <div className={styles.products}>
        {filteredProducts.length === 0 && <p>No discounted products found</p>}

        {filteredProducts.map((product) => {
          const discountPercent =
            product.discont_price && product.price
              ? Math.round(
                  ((product.price - product.discont_price) / product.price) * 100
                )
              : 0;

          return (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className={styles.card}
            >
              {discountPercent > 0 && (
                <div className={styles.discountBadge}>-{discountPercent}%</div>
              )}
              <img
                src={`${API_URL}${product.image}`}
                alt={product.title}
                className={styles.image}
              />
              <div className={styles.info}>
                <h3 className={styles.productTitle}>{product.title}</h3>
                <div className={styles.priceBlock}>
                  <span className={styles.newPrice}>${product.discont_price}</span>
                  <span className={styles.oldPrice}>${product.price}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DiscountedProducts;
