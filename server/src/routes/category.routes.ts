import { Router } from 'express';

const router = Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    // TODO: Implement get categories logic
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    // TODO: Implement create category logic
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating category' });
  }
});

export default router; 