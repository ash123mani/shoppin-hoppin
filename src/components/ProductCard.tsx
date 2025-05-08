import React from "react";
import { to, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import type { Product, SwipeDirection } from "../types";
import AnimatedDiv from "./AnimatedDiv.tsx";

import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onSwipe: (id: Product['id'], direction: SwipeDirection) => void;
  gone: Set<Product['id']>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSwipe, gone }) => {
  const [props, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    config: { tension: 200, friction: 40 }
  }));

  const handleSwipe = (direction: SwipeDirection) => {
    const throwDistance = 500;
    let animationProps = {};

    if (direction === 'up') {
      animationProps = {
        y: -window.innerHeight - throwDistance,
        rotate: -5,
      };
    } else {
      const dir = direction === 'right' ? 1 : -1;
      animationProps = {
        x: (window.innerWidth + throwDistance) * dir,
        rotate: dir * 15,
      };
    }

    gone.add(product.id);
    api.start({
      ...animationProps,
      scale: 0.8,
      opacity: 0,
      config: { tension: 200, friction: 30 },
      onRest: () => onSwipe(product.id, direction)
    });
  };

  const bind = useDrag(({ active, movement: [mx, my], direction: [xDir, yDir], velocity: [vx, vy] }) => {
    const xMovement = Math.abs(mx) / window.innerWidth;
    const yMovement = Math.abs(my) / window.innerHeight;

    // Trigger swipe when released with enough velocity or distance
    if (!active) {
      const isVerticalSwipe = yMovement > 0.15 && vy > 0.3 && yDir < 0;
      const isHorizontalSwipe = xMovement > 0.2 && vx > 0.3;

      if (isVerticalSwipe) {
        handleSwipe('up');
      } else if (isHorizontalSwipe) {
        handleSwipe(xDir > 0 ? 'right' : 'left');
      } else {
        // Return to center if not swiped
        api.start({
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          config: { tension: 600, friction: 30 }
        });
      }
      return;
    }

    // Follow finger during drag
    api.start({
      x: mx,
      y: my,
      scale: 1.05,
      rotate: mx / 25,
      immediate: true,
      config: { tension: 800, friction: 50 }
    });
  });

  return (
    <AnimatedDiv
      {...bind()}
      style={{
        x: props.x,
        y: props.y,
        scale: props.scale,
        rotate: props.rotate,
        opacity: props.opacity,
        backgroundImage: `url(${product.imageUrl})`,
        transform: to([props.x, props.y, props.rotate], (x, y, r) =>
          `translate3d(${x}px, ${y}px, 0) rotate(${r}deg)`
        )
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
        style={{ opacity: props.x.to(x => (x > 0 ? Math.min(x / 100, 1) : 0)) }}
      >
          LIKE
      </AnimatedDiv>
      <AnimatedDiv
        className="indicator nope-indicator"
        style={{ opacity: props.x.to(x => (x < 0 ? Math.min(-x / 100, 1) : 0)) }}
      >
          PASS
      </AnimatedDiv>
      <AnimatedDiv
        className="indicator cart-indicator"
        style={{ opacity: props.y.to(y => (y < 0 ? Math.min(-y / 50, 1) : 0)) }}
      >
          ADD TO CART
      </AnimatedDiv>

      <div className="product-actions">
        <button
          className="nope"
          onClick={() => handleSwipe('left')}
        >
          ✖
        </button>
        <button
          className="cart"
          onClick={() => handleSwipe('up')}
        >
            🛒
        </button>
        <button
          className="like"
          onClick={() => handleSwipe('right')}
        >
            ✔
        </button>
      </div>
    </AnimatedDiv>
  );
};

export default ProductCard;