import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    await dbConnect();

    // Check if user already exists using findOne (fixes the array issue)
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: 'user',
      stats: { kills: 0, deaths: 0, wins: 0, matches: 0, rank: 'Rookie' }
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "An error occurred while registering the user." }, { status: 500 });
  }
}