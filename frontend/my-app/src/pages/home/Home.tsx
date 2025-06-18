import React, { useEffect, useState } from "react";
import styles from './Home.module.css';
import { API_URL } from "../../store/store";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  title: string;
  image: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  discont_price?: number;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  categoryId?: number;
  discountPercent?: number;
}

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

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topDiscountProducts, setTopDiscountProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "+7 ",
    email: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/categories/all`)
      .then((res) => res.json())
      .then((data: Category[]) => {
        setCategories(data.slice(0, 4));
      })
      .catch((err) => console.error("Ошибка при загрузке категорий:", err));
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/products/all`)
      .then(res => res.json())
      .then((data: Product[]) => {
        const discounted = data
          .filter(p => p.discont_price !== undefined && p.discont_price < p.price)
          .map(p => ({
            ...p,
            discountPercent: Math.round(((p.price - (p.discont_price ?? p.price)) / p.price) * 100)
          }))
          .sort((a, b) => b.discountPercent! - a.discountPercent!)
          .slice(0, 4);
        setTopDiscountProducts(discounted);
      })
      .catch(err => console.error("Ошибка при загрузке продуктов:", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      if (value.length <= 18) {
        const formatted = formatPhoneNumber(value);
        setFormData(prev => ({ ...prev, phone: formatted }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.phone.length < 18) {
      alert("Пожалуйста, введите полный номер телефона");
      return;
    }

    const data = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    };

    try {
      const response = await fetch(`${API_URL}/order/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Ответ от сервера:", result);
      alert("Спасибо! Ваша заявка принята.");

      setFormData({ name: "", phone: "+7 ", email: "" });
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      alert("Ошибка при отправке, попробуйте позже");
    }
  };

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <img src="/hero.jpg" alt="Главный баннер" />
        <div className={styles.hero_content}>
          <h1 className={styles.content_title}>Amazing Discounts on Garden Products!</h1>
          <button className={styles.content_button}>Check out</button>
        </div>
      </section>

      <section className={styles.categories}>
        <div className={styles.categories_header}>
          <h2 className={styles.categories_title}>Categories</h2>
          <Link to="/categories" className={styles.view_all}>All Categories</Link>
        </div>

        <div className={styles.categories_list}>
          {categories.map((cat) => (
            <Link to={`/categories/${cat.id}`} className={styles.category_card} key={cat.id}>
              <img src={`${API_URL}${cat.image}`} alt={cat.title} />
              <p>{cat.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.firstOrder}>
        <h2 className={styles.firstOrder_title}>5% off on the first order</h2>

        <div className={styles.firstOrder_container}>
          <img
            src="/firstOrderImg.png"
            alt="Руки с предметами"
            className={styles.firstOrder_img}
          />

          <form className={styles.firstOrder_form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="+7 (___) ___-__-__"
              value={formData.phone}
              onChange={handleChange}
              required
              maxLength={18}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input type="submit" value="Get a discount" />
          </form>
        </div>
      </section>

      <section className={styles.sale}>
        <div className={styles.sales}>
          <h2 className={styles.sales_title}>Sales</h2>
          <Link to="/products/all" className={styles.view_allSales}>All sales</Link>
        </div>

        <div className={styles.sale_products}>
          {topDiscountProducts.length === 0 && <p>No discounted products available</p>}

          {topDiscountProducts.map(product => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className={styles.sale_product_card}
            >
              <img src={`${API_URL}${product.image}`} alt={product.title} />
              <div className={styles.sale_product_info}>
                <h3>{product.title}</h3>
                <p>
                  <span className={styles.newPrice}>${product.discont_price}</span>
                  <span className={styles.oldPrice}>${product.price}</span>{" "}
                </p>
                <p className={styles.discountPercent}>-{product.discountPercent}%</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
