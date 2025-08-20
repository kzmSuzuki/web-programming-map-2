import React, { useState, useEffect } from "react";
import styles from "./mouse.module.css";

const MouseIcon: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const list = document.getElementById("infinite-list");
      if (!list) return;

      const currentScrollTop = list.scrollTop;

      // 上にスクロールしている場合（現在位置 < 前回位置）
      if (currentScrollTop < lastScrollTop && currentScrollTop > 0) {
        setIsVisible(false);
      }

      setLastScrollTop(currentScrollTop);
    };

    const list = document.getElementById("infinite-list");
    if (list) {
      list.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (list) {
        list.removeEventListener("scroll", handleScroll);
      }
    };
  }, [lastScrollTop]);

  return (
    <>
      <div
        className={styles.mouseIcon}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-out",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      ></div>
      <p
        className={styles.mouseText}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.5s ease-out",
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        SCROLL UP
      </p>
    </>
  );
};
export default MouseIcon;
