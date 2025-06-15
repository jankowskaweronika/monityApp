import React from 'react';
import { Modal } from '../ui/modal';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      <div className="p-4">
        <div className="text-center text-gray-500">Form coming soon...</div>
      </div>
    </Modal>
  );
}; 