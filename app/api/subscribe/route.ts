import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Define the schema directly inside the route to prevent import/buffering mismatches
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

// Prevent Mongoose from recompiling the model if it already exists
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }
  await mongoose.connect(process.env.MONGODB_URI);
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
    }

    // Save the new subscriber
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 200 });
  } catch (error: any) {
    console.error('Error in subscribe route:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}