export class EntityStore<T extends { id: number }> {
  private items: T[] = [];

  add(entity: T): void {
    this.items.push(entity);
  }

  getAll(): T[] {
    return [...this.items];
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  deleteById(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }

  update(id: number, partial: Partial<Omit<T, "id">>): T | undefined {
    const item = this.items.find((item) => item.id === id);
    if (!item) return undefined;
    Object.assign(item, partial);
    return { ...item };
  }

  findBy(predicate: (entity: T) => boolean): T[] {
    return this.items.filter(predicate);
  }
}
