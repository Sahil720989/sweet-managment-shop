import express from 'express';
import Sweet from '../models/Sweet.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all sweets
router.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.find().populate('created_by', 'full_name');
    const transformedSweets = sweets.map(sweet => ({
      ...sweet.toObject(),
      id: sweet._id.toString(),
      _id: undefined,
    }));
    res.json(transformedSweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sweet by id
router.get('/:id', async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id).populate('created_by', 'full_name');
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    const transformedSweet = {
      ...sweet.toObject(),
      id: sweet._id.toString(),
      _id: undefined,
    };
    res.json(transformedSweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sweet
router.post('/', auth, async (req, res) => {
  try {
    const sweet = new Sweet({
      ...req.body,
      created_by: req.user.id,
    });
    await sweet.save();
    const transformedSweet = {
      ...sweet.toObject(),
      id: sweet._id.toString(),
      _id: undefined,
    };
    res.status(201).json(transformedSweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update sweet
router.put('/:id', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    const transformedSweet = {
      ...sweet.toObject(),
      id: sweet._id.toString(),
      _id: undefined,
    };
    res.json(transformedSweet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete sweet
router.delete('/:id', auth, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    res.json({ message: 'Sweet deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;