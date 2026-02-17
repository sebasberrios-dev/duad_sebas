import styles from './Table.module.css';

const normalizeColumnKey = (column) =>
  column
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export function TableBody({ data, columns, onEdit, onDelete }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
    }).format(value ?? 0);

  const formatId = (value) => {
    if (typeof value === 'number') {
      return `PAW${String(value).padStart(3, '0')}`;
    }
    return value;
  };
  return (
    <tbody>
      {data.map((row, index) => {
        return (
          <tr key={index} className={styles.bodyRow}>
            {columns.map((column) => {
              const columnKey = normalizeColumnKey(column);

              if (columnKey === 'id') {
                return (
                  <td key={column} className={styles.bodyCell}>
                    {formatId(row[columnKey])}
                  </td>
                );
              }

              if (columnKey === 'acciones') {
                return (
                  <td key={column} className={styles.actionsCell}>
                    <div className={styles.tableActions}>
                      <button
                        type="button"
                        className={styles.editButton}
                        onClick={() => onEdit(row)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => onDelete(row)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                );
              }

              if (columnKey === 'precio') {
                return (
                  <td key={column} className={styles.bodyCell}>
                    {formatCurrency(row[columnKey])}
                  </td>
                );
              }

              if (columnKey === 'categoria') {
                return (
                  <td key={column} className={styles.bodyCell}>
                    <span className={styles.categoryBadge}>
                      {row[columnKey]}
                    </span>
                  </td>
                );
              }

              return (
                <td key={column} className={styles.bodyCell}>
                  {row[columnKey]}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
