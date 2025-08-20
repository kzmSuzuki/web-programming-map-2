import React, { useEffect } from "react";
import { auth, provider } from "../firebase/firebase";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";

interface LoginProps {
  onLogin: (userEmail: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  // 既にログインしているユーザーがいれば onLogin を呼び出す
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        onLogin(user.email);
      }
    });
    return unsubscribe;
  }, [onLogin]);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email) {
        onLogin(email);
      }
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <p
        style={{
          fontSize: "3.4rem",
          fontWeight: "bold",
          margin: "0",
          padding: "0",
          textAlign: "center",
        }}
      >
        Web Programming I Skill Map
      </p>
      <p
        style={{
          fontSize: "0.9rem",
          margin: "0",
          padding: "0",
          textAlign: "center",
          display: "flex",
          alignItems: "baseline", // ベースラインを揃える
          justifyContent: "center" /* 中央揃え */,
          gap: "0.3em",
        }}
      >
        Chapter 2:{" "}
        <span
          style={{
            fontSize: "1.7rem",
            fontWeight: "200",
            paddingBottom: "20px",
          }}
        >
          BACKEND
        </span>
      </p>
      <img
        src="web_dark_rd_ctn@4x.png"
        style={{ height: "40px", marginTop: "20px", paddingBottom: "100px" }}
        alt="Continue with Google"
        onClick={signInWithGoogle}
      />
    </div>
  );
};

export default Login;
