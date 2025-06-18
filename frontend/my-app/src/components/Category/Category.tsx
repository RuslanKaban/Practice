import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../../store/store";
import styles from "./Category.module.css";
import { useCart } from "../../context/CartContext";

interface Product {
  id: number;
  title: string;
  price: number;
  discont_price: number | null;
  description: string;
  image: string;
}

interface CategoryResponse {
  category: {
    id: number;
    title: string;
  };
  data: Product[];
}

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [priceFrom, setPriceFrom] = useState<string>("");
  const [priceTo, setPriceTo] = useState<string>("");
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [sortBy, setSortBy] = useState<
    "none" | "price-asc" | "price-desc" | "title-asc" | "title-desc"
  >("none");

  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_URL}/categories/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка загрузки категории");
        return res.json();
      })
      .then((data: CategoryResponse) => {
        setCategoryTitle(data.category.title);
        setProducts(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const filteredProducts = products
    .filter((p) => {
      const price = p.discont_price ?? p.price;
      if (priceFrom && price < Number(priceFrom)) return false;
      if (priceTo && price > Number(priceTo)) return false;
      if (onlyDiscount && !p.discont_price) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "none") return 0;
      const priceA = a.discont_price ?? a.price;
      const priceB = b.discont_price ?? b.price;
      if (sortBy === "price-asc") return priceA - priceB;
      if (sortBy === "price-desc") return priceB - priceA;
      if (sortBy === "title-asc") return a.title.localeCompare(b.title);
      if (sortBy === "title-desc") return b.title.localeCompare(a.title);
      return 0;
    });

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); // чтобы не сработал переход по ссылке
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        discont_price: product.discont_price,
        image: product.image,
      },
      1
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{categoryTitle}</h1>

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

        <button
          className={`${styles.discountLink} ${
            onlyDiscount ? styles.activeDiscount : ""
          }`}
          onClick={() => setOnlyDiscount(!onlyDiscount)}
          type="button"
        >
          Discounted items
        </button>

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
        {filteredProducts.length === 0 && <p>No products found</p>}
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
              className={styles.cardLink}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div className={styles.card}>
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
                    {product.discont_price ? (
                      <>
                        <span className={styles.newPrice}>${product.discont_price}</span>
                        <span className={styles.oldPrice}>${product.price}</span>
                      </>
                    ) : (
                      <span className={styles.newPrice}>${product.price}$</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.addToCartBtn}
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPage;
