import { DailyCheatSheet } from '@/types/daily';

let dailyCheatSheets: DailyCheatSheet[] = [];

export async function POST(request: Request) {
  try {
    const { title, content, category } = await request.json();

    if (!title || !content || !category) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const newSheet: DailyCheatSheet = {
      id: Date.now().toString(),
      title,
      content,
      category,
      date: today,
      createdAt: new Date().toISOString(),
    };

    dailyCheatSheets.unshift(newSheet);
    return Response.json(newSheet, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: 'Failed to upload cheat sheet' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(dailyCheatSheets);
}
