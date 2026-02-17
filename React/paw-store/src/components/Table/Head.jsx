import styles from './Table.module.css';

export function TableHead({ columns }) {
  return (
    <thead className={styles.tableHead}>
      <tr className={styles.headerRow}>
        {columns.map((column) => (
          <th key={column} className={styles.headerCell}>
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}
