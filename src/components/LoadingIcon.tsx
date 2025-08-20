import React, { useState, useEffect } from "react";
import styles from "./loading.module.css";

const LoadingIcon: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
        fontWeight: "200",
        fontSize: "20px",
      }}
    >
      <div className={styles.loadingIcon}></div>
      <p style={{ margin: "0 auto" }}>Loading...</p>
    </div>
  );
};
export default LoadingIcon;
