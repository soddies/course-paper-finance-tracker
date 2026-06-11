const toUserResponse = (user) => {
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        nickname: user.nickname || null,
        role: user.role,
        createdAt: user.created_at
    };
};

const toUsersListResponse = (users) => {
    if (!users || !Array.isArray(users)) {
        return [];
    }

    return users.map(toUserResponse);
};

const toAdminResponse = (user) => {
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        nickname: user.nickname || null,
        role: user.role,
        createdAt: user.created_at
    };
};

module.exports = {
    toUserResponse,
    toUsersListResponse,
    toAdminResponse
};