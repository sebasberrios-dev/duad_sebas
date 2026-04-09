import styles from './PurchaseSummary.module.css';
import shared from '../shared.module.css';
import { calculateItemPrice } from '../../utils/helpers.js';

const TableHead = ({ columns }) => {
  return (
    <thead className={styles.tableHead}>
      <tr className={styles.headerRow}>
        {columns.map((column) => (
          <th
            key={column.key}
            className={styles.headerCell}
            style={{ textAlign: column.align }}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const TableBody = ({ data, columns }) => {
  return (
    <tbody>
      {data.map((row) => (
        <tr key={row.id ?? row.product_id} className={styles.bodyRow}>
          {columns.map((column) => (
            <td
              key={column.key}
              className={`${styles.bodyCell} ${column.align === 'right' ? styles.alignRight : styles.alignLeft}`}
            >
              {column.render ? column.render(row) : row[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default function PurchaseSummary({ items, total }) {
  const columns = [
    { key: 'name', label: 'Producto', align: 'left' },
    { key: 'quantity', label: 'Cantidad', align: 'right' },
    {
      key: 'price',
      label: 'Precio Unitario',
      align: 'right',
      render: (row) => `₡${row.price}`,
    },
    {
      key: 'subtotal',
      label: 'Subtotal',
      align: 'right',
      render: (row) => `₡${calculateItemPrice(row)}`,
    },
  ];

  return (
    <div className={styles.purchaseSummary}>
      <h2 className={shared.title}>Resumen de la compra</h2>
      <table className={styles.summaryTable}>
        <TableHead columns={columns} />
        <TableBody data={items} columns={columns} />
      </table>
      <div className={styles.total}>
        <p className={styles.totalLabel}>Total:</p>
        <p className={styles.totalAmount}>₡{total}</p>
      </div>
    </div>
  );
}
