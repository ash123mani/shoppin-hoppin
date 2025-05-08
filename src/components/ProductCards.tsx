import { useState } from "react";

import ProductCard from "./ProductCard.tsx";
import { sampleProducts } from "../mocks/products.ts";
import type { Product, SwipeDirection } from "../types";
import { logProduct } from "../utils";

import './ProductCards.css';


const ProductCards = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);

  const [gone] = useState<Set<Product['id']>>(() => new Set());

  const handleSwipe = (id: Product['id'], direction: SwipeDirection) => {
    logProduct(direction, id);
    setProducts(products.filter(product => product.id !== id));
  };

  const restart = () => {
    setProducts(sampleProducts);
  };

  return (
    <div className="card-container">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onSwipe={handleSwipe}
          gone={gone}
        />
      ))}
      {products.length === 0 && (
        <div className="empty-state">
          <p>No more products to show!</p>
          <button onClick={restart}>Restart</button>
        </div>
      )}
    </div>
  )
}

export default ProductCards;