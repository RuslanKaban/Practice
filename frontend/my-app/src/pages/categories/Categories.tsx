import React, { useEffect, useState } from "react";
import { API_URL } from "../../store/store";
import styles from "./Categories.module.css";
import { Link } from "react-router-dom";


interface Category {
  id: number;
  title: string;
  image: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/categories/all`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при загрузке категорий");
        return res.json();
      })
      .then((data: Category[]) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Categories</h1>
      <div className={styles.list}>
        {categories.map((cat) => (
  <Link to={`/categories/${cat.id}`} className={styles.card} key={cat.id}>
    <img
      src={`${API_URL}${cat.image}`}
      alt={cat.title}
      className={styles.cardImage}
    />
    <p>{cat.title}</p>
  </Link>
))}

      </div>
    </div>
  );
};

export default Categories;
