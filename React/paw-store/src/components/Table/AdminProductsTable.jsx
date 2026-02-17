import styles from './Table.module.css';
import { TableHead } from './Head.jsx';
import { TableBody } from './Body.jsx';

export function AdminProductsTable({
  data,
  columns,
  onEdit,
  onDelete,
  title,
  description,
}) {
  return (
    <div className={styles.tableCard}>
      {(title || description) && (
        <div className={styles.cardHeader}>
          {title && <h1 className={styles.cardTitle}>{title}</h1>}
          {description && (
            <p className={styles.cardDescription}>{description}</p>
          )}
        </div>
      )}
      <table className={styles.table}>
        <TableHead columns={columns}></TableHead>
        <TableBody
          data={data}
          columns={columns}
          onEdit={onEdit}
          onDelete={onDelete}
        ></TableBody>
      </table>
    </div>
  );
}
