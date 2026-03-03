import { useState } from 'react';

/**
 * Reusable row-selection hook for admin tables.
 *
 * @param {string} idKey  – field name used as unique key (default: 'id')
 * @returns {{ selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection, setSelectedIds }}
 */
const useRowSelection = (idKeyOrResolver = 'id') => {
    const [selectedIds, setSelectedIds] = useState([]);

    const getId = (item) => {
        if (typeof idKeyOrResolver === 'function') {
            return idKeyOrResolver(item);
        }
        return item[idKeyOrResolver];
    };

    const toggleAll = (items) => {
        const ids = items.map(getId);
        if (ids.length > 0 && ids.every(id => selectedIds.includes(id)))
            setSelectedIds([]);
        else
            setSelectedIds(ids);
    };

    const toggleOne = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const isAllSelected = (items) =>
        items.length > 0 && items.every(i => selectedIds.includes(getId(i)));

    const clearSelection = () => setSelectedIds([]);

    return { selectedIds, toggleAll, toggleOne, isAllSelected, clearSelection, setSelectedIds, getId };
};

export default useRowSelection;
