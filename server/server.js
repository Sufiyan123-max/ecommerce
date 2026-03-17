const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware
const cors = require("cors");

app.use(cors({
  origin: "*",   // allow all domains
  methods: ["GET","POST","PUT","DELETE","PATCH"],
  credentials: true
}));

app.use(express.json());

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sufi';
const maskedUri = mongoUri.replace(/(mongodb\+srv:\/\/)(.*@)/, '$1****@');
console.log('Connecting to MongoDB at:', maskedUri);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  }
});

// Delivery Info Schema
const deliveryInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userEmail: {
    type: String,
    required: false
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  postcode: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  phoneNo: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userEmail: {
    type: String,
    required: false
  },
  items: [{
    id: String,
    title: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  deliveryInfo: {
    fullName: String,
    address: String,
    state: String,
    postcode: String,
    country: String,
    phoneNo: String
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'Cash on Delivery'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
const Contact = mongoose.model('Contact', contactSchema);
const DeliveryInfo = mongoose.model('DeliveryInfo', deliveryInfoSchema);
const Order = mongoose.model('Order', orderSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Contact Form Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Create new contact message
    const contact = new Contact({
      name,
      email,
      message
    });

    await contact.save();

    res.status(201).json({
      message: 'Message sent successfully! We will get back to you soon.',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get all contact messages (admin route - protected)
app.get('/api/contact', authenticateToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update contact status (admin route - protected)
app.patch('/api/contact/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    
    res.json({ contact });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delivery Info Submission
app.post('/api/delivery-info', async (req, res) => {
  try {
    const { userId, userEmail, fullName, address, state, postcode, country, phoneNo } = req.body;

    // Validate required fields
    if (!fullName || !address || !phoneNo) {
      return res.status(400).json({ message: 'Full name, address, and phone number are required' });
    }

    // Create new delivery info
    const deliveryInfo = new DeliveryInfo({
      userId,
      userEmail,
      fullName,
      address,
      state,
      postcode,
      country,
      phoneNo
    });

    await deliveryInfo.save();

    res.status(201).json({
      message: 'Delivery information saved successfully!',
      deliveryInfo: {
        id: deliveryInfo._id,
        fullName: deliveryInfo.fullName,
        address: deliveryInfo.address,
        phoneNo: deliveryInfo.phoneNo,
        createdAt: deliveryInfo.createdAt
      }
    });

  } catch (error) {
    console.error('Delivery info submission error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get delivery info for user (protected route)
app.get('/api/delivery-info', authenticateToken, async (req, res) => {
  try {
    const deliveryInfo = await DeliveryInfo.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ deliveryInfo });
  } catch (error) {
    console.error('Get delivery info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Order Submission
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, userEmail, items, deliveryInfo, totalAmount, paymentMethod, status } = req.body;

    // Validate required fields
    if (!items || items.length === 0 || !deliveryInfo || !totalAmount) {
      return res.status(400).json({ message: 'Order items, delivery info, and total amount are required' });
    }

    // Create new order
    const order = new Order({
      userId,
      userEmail,
      items,
      deliveryInfo,
      totalAmount,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: status || 'pending'
    });

    await order.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Order submission error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Get orders for user (protected route)
app.get('/api/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders (admin route - protected)
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (admin route - protected)
app.patch('/api/admin/orders/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ order });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Sign In
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password) and token
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Signed in successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile (protected route)
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
