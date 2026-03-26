import { vi, describe, beforeEach, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import Administration from '../Administration';
import { useProductsStore } from '../../store/useProductsStore';

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('sweetalert2', () => ({
  __esModule: true,
  default: {
    fire: vi.fn(() => Promise.resolve()),
  },
}));

const sampleProducts = [
  {
    id: 1,
    name: 'Collar Premium',
    price: 15000,
    category: 'Accesorios',
    stock: 10,
    description: 'Collar para mascotas',
    image_url: '/img/collar.jpg',
  },
  {
    id: 2,
    name: 'Alimento Natural',
    price: 25000,
    category: 'Alimentación',
    stock: 50,
    description: 'Alimento premium',
    image_url: '/img/alimento.jpg',
  },
];

describe('Administration', () => {
  let user;
  let mockFetchProducts;
  let mockDeleteProduct;
  let mockUpdateProduct;
  let mockAddProduct;

  const defaultState = () => ({
    products: sampleProducts,
    mostPurchasedProducts: [],
    loading: {
      fetchingProducts: false,
      fetchingMostPurchased: false,
      addingProduct: false,
      updatingProduct: false,
      deletingProduct: false,
    },
    error: {
      screen: null,
      action: null,
    },
    fetchProducts: mockFetchProducts,
    deleteProduct: mockDeleteProduct,
    updateProduct: mockUpdateProduct,
    addProduct: mockAddProduct,
    fetchMostPurchased: vi.fn(),
  });

  const renderAdmin = (route = '/admin/products') =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/admin/products" element={<Administration />} />
          <Route path="/admin/products/edit/:id" element={<Administration />} />
        </Routes>
      </MemoryRouter>
    );

  beforeEach(() => {
    mockFetchProducts = vi.fn();
    mockDeleteProduct = vi.fn();
    mockUpdateProduct = vi.fn();
    mockAddProduct = vi.fn();
    mockNavigate.mockReset();
    user = userEvent.setup();
  });

  it('renders administration page layout', () => {
    useProductsStore.setState(defaultState());
    renderAdmin();

    expect(screen.getByText('Administración de Productos')).toBeInTheDocument();
  });

  it('renders table headers', () => {
    useProductsStore.setState(defaultState());
    renderAdmin();

    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('NOMBRE')).toBeInTheDocument();
    expect(screen.getByText('PRECIO')).toBeInTheDocument();
    expect(screen.getByText('CATEGORÍA')).toBeInTheDocument();
    expect(screen.getByText('STOCK')).toBeInTheDocument();
    expect(screen.getByText('ACCIONES')).toBeInTheDocument();
  });

  it('renders product rows in the table', () => {
    useProductsStore.setState(defaultState());
    renderAdmin();

    expect(screen.getByText('PAW001')).toBeInTheDocument();
    expect(screen.getByText('Collar Premium')).toBeInTheDocument();
    expect(screen.getByText('Accesorios')).toBeInTheDocument();

    expect(screen.getByText('PAW002')).toBeInTheDocument();
    expect(screen.getByText('Alimento Natural')).toBeInTheDocument();
    expect(screen.getByText('Alimentación')).toBeInTheDocument();
  });

  it('renders edit and delete buttons for each product', () => {
    useProductsStore.setState(defaultState());
    renderAdmin();

    const editButtons = screen.getAllByRole('button', { name: /Editar/i });
    const deleteButtons = screen.getAllByRole('button', { name: /Eliminar/i });

    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('shows loading message when loading', () => {
    useProductsStore.setState({
      ...defaultState(),
      loading: {
        fetchingProducts: true,
      },
    });
    renderAdmin();

    expect(screen.getByText('Cargando productos...')).toBeInTheDocument();
  });

  it('shows error message when there is an screen error', () => {
    useProductsStore.setState({
      ...defaultState(),
      error: {
        screen: 'Error de servidor',
      },
    });
    renderAdmin();

    expect(screen.getByText('¡Ups algo salió mal!')).toBeInTheDocument();
  });

  it('shows "No hay productos" when products array is empty', () => {
    useProductsStore.setState({
      ...defaultState(),
      products: [],
    });
    renderAdmin();

    expect(
      screen.getByText('No hay productos disponibles')
    ).toBeInTheDocument();
  });

  it('calls fetchProducts on mount if products array is empty', () => {
    useProductsStore.setState({
      ...defaultState(),
      products: [],
    });
    renderAdmin();

    expect(mockFetchProducts).toHaveBeenCalledTimes(1);
  });

  it('does not call fetchProducts if products already loaded', () => {
    useProductsStore.setState(defaultState());
    renderAdmin();

    expect(mockFetchProducts).not.toHaveBeenCalled();
  });

  it('renders add product form when no id param', () => {
    useProductsStore.setState(defaultState());
    renderAdmin();

    expect(screen.getByText('Agregar nuevo producto')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Agregar Producto/i })
    ).toBeInTheDocument();
  });

  it('renders edit product form when id param is present', () => {
    useProductsStore.setState(defaultState());
    renderAdmin('/admin/products/edit/1');

    expect(screen.getByText('Editar producto')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Guardar cambios/i })
    ).toBeInTheDocument();
  });

  it('calls deleteProduct when clicking "Eliminar"', async () => {
    useProductsStore.setState(defaultState());
    renderAdmin();

    const deleteButtons = screen.getAllByRole('button', { name: /Eliminar/i });
    await user.click(deleteButtons[0]);

    expect(mockDeleteProduct).toHaveBeenCalledWith(1);
  });

  it('navigates to edit route when clicking "Editar"', async () => {
    useProductsStore.setState(defaultState());
    renderAdmin();

    const editButtons = screen.getAllByRole('button', { name: /Editar/i });
    await user.click(editButtons[0]);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/products/edit/1');
  });
});
