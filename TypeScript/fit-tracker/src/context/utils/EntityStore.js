export class EntityStore {
    items = [];
    add(entity) {
        this.items.push(entity);
    }
    getAll() {
        return [...this.items];
    }
    findById(id) {
        return this.items.find((item) => item.id === id);
    }
    deleteById(id) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index === -1)
            return false;
        this.items.splice(index, 1);
        return true;
    }
    replace(entity) {
        const index = this.items.findIndex((item) => item.id === entity.id);
        if (index === -1)
            return false;
        this.items[index] = { ...entity };
        return true;
    }
    update(id, partial) {
        const item = this.items.find((item) => item.id === id);
        if (!item)
            return undefined;
        Object.assign(item, partial);
        return { ...item };
    }
    findBy(predicate) {
        return this.items.filter(predicate);
    }
}
