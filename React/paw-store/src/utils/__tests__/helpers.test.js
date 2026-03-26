import { describe, it, expect } from 'vitest';
import {
  calculateItemPrice,
  calculateSubTotal,
  calculateTotal,
} from '../helpers';

describe('helpers', () => {
  describe('calculateItemPrice', () => {
    it('returns price * quantity for valid input', () => {
      const item = { price: 10000, quantity: 4 };
      expect(calculateItemPrice(item)).toBe(40000);
    });

    it('returns 0 if quantity is zero', () => {
      const item = { price: 10000, quantity: 0 };
      expect(calculateItemPrice(item)).toBe(0);
    });

    it('throws if item is not an object', () => {
      expect(() => calculateItemPrice(5)).toThrow(
        'El item debe ser un objeto válido'
      );
    });

    it('throws if price or quantity are not numbers', () => {
      const item = { price: 'hello', quantity: 'world' };
      expect(() => calculateItemPrice(item)).toThrow(
        'El precio y la cantidad deben ser números válidos'
      );
    });

    it('throws if price or quantity are negative', () => {
      const item = { price: 10000, quantity: -4 };
      expect(() => calculateItemPrice(item)).toThrow(
        'Los números deben ser positivos'
      );
    });
  });

  describe('calculateSubTotal', () => {
    it('returns sum of all item subtotals', () => {
      const items = [
        {
          product_id: 1,
          name: 'tester 1',
          image_url: '/test/image.jpg',
          price: 10000,
          quantity: 3,
        },
        {
          product_id: 2,
          name: 'tester 2',
          image_url: '/test2/image2.jpg',
          price: 40000,
          quantity: 2,
        },
      ];
      expect(calculateSubTotal(items)).toBe(110000);
    });

    it('throws if items is not an array', () => {
      expect(() => calculateSubTotal({ price: 800, quantity: 9 })).toThrow(
        'items debe ser un arreglo'
      );
    });
  });

  describe('calculateTotal', () => {
    it('returns subtotal if tax and discount are zero', () => {
      const items = [
        {
          product_id: 1,
          name: 'tester 1',
          image_url: '/test/image.jpg',
          price: 10000,
          quantity: 3,
        },
        {
          product_id: 2,
          name: 'tester 2',
          image_url: '/test2/image2.jpg',
          price: 40000,
          quantity: 2,
        },
      ];
      expect(calculateTotal(items, 0, 0)).toBe(110000);
    });

    it('applies tax and discount correctly', () => {
      const items = [
        {
          product_id: 1,
          name: 'tester 1',
          image_url: '/test/image.jpg',
          price: 10000,
          quantity: 3,
        },
        {
          product_id: 2,
          name: 'tester 2',
          image_url: '/test2/image2.jpg',
          price: 40000,
          quantity: 2,
        },
      ];
      expect(calculateTotal(items, 0.13, 0.2)).toBe(102300);
    });

    it('throws if subtotal is not a valid number', () => {
      const items = [
        {
          product_id: 1,
          name: 'tester 1',
          image_url: '/test/image.jpg',
          price: 10000,
          quantity: 3,
        },
        {
          product_id: 2,
          name: 'tester 2',
          image_url: '/test2/image2.jpg',
          price: '40000',
          quantity: 2,
        },
      ];
      expect(() => calculateTotal(items, 0, 0)).toThrow(
        'El precio y la cantidad deben ser números válidos'
      );
    });
  });
});

describe('calculateSubtotal', () => {
  it('sum the subtotals of all items', () => {
    const items = [
      {
        product_id: 1,
        name: 'tester 1',
        image_url: '/test/image.jpg',
        price: 10000,
        quantity: 3,
      },
      {
        product_id: 2,
        name: 'tester 2',
        image_url: '/test2/image2.jpg',
        price: 40000,
        quantity: 2,
      },
    ];
    expect(calculateSubTotal(items)).toBe(110000);
  });

  it('throw error when items is not an array', () => {
    const items = { price: 800, quantity: 9 };

    expect(() => calculateSubTotal(items)).toThrow('items debe ser un arreglo');
  });
});

describe('calculateTotal', () => {
  it('calculate total based on subtotals of all items when tax and discount are zero', () => {
    const items = [
      {
        product_id: 1,
        name: 'tester 1',
        image_url: '/test/image.jpg',
        price: 10000,
        quantity: 3,
      },
      {
        product_id: 2,
        name: 'tester 2',
        image_url: '/test2/image2.jpg',
        price: 40000,
        quantity: 2,
      },
    ];
    const tax = 0;
    const discount = 0;

    const result = calculateTotal(items, tax, discount);

    expect(result).toBe(110000);
  });

  it('calculate total with 13% VAT and a 20% discount', () => {
    const items = [
      {
        product_id: 1,
        name: 'tester 1',
        image_url: '/test/image.jpg',
        price: 10000,
        quantity: 3,
      },
      {
        product_id: 2,
        name: 'tester 2',
        image_url: '/test2/image2.jpg',
        price: 40000,
        quantity: 2,
      },
    ];
    const tax = 0.13;
    const discount = 0.2;

    const result = calculateTotal(items, tax, discount);

    expect(result).toBe(102300);
  });

  it('catch error from "calculateSubtotal" when subtotal is not a valid number', () => {
    const items = [
      {
        product_id: 1,
        name: 'tester 1',
        image_url: '/test/image.jpg',
        price: 10000,
        quantity: 3,
      },
      {
        product_id: 2,
        name: 'tester 2',
        image_url: '/test2/image2.jpg',
        price: '40000',
        quantity: 2,
      },
    ];
    const tax = 0;
    const discount = 0;

    expect(() => calculateTotal(items, tax, discount)).toThrow(
      'El precio y la cantidad deben ser números válidos'
    );
  });
});
