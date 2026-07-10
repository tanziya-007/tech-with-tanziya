import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readdir, unlink, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

const uploadsDir = join(process.cwd(), 'public', 'uploads', 'resources');
const metadataFile = join(uploadsDir, 'metadata.json');

async function ensureDir() {
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
}

async function getMetadata() {
  try {
    const data = await readFile(metadataFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

async function saveMetadata(metadata: Record<string, any>) {
  await writeFile(metadataFile, JSON.stringify(metadata, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    await ensureDir();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;
    const title = formData.get('title') as string;

    if (!file || !slug) {
      return NextResponse.json(
        { error: 'File and slug are required' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const ext = file.name.split('.').pop();
    const filename = `${slug}.${ext}`;
    const filepath = join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const metadata = await getMetadata();
    if (title && !metadata[slug]) {
      metadata[slug] = { title, slug };
      await saveMetadata(metadata);
    }

    return NextResponse.json({
      success: true,
      slug,
      filename,
      url: `/uploads/resources/${filename}`,
      message: 'Resource image uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureDir();
    
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const files = await readdir(uploadsDir);
    const fileToDelete = files.find(f => f.startsWith(slug + '.') && f !== 'metadata.json');

    if (!fileToDelete) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    const filepath = join(uploadsDir, fileToDelete);
    await unlink(filepath);

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureDir();
    
    const files = await readdir(uploadsDir);
    const uploads = files
      .filter(file => file !== 'metadata.json')
      .map(file => {
        const slug = file.split('.')[0];
        return {
          slug,
          filename: file,
          url: `/uploads/resources/${file}`,
        };
      });

    return NextResponse.json({ uploads });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve resources' },
      { status: 500 }
    );
  }
}
