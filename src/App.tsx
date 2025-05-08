import './App.css';

import { ProductCards } from "./components/ProductCards.tsx";

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>ShopSwipe</h1>
        <p>Swipe right to like, left to pass</p>
      </header>
      <ProductCards />
    </div>
  );
};


export default App;