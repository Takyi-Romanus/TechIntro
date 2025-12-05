const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

// Donation Schema
const donationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    reference: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'pending'
    },
    email: String,
    donatedAt: {
        type: Date,
        default: Date.now
    }
});

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    reason: {
        type: String,
        enum: ['general', 'collaboration', 'partnership', 'support', 'other'],
        default: 'general'
    },
    message: {
        type: String,
        required: true
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['new', 'read', 'responded'],
        default: 'new'
    }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);
const Donation = mongoose.model('Donation', donationSchema);
const Contact = mongoose.model('Contact', contactSchema);

// API Routes

// Newsletter Subscription
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // Check if email already exists
        const existingSubscriber = await Newsletter.findOne({ email });
        if (existingSubscriber) {
            return res.status(400).json({ 
                success: false, 
                message: 'This email is already subscribed' 
            });
        }

        // Create new subscriber
        const subscriber = new Newsletter({ email });
        await subscriber.save();

        res.status(201).json({ 
            success: true, 
            message: 'Successfully subscribed to newsletter!' 
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to subscribe. Please try again.' 
        });
    }
});

// Get all newsletter subscribers (admin route)
app.get('/api/newsletter/subscribers', async (req, res) => {
    try {
        const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
        res.json({ 
            success: true, 
            count: subscribers.length,
            subscribers 
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch subscribers' 
        });
    }
});

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, reason, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, email, and message are required' 
            });
        }

        if (!email.includes('@')) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide a valid email address' 
            });
        }

        // Create new contact submission
        const contact = new Contact({
            name,
            email,
            reason: reason || 'general',
            message
        });

        await contact.save();

        res.status(201).json({ 
            success: true, 
            message: 'Message received! We\'ll get back to you soon.',
            contact: {
                name: contact.name,
                email: contact.email,
                submittedAt: contact.submittedAt
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to submit message. Please try again.' 
        });
    }
});

// Get all contact messages (admin route)
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ submittedAt: -1 });
        res.json({ 
            success: true, 
            count: contacts.length,
            contacts 
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch contacts' 
        });
    }
});

// Record Donation
app.post('/api/donate', async (req, res) => {
    try {
        const { amount, reference, status, email } = req.body;

        if (!amount || !reference) {
            return res.status(400).json({ 
                success: false, 
                message: 'Amount and reference are required' 
            });
        }

        // Check if donation with this reference already exists
        const existingDonation = await Donation.findOne({ reference });
        if (existingDonation) {
            return res.json({ 
                success: true, 
                message: 'Donation already recorded',
                donation: existingDonation
            });
        }

        // Create new donation record
        const donation = new Donation({
            amount,
            reference,
            status: status || 'success',
            email
        });

        await donation.save();

        res.status(201).json({ 
            success: true, 
            message: 'Donation recorded successfully!',
            donation 
        });

    } catch (error) {
        console.error('Donation recording error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to record donation' 
        });
    }
});

// Get all donations (admin route)
app.get('/api/donations', async (req, res) => {
    try {
        const donations = await Donation.find().sort({ donatedAt: -1 });
        
        const totalAmount = donations.reduce((sum, donation) => {
            return donation.status === 'success' ? sum + donation.amount : sum;
        }, 0);

        res.json({ 
            success: true, 
            count: donations.length,
            totalAmount,
            donations 
        });
    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch donations' 
        });
    }
});

// Verify Paystack Payment
app.post('/api/verify-payment', async (req, res) => {
    try {
        const { reference } = req.body;
        const https = require('https');

        const options = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/${reference}`,
            method: 'GET',
            headers: {
                Authorization: PAYSTACK_SECRET_KEY
            }
        };

        const paystackReq = https.request(options, paystackRes => {
            let data = '';

            paystackRes.on('data', (chunk) => {
                data += chunk;
            });

            paystackRes.on('end', async () => {
                const response = JSON.parse(data);
                
                if (response.status && response.data.status === 'success') {
                    // Update or create donation record
                    await Donation.findOneAndUpdate(
                        { reference },
                        {
                            status: 'success',
                            amount: response.data.amount / 100,
                            email: response.data.customer.email
                        },
                        { upsert: true, new: true }
                    );

                    res.json({ 
                        success: true, 
                        message: 'Payment verified',
                        data: response.data 
                    });
                } else {
                    res.json({ 
                        success: false, 
                        message: 'Payment verification failed' 
                    });
                }
            });
        });

        paystackReq.on('error', error => {
            console.error('Paystack verification error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Verification request failed' 
            });
        });

        paystackReq.end();

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to verify payment' 
        });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
    console.log(` Contact API: http://localhost:${PORT}/api/contact`);
    console.log(` Newsletter API: http://localhost:${PORT}/api/newsletter`);
    console.log(` Donation API: http://localhost:${PORT}/api/donate`);

});
