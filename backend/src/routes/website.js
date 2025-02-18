import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import Website from '../models/Website.js';
import User from '../models/user.js';

const router = express.Router();

// GET all websites (Admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role!== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
        const websites = await Website.find().populate('owner');
        res.json(websites);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST a new website (User or Admin)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { domain, title, description } = req.body;

        const newWebsite = new Website({
            domain,
            title,
            description,
            owner: req.user._id,
        });

        const savedWebsite = await newWebsite.save();

        await User.findByIdAndUpdate(req.user._id, { $push: { websites: savedWebsite._id } });

        res.status(201).json(savedWebsite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET a single website (Owner or Admin)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const website = await Website.findById(req.params.id).populate('owner');

        if (!website) {
            return res.status(404).json({ message: 'Website not found' });
        }

        if (website.owner.id!== req.user.id && req.user.role!== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not own this website' });
        }

        res.json(website);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update a website (Owner or Admin)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { domain, title, description } = req.body;
        const website = await Website.findById(req.params.id);

        if (!website) {
            return res.status(404).json({ message: 'Website not found' });
        }

        if (website.owner.toString()!== req.user._id.toString() && req.user.role!== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not own this website' });
        }

        const updatedWebsite = await Website.findByIdAndUpdate(
            req.params.id,
            { domain, title, description },
            { new: true }
        );

        res.json(updatedWebsite);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// DELETE a website (Owner or Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const website = await Website.findById(req.params.id);

        if (!website) {
            return res.status(404).json({ message: 'Website not found' });
        }

        if (website.owner.toString()!== req.user._id.toString() && req.user.role!== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You do not own this website' });
        }

        await Website.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(website.owner, { $pull: { websites: website._id } });

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


export default router;