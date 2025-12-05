# TechIntro

# Tech Intro Website - Complete Setup Guide

A comprehensive, multi-page website for Tech Intro - a student-led initiative empowering young Africans with practical tech skills and digital opportunities.

## 🌟 About Tech Intro

**Mission**: To introduce and guide young Africans into technology through accessible resources, structured learning, and impactful community support.

**Vision**: A generation of African students equipped with digital skills, innovative thinking, and equal access to opportunities — regardless of background.

**Founded**: 2025 by Takyi Romanus, Computer Science student at University of Energy and Natural Resources

## ✨ Website Features

### Pages
- **Home**: Hero section, mission/vision, what we do, core values
- **About**: Founding story, mission statement, team values
- **Contact/Join**: Contact form, social links, newsletter signup
- **Support/Donate**: Why support us, impact stories, donation system

### Functionality
- **Multi-Page Navigation**: Smooth single-page app experience
- **Responsive Design**: Works perfectly on all devices
- **Newsletter Subscription**: MongoDB storage with email validation
- **Contact Form**: Stores inquiries with categorization
- **Donation System**: Integrated Paystack payment gateway (GHS)
- **Social Media Integration**: Footer and contact page links
- **Modern UI/UX**: Gradient themes, smooth animations, professional design

## 📁 Project Structure

```
tech-intro-website/
├── server.js              # Backend server with all APIs
├── package.json           # Dependencies
├── .env                   # Environment variables
├── public/
│   └── index.html        # Complete multi-page frontend
        style.css
└── README.md             # This file
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (already configured)
- Paystack account (already configured)

### Step 1: Clone or Create Project

Create a new folder for your project:

```bash
mkdir tech-intro-website
cd tech-intro-website
```

### Step 2: Create Files

Create the following files with the provided code:

1. **server.js** - Backend server code
2. **package.json** - Dependencies configuration
3. **.env** - Environment variables
4. Create a `public` folder and add:
   - **index.html** - Frontend website

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- express (web server)
- mongoose (MongoDB ODM)
- cors (cross-origin requests)
- dotenv (environment variables)

### Step 4: Configure Environment Variables

The `.env` file is already configured with your credentials:
- MongoDB connection string
- Paystack live API keys
- Server port (3000)

**⚠️ SECURITY NOTE**: Never commit `.env` file to version control!

### Step 5: Start the Server

For development with auto-restart:
```bash
npm run dev
```

For production:
```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 3000
📧 Newsletter API: http://localhost:3000/api/newsletter
💰 Donation API: http://localhost:3000/api/donate
```

### Step 6: Access Your Website

Open your browser and go to:
```
http://localhost:3000
```

## 🔌 API Endpoints

### Newsletter Subscription

**POST** `/api/newsletter`
```json
{
  "email": "user@example.com"
}
```

**GET** `/api/newsletter/subscribers`
- Returns all newsletter subscribers (admin)

### Contact Form

**POST** `/api/contact`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "reason": "collaboration",
  "message": "I'd like to partner with Tech Intro..."
}
```

**GET** `/api/contacts`
- Returns all contact submissions (admin)

### Donations

**POST** `/api/donate`
```json
{
  "amount": 100,
  "reference": "TECHINTRO_123456",
  "status": "success",
  "email": "donor@example.com"
}
```

**GET** `/api/donations`
- Returns all donations with total amount (admin)

**POST** `/api/verify-payment`
```json
{
  "reference": "TECHED_123456"
}
```

## 💳 Paystack Integration

The donation system uses Paystack for payment processing:

- **Currency**: GHS (Ghana Cedis)
- **Payment Methods**: Card, Mobile Money, Bank Transfer
- **Security**: PCI-DSS compliant
- **Public Key**: Already configured in frontend
- **Secret Key**: Already configured in backend

### How Donations Work:

1. User selects or enters donation amount
2. Clicks "Donate Now" button
3. Paystack popup appears for payment
4. User completes payment
5. Transaction reference sent to backend
6. Donation recorded in MongoDB

## 🗄️ Database Collections

### newsletters
```javascript
{
  email: String (unique, required),
  subscribedAt: Date
}
```

### contacts
```javascript
{
  name: String (required),
  email: String (required),
  reason: String (enum: general, collaboration, partnership, support, other),
  message: String (required),
  submittedAt: Date,
  status: String (enum: new, read, responded)
}
```

### donations
```javascript
{
  amount: Number (required),
  reference: String (unique, required),
  status: String (enum: success, failed, pending),
  email: String,
  donatedAt: Date
}
```


## 📱 Testing

### Test Newsletter:
1. Go to Contact page or scroll to newsletter section
2. Enter email and click Subscribe
3. Check MongoDB `newsletters` collection for new entry
4. Try subscribing again (should show "already subscribed")

### Test Contact Form:
1. Navigate to Contact page
2. Fill out name, email, select reason, and write message
3. Submit form
4. Check MongoDB `contacts` collection
5. View all contacts at `/api/contacts`

### Test Donations:
1. Go to Support page
2. Click any amount button or enter custom amount
3. Click "Donate Now"
4. Complete Paystack payment
5. Check MongoDB `donations` collection for record
6. View donation stats at `/api/donations`

### Test Page Navigation:
1. Click through all menu items
2. Test mobile menu (resize browser)
3. Verify smooth scrolling and page transitions


### Important for Production:

- Add `.gitignore` file:
```
node_modules/
.env
.DS_Store
```

- Use HTTPS for production
- Enable CORS only for your domain
- Add rate limiting for API endpoints
- Set up monitoring and logging

## 🔒 Security Best Practices

1. **Never expose API keys** in frontend code
2. **Use environment variables** for sensitive data
3. **Validate all inputs** on server side
4. **Use HTTPS** in production
5. **Implement rate limiting** to prevent abuse
6. **Keep dependencies updated**

## 📞 Support & Information

**Tech Intro**
- Industry: E-Learning Providers / Technology
- Company Type: Nonprofit / Student-Led Initiative
- Founded: 2025
- Location: Ghana, West Africa

For Paystack issues:
- Documentation: https://paystack.com/docs
- Support: support@paystack.com

For MongoDB issues:
- Documentation: https://docs.mongodb.com
- Support: https://www.mongodb.com/support


This is a complete, production-ready website built for Tech Intro with:
- ✅ 4 fully functional pages (Home, About, Contact, Support)
- ✅ Multi-page navigation (SPA architecture)
- ✅ Modern, responsive design
- ✅ Working payment integration (Paystack)
- ✅ Database storage (MongoDB)
- ✅ Form validation and error handling
- ✅ Professional UI/UX with animations
- ✅ Newsletter subscription system
- ✅ Contact form with inquiry tracking
- ✅ Donation system with custom amounts
- ✅ Admin routes for viewing data

**Built by Takyi Romanus for Tech Intro**  
*Empowering Young Africans with Tech Skills*