import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const cuisine = searchParams.get('cuisine');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let query: any = {};
    
    if (cuisine && cuisine !== 'all') {
      query.cuisine = cuisine;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ingredients: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const recipes = await Recipe.find(query)
      .populate('user', 'name email avatar')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Recipe.countDocuments(query);

    return NextResponse.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { title, description, image, cuisine, ingredients, steps, nutrition, userEmail } = body;

    // Find or create user
    let user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const recipe = new Recipe({
      title,
      description,
      image,
      cuisine,
      ingredients,
      steps,
      nutrition,
      user: user._id
    });

    await recipe.save();
    await recipe.populate('user', 'name email avatar');

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
  }
}