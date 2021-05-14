import React, { FC } from 'react';
import Header from './Header';
import MainSection from './MainSection';
import 'todomvc-app-css/index.css';

const App: FC = () => {
  return (
    <div>
      <Header />
      <MainSection />
    </div>
  );
};

export default App;
