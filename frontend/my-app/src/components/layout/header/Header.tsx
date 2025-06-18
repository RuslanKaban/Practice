import React from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { Cart } from "../../../assets/icons/cart";
import { Logo } from "../../../assets/icons/logo";
import { useCart } from "../../../context/CartContext";

const Header: React.FC = () => {
  const menuItems = [
    { label: "Main Page", href: "/" },
    { label: "Categories", href: "/categories" },
    { label: "All Products", href: "/products" },
    { label: "Sales", href: "/sales" },
  ];

  const { totalCount } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logoLink}>
          <Logo className={styles.logo} aria-label="Company logo" />
        </Link>

        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.label} className={styles.menuItem}>
                <Link to={item.href} className={styles.menuLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.cartWrapper}>
          <Link to="/cart" className={styles.cartLink} aria-label="Shopping cart">
            <Cart className={styles.cartIcon} />
            {totalCount > 0 && <span className={styles.cartCounter}>{totalCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
