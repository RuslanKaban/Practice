import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFound.module.css";
import cactus from "../../../public/cactus.png"

const NotFound: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.code}>
        <h1 className={styles.four}>4</h1>
        <img src={cactus} alt="Cactus" className={styles.image} />
        <h1 className={styles.four}>4</h1>
      </div>
      <h1 className={styles.title}>Page Not Found</h1>
      <p className={styles.subtitle}>
        We’re sorry, the page you requested could not be found.<br />
        Please go back to the homepage.
      </p>
      <Link to="/" className={styles.button}>Go Home</Link>
    </div>
  );
};

export default NotFound;
