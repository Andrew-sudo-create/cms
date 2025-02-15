import express from 'express';
import  Website  from '../models/website.js';
import  User  from '../models/user.js'; 
import { authenticate } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator'; // For input validation

const router = express.Router();

// GET all websites (admin only)
router.get('/', authenticate, async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role!== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const websites = await Website.find().populate('owner', 'email firstName lastName'); // Populate owner details
        res.json(websites);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// GET websites owned by the logged-in user
router.get('/my', authenticate, async (req, res, next) => {
    try {
        const userId = req.user._id;
        const websites = await Website.find({ owner: userId }).populate('owner', 'email firstName lastName'); // Populate
        res.json(websites);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// GET a specific website by ID
router.get('/:id', authenticate, async (req, res, next) => {
    try {
        const website = await Website.findById(req.params.id).populate('owner', 'email firstName lastName'); // Populate
        if (!website) {
            return res.status(404).json({ message: 'Website not found' });
        }
        res.json(website);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST a new website (admin only - with validation)
router.post(
    '/',
    authenticate,
    [
        body('domain')
          .notEmpty()
          .withMessage('Domain is required')
          .isURL({ require_tld: false }) // Allow domains without TLDs (e.g., localhost)
          .withMessage('Invalid domain format'),
        body('title').notEmpty().withMessage('Title is required'),
        body('description').optional(), // Description is optional
        body('owner').isMongoId().withMessage('Invalid owner ID'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = req.user;
            if (user.role!== 'admin') {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const { domain, title, description, owner } = req.body;
            const newWebsite = new Website({
                domain,
                title,
                description,
                owner,
            });
            const savedWebsite = await newWebsite.save();
            res.status(201).json(savedWebsite);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
);



// PUT (update) a website (with validation)
router.put(
    '/:id',
    authenticate,
    [
        body('domain')
          .notEmpty()
          .withMessage('Domain is required')
          .isURL({ require_tld: false })
          .withMessage('Invalid domain format'),
        body('title').notEmpty().withMessage('Title is required'),
        body('description').optional(),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { domain, title, description } = req.body;
            const updatedWebsite = await Website.findByIdAndUpdate(
                req.params.id,
                { domain, title, description },
                { new: true, runValidators: true } // Run validators on update
            );
            if (!updatedWebsite) {
                return res.status(404).json({ message: 'Website not found' });
            }
            res.json(updatedWebsite);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
);

// DELETE a website (admin only)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const user = req.user;
        if (user.role!== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const deletedWebsite = await Website.findByIdAndDelete(req.params.id);
        if (!deletedWebsite) {
            return res.status(404).json({ message: 'Website not found' });
        }
        res.status(204).end(); // 204 No Content
    } catch (error) {
        console.error(error);
        next(error);
    }
});

export default router;