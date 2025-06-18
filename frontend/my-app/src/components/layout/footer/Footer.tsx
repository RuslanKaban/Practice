import React from "react";
import styles from "./Footer.module.css";
import { Inst } from '../../../assets/icons/inst';
import { Whatsapp } from '../../../assets/icons/whatsapp';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <h2 className={styles.footer__mainTitle}>Contact</h2>
      <div className={styles.footer__columns}>
        <div className={styles.footer__column}>
          <section className={styles.footer__section}>
            <h3 className={styles.footer__sectionTitle}>Phone</h3>
            <ul className={styles.footer__list}>
              <li className={styles.footer__item}>
                <a href="tel:+74993506604" className={styles.footer__link}>
                  +7 (499) 350-66-04
                </a>
              </li>
            </ul>
          </section>

          <section className={styles.footer__section}>
            <h3 className={styles.footer__sectionTitle}>Address</h3>
            <address className={styles.footer__text}>
              Dubininskaya Ulitsa, 96, Moscow, Russia, 115093
            </address>
          </section>
        </div>


        <div className={styles.footer__column}>
          <section className={styles.footer__section}>
            <h3 className={styles.footer__sectionTitle}>Socials</h3>
            <div className={styles.footer__socials}>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.footer__socialLink} aria-label="Instagram">
                <Inst className={styles.footer__icon} />
              </a>
              <a href="https://wa.me/74993506604" target="_blank" rel="noopener noreferrer" className={styles.footer__socialLink} aria-label="Whatsapp">
                <Whatsapp className={styles.footer__icon} />
              </a>
            </div>
          </section>

          <section className={styles.footer__section}>
            <h3 className={styles.footer__sectionTitle}>Working Hours</h3>
            <p className={styles.footer__text}>24 hours a day</p>
          </section>

        </div>
      </div>


      <div className={styles.footer__mapWrapper}>
        <img
          src="/map.png"
          alt="Руки с предметами"
          className={styles.map}
        />
      </div>

    </footer>
  );
};

export default Footer;
