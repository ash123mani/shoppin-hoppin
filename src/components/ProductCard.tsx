import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import type { IProduct } from "../types";

import './ProductCard.css';


const AnimatedDiv = animated('div');

interface ProductCardProps {
  product: IProduct;
  onSwipe: (id: number, direction: 'left' | 'right') => void;
  gone: Set<number>;
}

export const ProductCard = ({ product, onSwipe, gone }: ProductCardProps) => {
  const [props, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    config: { tension: 300, friction: 30 }
  }));

  const bind = useDrag(({ active, movement: [mx], direction: [xDir], velocity: [vx], cancel }) => {
    const xMovement = Math.abs(mx) / window.innerWidth;
    const triggerSwipe = !active && (xMovement > 0.3 || vx > 0.5);

    if (triggerSwipe) {
      const dir = xDir < 0 ? -1 : 1;
      const swipeDirection = dir === 1 ? 'right' : 'left';
      const throwDistance = 200 + Math.min(vx * 1000, 500);

      gone.add(product.id);
      api.start({
        x: (window.innerWidth + throwDistance) * dir,
        scale: 0.8,
        rotate: dir * 15,
        opacity: 0,
        config: { tension: 200, friction: 30 },
        onRest: () => onSwipe(product.id, swipeDirection)
      });
    } else {
      const scale = active ? 1.05 : 1;
      const rotate = active ? mx / 20 : 0;

      api.start({
        x: active ? mx : 0,
        y: 0,
        scale,
        rotate,
        config: { tension: 500, friction: 30 }
      });

      if (!active && Math.abs(mx) < 5) cancel();
    }
  });

  return (
    <AnimatedDiv
      {...bind()}
      style={{
        x: props.x,
        scale: props.scale,
        rotate: props.rotate,
        opacity: props.opacity,
        backgroundImage: `url(${product.imageUrl})`,
        transform: props.x.to(x => `translate3d(${x}px, 0, 0)`),
      }}
      className="product-card"
    >
      <div className="product-content">
        <div className="product-badge">{product.brand}</div>
        <div className="product-details">
          <h3>{product.name}</h3>
          <div className="price-container">
            <span className="current-price">₹{product.price.toLocaleString()}</span>
            {product.discountPercentage > 0 && (
              <>
                <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                <span className="discount">{product.discountPercentage}% OFF</span>
              </>
            )}
          </div>
        </div>
      </div>


      <AnimatedDiv
        className="indicator like-indicator"
        style={{
          opacity: props.x.to(x => (x > 0 ? x / 100 : 0))
        }}
      >
          LIKE      
      </AnimatedDiv>
      <AnimatedDiv
        className="indicator nope-indicator"
        style={{
          opacity: props.x.to(x => (x < 0 ? -x / 100 : 0))
        }}
      >
        PASS
      </AnimatedDiv>

      <div className="product-actions">
        <button
          className="nope"
          onClick={() => {
            gone.add(product.id);
            api.start({
              x: -500,
              scale: 0.8,
              rotate: -15,
              opacity: 0,
              onRest: () => onSwipe(product.id, 'left')
            });
          }}
        >
          ✖
        </button>
        <button
          className="like"
          onClick={() => {
            gone.add(product.id);
            api.start({
              x: 500,
              scale: 0.8,
              rotate: 15,
              opacity: 0,
              onRest: () => onSwipe(product.id, 'right')
            });
          }}
        >
          ✔
        </button>
      </div>
    </AnimatedDiv>
  );
};