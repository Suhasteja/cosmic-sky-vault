import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import User from '@/models/User';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { text, userEmail } = body;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const recipe = await Recipe.findById(params.id);
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    recipe.comments.push({
      user: user._id,
      text,
      createdAt: new Date()
    });

    await recipe.save();
    await recipe.populate('user', 'name email avatar');
    await recipe.populate('comments.user', 'name email avatar');

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}