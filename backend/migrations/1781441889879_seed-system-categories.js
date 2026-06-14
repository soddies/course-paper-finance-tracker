exports.up = (pgm) => {
    pgm.sql(`
        insert into categories (name, type, icon, is_system) values
        ('Зарплата', 'income', 'salary', true),
        ('Фриланс', 'income', 'freelance', true),
        ('Подработка', 'income', 'part-time-job', true),
        ('Премия', 'income', 'premium', true),
        ('Социальные выплаты', 'income', 'social-salary', true)
    `);

    pgm.sql(`
        insert into categories (name, type, icon, is_system) values
        ('Продукты', 'expense', 'products', true),
        ('Транспорт', 'expense', 'transport', true),
        ('Жильё', 'expense', 'rental-housing', true),
        ('Коммунальные услуги', 'expense', 'utilities', true),
        ('Интернет и связь', 'expense', 'internet', true),
        ('Рестораны', 'expense', 'restaurant', true),
        ('Одежда', 'expense', 'clothes', true),
        ('Здоровье', 'expense', 'health', true),
        ('Образование', 'expense', 'education', true),
        ('Развлечения', 'expense', 'amusement-park', true),
        ('Связь', 'expense', 'contact', true),
        ('Цели', 'expense', 'target', true)
    `);
};

exports.down = (pgm) => {
    pgm.sql(`delete categories where is_system = true`);
};