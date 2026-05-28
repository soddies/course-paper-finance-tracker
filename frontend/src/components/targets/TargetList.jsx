import React from 'react';
import TargetCard from './TargetCard';
import '../../assets/styles/targets.css'

const TargetList = ({targets, onEdit, onDelete, onAddAmount,onTogglePause}) => {
    return (
        <div className="target-grid">
            {targets.map(target => 
                <TargetCard
                    key={target.id}
                    target={target}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddAmount={onAddAmount}
                    onTogglePause={onTogglePause}
                />
            )}
        </div>
    );
};

export default TargetList;