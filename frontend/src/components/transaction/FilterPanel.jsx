import React, {useState} from 'react';
import searchIcon from '../../assets/images/transaction_icon/search.svg'

const FilterPanel = () => {
    const [filters, setFilters] = useState({
        search: '',
        type: 'all',
        category: 'all',
        dateFrom: '',
        sortBy: 'date',
        order: 'desc'
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFilters(prev => ({...prev, [name]: value}));
    };

    const handleApply = () => {
        console.log("Применены фильтры: ", filters);
        // пока заглушка, потом напишу логику применения фильтров
    };

    const handleReset = () => {
        setFilters({
            search: '',
            type: 'all',
            category: 'all',
            dateFrom: '',
            sortBy: 'date',
            order: 'desc'
        });
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
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        className='filter-select'
                    >
                        <option value="all">Все категории</option>
                        <option value="food">Еда</option>
                        <option value="salary">Зарплата</option>
                        <option value="entertaiment">Развлечения</option>
                        <option value="transport">Транспорт</option>
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
                        name="order"
                        value={filters.order}
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