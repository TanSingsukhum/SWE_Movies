// LandingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div>
      <h1>WELCOME TO MoVie.Boring</h1>
      <Link to="/movies">Find Movies</Link>
    </div>
  );
};

export default LandingPage;