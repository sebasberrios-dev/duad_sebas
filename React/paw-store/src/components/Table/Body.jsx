import styles from './Table.module.css';

const normalizeColumnKey = (column) =>
  column
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const columnKeyMap = {
  nombre: 'name',
  precio: 'price',
  categoria: 'category',
};

const resolveKey = (columnKey) => columnKeyMap[columnKey] ?? columnKey;

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

export function TableBody({ data, columns, onEdit, onDelete }) {
  const dataArray = Array.isArray(data) ? data : [];
  return (
    <tbody>
      {dataArray.length === 0 && (
        <tr>
          <td colSpan={columns.length} className={styles.noData}>
            No hay productos disponibles
          </td>
        </tr>
      )}
      {dataArray.map((row) => {
        return (
          <tr key={row.id} className={styles.bodyRow}>
            {columns.map((column) => {
              const columnKey = normalizeColumnKey(column);

              if (columnKey === 'id') {
                return (
                  <td key={column} className={styles.bodyCell}>
                    {formatId(row[resolveKey(columnKey)])}
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
                    {formatCurrency(row[resolveKey(columnKey)])}
                  </td>
                );
              }

              if (columnKey === 'categoria') {
                return (
                  <td key={column} className={styles.bodyCell}>
                    <span className={styles.categoryBadge}>
                      {row[resolveKey(columnKey)]}
                    </span>
                  </td>
                );
              }

              return (
                <td key={column} className={styles.bodyCell}>
                  {row[resolveKey(columnKey)]}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
