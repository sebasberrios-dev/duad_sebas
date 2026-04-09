const isValidNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value);

export const calculateItemPrice = (item) => {
  if (!item || typeof item !== 'object') {
    throw new Error('El item debe ser un objeto válido');
  }

  if (!isValidNumber(item.price) || !isValidNumber(item.quantity)) {
    throw new Error('El precio y la cantidad deben ser números válidos');
  }

  if (item.price < 0 || item.quantity < 0) {
    throw new Error('Los números deben ser positivos');
  }

  return item.price * item.quantity;
};

export const calculateSubTotal = (items) => {
  if (!Array.isArray(items)) {
    throw new Error('items debe ser un arreglo');
  }

  return items.reduce((sum, item) => {
    return sum + calculateItemPrice(item);
  }, 0);
};

export const calculateTotal = (items, tax, discount) => {
  const subtotal = calculateSubTotal(items);

  const totalPrice = subtotal + subtotal * tax - subtotal * discount;

  return totalPrice;
};
