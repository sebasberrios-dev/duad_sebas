import { render, screen } from '@testing-library/react';
import { expect, describe, it } from 'vitest';
import PurchaseSummary from '../PurchaseSummary';

const sampleItems = [
  {
    id: 1,
    name: 'Product 1',
    image_url: '/test/test.jpg',
    price: 12000,
    quantity: 2,
  },
  {
    id: 2,
    name: 'Product 2',
    image_url: '/test2/test2.jpg',
    price: 21000,
    quantity: 3,
  },
];

const sampleTotal = 87000;

const renderSummary = (items = sampleItems, total = sampleTotal) =>
  render(<PurchaseSummary items={items} total={total} />);

describe('PurchaseSummary', () => {
  it('renders title "Resumen de la compra"', () => {
    renderSummary();

    expect(screen.getByText('Resumen de la compra')).toBeInTheDocument();
  });

  it('renders all column headers', () => {
    renderSummary();

    expect(screen.getByText('Producto')).toBeInTheDocument();
    expect(screen.getByText('Cantidad')).toBeInTheDocument();
    expect(screen.getByText('Precio Unitario')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
  });

  it('renders product names', () => {
    renderSummary();

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
  });

  it('renders quantities', () => {
    renderSummary();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders unit prices with ₡ prefix', () => {
    renderSummary();

    expect(screen.getByText('₡12000')).toBeInTheDocument();
    expect(screen.getByText('₡21000')).toBeInTheDocument();
  });

  it('renders calculated subtotals per item', () => {
    renderSummary();

    expect(screen.getByText('₡24000')).toBeInTheDocument();
    expect(screen.getByText('₡63000')).toBeInTheDocument();
  });

  it('renders total label and total amount', () => {
    renderSummary();

    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('₡87000')).toBeInTheDocument();
  });
});
