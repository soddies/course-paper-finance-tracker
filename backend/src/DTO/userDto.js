const toUserResponse = (user) => {
    if (!user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
        isBanned: user.is_banned || false,
        banReason: user.ban_reason || null,
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
        nickname: user.nickname,
        role: user.role,
        isBanned: user.is_banned || false,
        banReason: user.ban_reason || null,
        bannedAt: user.banned_at || null,
        createdAt: user.created_at
    };
};

module.exports = {
    toUserResponse,
    toUsersListResponse,
    toAdminResponse
};