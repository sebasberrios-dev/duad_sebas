import { useForm } from 'react-hook-form';
import { Form, Title, Field, Button } from './FormsComponents.jsx';
import { usePurchaseStore } from '../../store/usePurchaseStore.jsx';
import { useNavigate } from 'react-router';
import {
  showAlertConfirm,
  showAlertError,
  showAlertLoading,
  showAlertSuccess,
  closeAlert,
} from '../Messages-States/Alerts.jsx';
import { calculateItemPrice, calculateSubTotal } from '../../utils/helpers.js';
import stylesForm from './Forms.module.css';
import stylesSummary from './OrderSummary.module.css';
import shared from '../shared.module.css';

function OrderSummary({ items }) {
  return (
    <div className={stylesSummary.orderSummary}>
      <h3 className={shared.title}>Resumen del pedido</h3>
      <ul className={stylesSummary.summaryList}>
        {items.map((item) => (
          <li className={stylesSummary.listItem} key={item.id}>
            <div className={stylesSummary.summaryItem}>
              <p className={stylesSummary.itemName}>{item.name}</p>
              <p className={stylesSummary.quantityPrice}>
                {item.quantity} x ₡{item.price}
              </p>
            </div>
            <p className={stylesSummary.itemSubtotal}>
              ₡{calculateItemPrice(item)}
            </p>
          </li>
        ))}
      </ul>
      <div className={stylesSummary.totalContainer}>
        <p className={stylesSummary.totalLabel}>Total:</p>
        <p className={stylesSummary.totalAmount}>₡{calculateSubTotal(items)}</p>
      </div>
    </div>
  );
}

export default function PurchaseInfoForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const isPurchasing = usePurchaseStore((state) => state.checkoutProccess);

  const cartItems = usePurchaseStore((state) => state.cart.items);
  const createCheckoutData = usePurchaseStore(
    (state) => state.createCheckoutData
  );
  const completePurchase = usePurchaseStore((state) => state.completePurchase);
  const confirmOrder = usePurchaseStore((state) => state.confirmOrder);
  const clearInfo = usePurchaseStore((state) => state.clearInfo);

  const isCreatingCheckoutData = usePurchaseStore(
    (state) => state.loading.creatingCheckoutData
  );
  const isCompletingPurchase = usePurchaseStore(
    (state) => state.loading.completingPurchase
  );
  const isConfirmingOrder = usePurchaseStore(
    (state) => state.loading.confirmingOrder
  );

  const navigate = useNavigate();

  const onCancel = async () => {
    const result = await showAlertConfirm(
      '¿Desea cancelar la compra?',
      'Se perderá la información del carrito'
    );

    if (!result.isConfirmed) return;

    showAlertLoading('Cancelando compra...');

    try {
      await clearInfo();
      await reset();
      closeAlert();
      showAlertSuccess('Compra cancelada', 'Se canceló la compra con éxito');
      navigate('/');
    } catch (e) {
      showAlertError(
        'Error',
        e.response?.data?.error ?? e.message ?? 'Error cancelando la compra'
      );
    }
  };
  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: data.name,
        email: data.email,
        address: data.address,
        phoneNumber: data.phoneNumber,
      };

      await createCheckoutData(payload);
      await completePurchase();
      await confirmOrder();

      navigate('/purchase-finished');
    } catch (e) {
      showAlertError(
        'Error',
        e.response?.data?.error ?? e.message ?? 'Error completando la compra'
      );
    }
  };
  const isProcessing =
    isCreatingCheckoutData || isCompletingPurchase || isConfirmingOrder;

  return !isPurchasing ? (
    navigate('/')
  ) : (
    <section className={shared.containerWide}>
      <div className={stylesForm.checkoutLayout}>
        <Form
          id="purchase-info-form"
          className={stylesForm.purchaseForm}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Title className={shared.title}>Información de compra</Title>

          <Field
            divClassName={stylesForm.field}
            labelClassName={stylesForm.label}
            inputClassName={stylesForm.input}
            inputErrorClassName={stylesForm.inputError}
            errorClassName={stylesForm.fieldError}
            type="text"
            id="name"
            placeholder="Introduce tu nombre completo"
            error={errors.name ? 'Nombre completo obligatorio' : ''}
            {...register('name', { required: true })}
          >
            Nombre completo
          </Field>

          <Field
            divClassName={stylesForm.field}
            labelClassName={stylesForm.label}
            inputClassName={stylesForm.input}
            inputErrorClassName={stylesForm.inputError}
            errorClassName={stylesForm.fieldError}
            type="email"
            id="email"
            placeholder="Introduce tu correo electrónico"
            error={errors.email ? 'Correo electrónico obligatorio' : ''}
            {...register('email', { required: true })}
          >
            Correo electrónico
          </Field>

          <Field
            divClassName={stylesForm.field}
            labelClassName={stylesForm.label}
            inputClassName={stylesForm.input}
            inputErrorClassName={stylesForm.inputError}
            errorClassName={stylesForm.fieldError}
            type="text"
            id="address"
            placeholder="Introduce tu dirección"
            error={errors.address ? 'Dirección obligatoria' : ''}
            {...register('address', { required: true })}
          >
            Dirección
          </Field>

          <Field
            divClassName={stylesForm.field}
            labelClassName={stylesForm.label}
            inputClassName={stylesForm.input}
            inputErrorClassName={stylesForm.inputError}
            errorClassName={stylesForm.fieldError}
            type="text"
            id="phone"
            placeholder="Introduce tu número de teléfono"
            error={errors.phoneNumber ? 'Número de teléfono obligatorio' : ''}
            {...register('phoneNumber', { required: true })}
          >
            Teléfono
          </Field>

          <p className={stylesForm.message}>
            Esta información se utilizará para completar la compra.
          </p>
        </Form>

        <div className={stylesForm.summaryCard}>
          <OrderSummary items={cartItems} />
          <div className={stylesForm.summaryActions}>
            <Button
              type="submit"
              form="purchase-info-form"
              disabled={isProcessing}
              className={`${shared.btn} ${shared.btnPrimary} ${shared.btnFull}`}
            >
              {isProcessing ? 'Procesando compra...' : 'Confirmar compra'}
            </Button>
            <Button
              type="button"
              className={`${shared.btn} ${shared.btnOutline} ${shared.btnFull}`}
              onClick={onCancel}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
