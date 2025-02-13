import express from 'express';
import  Content  from '../models/content.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET content for a specific page of a website
router.get('/:websiteId/:page', async (req, res) => {
    try {
        const { websiteId, page } = req.params;
        const content = await Content.findOne({ website: websiteId, page });
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.json(content);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new content (protected route)
router.post(
    '/',
    authenticate,
    [
        body('website').isMongoId().withMessage('Invalid website ID'),
        body('page').notEmpty().withMessage('Page is required'),
        body('content').notEmpty().withMessage('Content is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { website, page, content } = req.body;
            const newContent = new Content({
                website,
                page,
                content,
                updatedBy: req.user._id, // Assign the user who updated
            });
            const savedContent = await newContent.save();
            res.status(201).json(savedContent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// PUT (update) content (protected route)
router.put(
    '/:id',
    authenticate,
    [
        body('content').notEmpty().withMessage('Content is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { content } = req.body;
            const updatedContent = await Content.findByIdAndUpdate(
                req.params.id,
                { content, lastUpdated: Date.now(), updatedBy: req.user._id, version: content.version + 1 }, // Update lastUpdated and updatedBy
                { new: true, runValidators: true }
            );
            if (!updatedContent) {
                return res.status(404).json({ message: 'Content not found' });
            }
            res.json(updatedContent);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// DELETE content (protected route)
router.delete('/:id', authenticate, async (req, res) => {
    try {
        const deletedContent = await Content.findByIdAndDelete(req.params.id);
        if (!deletedContent) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;