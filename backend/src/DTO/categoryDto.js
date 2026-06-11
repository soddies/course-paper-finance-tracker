const toCategoryResponse = (category) => {
    if (!category) {
        return null;
    }

    return {
        id: category.id,
        name: category.name,
        type: category.type,
        icon: category.icon,
        isSystem: category.is_system
    };
};

const toCategoryListResponse = (categories) => {
    if (!categories || !Array.isArray(categories)) {
        return [];
    }

    return categories.map(toCategoryResponse);
};

module.exports = {
    toCategoryResponse,
    toCategoryListResponse
};

