import React, {useState, useEffect} from 'react';
import searchIcon from '../../assets/images/transaction_icon/search.svg'

const FilterPanel = ({onFilterChange}) => {

    const [categories, setCategories] = useState([]);

    const defaultFilters = {
        search: '',
        type: 'all',
        categoryId: 'all',
        dateFrom: '',
        dateTo: '',
        sortBy: 'date',
        sortOrder: 'desc'
    }

    const [filters, setFilters] = useState(defaultFilters);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch('http://localhost:3000/api/transactions/filters/categories', {
                    headers: {
                        'Authorization' : `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories || []);
                }
            } catch (err) {
                console.error('Ошибка загрузки категорий: ', err);
            }
        };

        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    const handleApply = () => {
        if (onFilterChange) {
            const cleanFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value && value !== 'all')
            );
            onFilterChange(cleanFilters);
        }
    };

    const handleReset = () => {
        setFilters({
            search: '',
            type: 'all',
            categoryId: 'all',
            dateFrom: '',
            dateTo: '',
            sortBy: 'date',
            sortOrder: 'desc'
        });
        setFilters(defaultFilters);
        if (onFilterChange) {
            onFilterChange({});
        }
    };

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <img src={searchIcon} alt="search" className='btn-icon'/>
                Фильтры и поиск
            </div>

            <div className="filter-grid">
                <div className="filter-group">
                    <label className="filter-label">Поиск</label>
                    <input 
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Описание или категория..."
                        className='filter-input' 
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">Тип</label>
                    <select 
                        name="type"
                        value={filters.type}
                        onChange={handleChange}
                        className='filter-select'
                    >
                        <option value="all">Все</option>
                        <option value="income">Доходы</option>
                        <option value="expense">Расходы</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Категория</label>
                    <select 
                        name="categoryId"
                        value={filters.categoryId}
                        onChange={handleChange}
                        className='filter-select'
                    >
                        <option value="all">Все категории</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">От</label>
                    <input 
                        type="date"
                        name="dateFrom"
                        value={filters.dateFrom}
                        onChange={handleChange}
                        className='filter-input' 
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">До</label>
                    <input 
                        type="date"
                        name="dateTo"
                        value={filters.dateTo}
                        onChange={handleChange}
                        className='filter-input' 
                    />
                </div>

                <div className="filter-group">
                    <label className="filter-label">Сортировка</label>
                    <select 
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleChange}
                        className='filter-select'
                    >
                        <option value="date">По дате</option>
                        <option value="amount">По сумме</option>
                        <option value="category">По категории</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label className="filter-label">Порядок</label>
                    <select 
                        name="sortOrder"
                        value={filters.sortOrder}
                        onChange={handleChange}
                        className='filter-select'
                    >
                        <option value="asc">По возрастанию</option>
                        <option value="desc">По убыванию</option>
                    </select>
                </div>
            </div>

            <div className="filter-actions">
                <button className="btn-primary-filter" onClick={handleApply}>Применить фильтры</button>
                <button className="btn-secondary-filter" onClick={handleReset}>Сбросить фильтры</button>
            </div>
        </div>
    );
};

export default FilterPanel;