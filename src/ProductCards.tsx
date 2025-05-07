import {useState} from "react";

import {ProductCard} from "./ProductCard.tsx";

import {sampleProducts} from "./mocks/products.ts";
import type {ProductType} from "./App.tsx";

export const ProductCards = () => {
  const [products, setProducts] = useState<ProductType[]>(sampleProducts);

  const [gone] = useState<Set<number>>(() => new Set());
  const [lastAction, setLastAction] = useState<{id: number, action: string} | null>(null);

  const handleSwipe = (id: number, direction: 'left' | 'right') => {
    const action = direction === 'right' ? 'liked' : 'disliked';
    setLastAction({id, action});
    setProducts(products.filter(product => product.id !== id));

    console.log(`${action} product ${id}`);
  };

  const restart = () => {
    setProducts(sampleProducts);
    setLastAction(null);
  };

  return (
    <>

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

      {lastAction && (
        <div className={`action-feedback ${lastAction.action}`}  onAnimationEnd={() => setLastAction(null)}>
          {lastAction.action === 'liked' ? '✓ Liked' : '✗ Passed'}
        </div>
      )}
    </>
  )
}