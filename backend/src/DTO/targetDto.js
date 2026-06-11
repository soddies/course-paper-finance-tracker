const toTargetResponse = (target) => {
    if (!target) {
        return null;
    }

    return {
        id: target.id,
        name: target.name,
        targetAmount: parseFloat(target.target_amount),
        currentAmount: parseFloat(target.current_amount || 0),
        deadline: target.deadline || null,
        icon: target.icon || 'target',
        status: target.status || 'active',
        progress: target.target_amount > 0 ? Math.min((parseFloat(target.current_amount || 0) / parseFloat(target.target_amount)) * 100, 100) : 0
    };
};

const toTargetListResponse = (targets) => {
    if (!targets || !Array.isArray(targets)) {
        return [];
    }

    return targets.map(toTargetResponse);
};

module.exports = {
    toTargetResponse,
    toTargetListResponse
};