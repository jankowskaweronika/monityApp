import { Router } from 'express';

const router = Router();

// Get budget
router.get('/', async (req, res) => {
  try {
    // TODO: Implement get budget logic
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching budget' });
  }
});

// Set budget
router.post('/', async (req, res) => {
  try {
    // TODO: Implement set budget logic
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (err) {
    res.status(500).json({ message: 'Error setting budget' });
  }
});

export default router; 