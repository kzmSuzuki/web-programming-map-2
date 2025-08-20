// src/App.tsx
import React, { useState } from "react";
import Login from "./components/Login";
import Container from "./components/Container";

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showContainer, setShowContainer] = useState(false);

  return (
    <div>
      <h3>
        Web Programming I Skill Map
        <span style={{ fontWeight: 200 }}> #2 BACKEND</span>
      </h3>

      {userEmail ? (
        <Container
          userEmail={userEmail}
          onScrollComplete={() => setShowContainer(true)}
          visible={showContainer}
        />
      ) : (
        <Login onLogin={(email) => setUserEmail(email)} />
      )}
    </div>
  );
};

export default App;
