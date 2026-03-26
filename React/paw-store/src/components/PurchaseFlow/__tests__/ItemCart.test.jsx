import { render, screen } from '@testing-library/react';
import { vi, expect, describe, beforeEach, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { ItemCart, QuantityControl } from '../ItemCart';

const sampleItem = {
  name: 'Test Product',
  image_url: '/test/test.jpg',
  price: 32000,
  quantity: 2,
};

describe('QuantityControl', () => {
  let user;
  let mockIncrease;
  let mockDecrease;

  beforeEach(() => {
    mockIncrease = vi.fn();
    mockDecrease = vi.fn();
    user = userEvent.setup();
  });

  it('renders quantity value and both buttons', () => {
    render(
      <QuantityControl
        quantity={5}
        onIncrease={mockIncrease}
        onDecrease={mockDecrease}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Aumentar cantidad/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Disminuir cantidad/i })
    ).toBeInTheDocument();
  });

  it('calls onIncrease when clicking increase button', async () => {
    render(
      <QuantityControl
        quantity={2}
        onIncrease={mockIncrease}
        onDecrease={mockDecrease}
      />
    );

    await user.click(
      screen.getByRole('button', { name: /Aumentar cantidad/i })
    );

    expect(mockIncrease).toHaveBeenCalledTimes(1);
  });

  it('calls onDecrease when clicking decrease button', async () => {
    render(
      <QuantityControl
        quantity={2}
        onIncrease={mockIncrease}
        onDecrease={mockDecrease}
      />
    );

    await user.click(
      screen.getByRole('button', { name: /Disminuir cantidad/i })
    );

    expect(mockDecrease).toHaveBeenCalledTimes(1);
  });

  it('disables decrease button when quantity is 1', async () => {
    render(
      <QuantityControl
        quantity={1}
        onIncrease={mockIncrease}
        onDecrease={mockDecrease}
      />
    );

    const decreaseBtn = screen.getByRole('button', {
      name: /Disminuir cantidad/i,
    });

    expect(decreaseBtn).toBeDisabled();
    await user.click(decreaseBtn);
    expect(mockDecrease).not.toHaveBeenCalled();
  });
});

describe('ItemCart', () => {
  let user;
  let mockIncrease;
  let mockDecrease;
  let mockRemove;

  beforeEach(() => {
    mockIncrease = vi.fn();
    mockDecrease = vi.fn();
    mockRemove = vi.fn();
    user = userEvent.setup();
  });

  const renderItemCart = (overrides = {}) =>
    render(
      <ItemCart
        item={overrides.item ?? sampleItem}
        onIncrease={overrides.onIncrease ?? mockIncrease}
        onDecrease={overrides.onDecrease ?? mockDecrease}
        onRemove={overrides.onRemove ?? mockRemove}
        isRemoving={overrides.isRemoving ?? false}
      />
    );

  it('renders item data (image, name, price, subtotal)', () => {
    renderItemCart();

    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Precio: ₡32000')).toBeInTheDocument();
    expect(screen.getByText('Subtotal: ₡64000')).toBeInTheDocument();
  });

  it('renders remove button', () => {
    renderItemCart();

    expect(
      screen.getByRole('button', { name: /Eliminar del carrito/i })
    ).toBeInTheDocument();
  });

  it('calls onRemove when clicking remove button', async () => {
    renderItemCart();

    await user.click(
      screen.getByRole('button', { name: /Eliminar del carrito/i })
    );

    expect(mockRemove).toHaveBeenCalledTimes(1);
  });

  it('disables remove button when isRemoving is true', async () => {
    renderItemCart({ isRemoving: true });

    const removeBtn = screen.getByRole('button', {
      name: /Eliminar del carrito/i,
    });

    expect(removeBtn).toBeDisabled();
    await user.click(removeBtn);
    expect(mockRemove).not.toHaveBeenCalled();
  });
});

describe('ItemCart integration (stateful)', () => {
  let user;
  let mockRemove;

  beforeEach(() => {
    mockRemove = vi.fn();
    user = userEvent.setup();
  });

  function ItemCartWithState() {
    const [currentItem, setCurrentItem] = useState({
      name: 'Test Product',
      image_url: '/test/test.jpg',
      price: 32000,
      quantity: 2,
    });

    return (
      <ItemCart
        item={currentItem}
        onIncrease={() =>
          setCurrentItem((prev) => ({
            ...prev,
            quantity: prev.quantity + 1,
          }))
        }
        onDecrease={() =>
          setCurrentItem((prev) => ({
            ...prev,
            quantity: Math.max(1, prev.quantity - 1),
          }))
        }
        onRemove={mockRemove}
        isRemoving={false}
      />
    );
  }

  it('updates subtotal when increasing and decreasing quantity', async () => {
    render(<ItemCartWithState />);

    expect(screen.getByText('Subtotal: ₡64000')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Disminuir cantidad/i })
    );
    expect(screen.getByText('Subtotal: ₡32000')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Aumentar cantidad/i })
    );
    expect(screen.getByText('Subtotal: ₡64000')).toBeInTheDocument();
  });

  it('does not decrease quantity below 1', async () => {
    render(<ItemCartWithState />);

    await user.click(
      screen.getByRole('button', { name: /Disminuir cantidad/i })
    );
    expect(screen.getByText('Subtotal: ₡32000')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /Disminuir cantidad/i })
    );
    expect(screen.getByText('Subtotal: ₡32000')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Disminuir cantidad/i })
    ).toBeDisabled();
  });
});
