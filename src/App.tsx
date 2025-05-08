import ProductCards from "./components/ProductCards.tsx";

import './App.css';

const App = () => {
  return (
    <div className="app">
      <header>
        <h1>ShopSwipe</h1>
        <p>Swipe right to like, left to pass, up to add to cart</p>
      </header>
      <ProductCards />
    </div>
  );
};



export default App;