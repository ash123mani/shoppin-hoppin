import './App.css';

import {ProductCards} from "./ProductCards.tsx";

export interface ProductType {
  id: number;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  imageUrl: string;
}

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