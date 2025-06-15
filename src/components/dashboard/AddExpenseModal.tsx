import React from 'react';
import { Modal } from '../ui/modal';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { amount: string; categoryId: string; date: string; description: string }) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Expense">
      <div className="p-4">
        <div className="text-center text-gray-500">Form coming soon...</div>
      </div>
    </Modal>
  );
}; 