// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames

// You'll need to install 'uuid' for unique file names
// npm install uuid
// npm install -D @types/uuid

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const uniqueFileName = `${uuidv4()}-${file.name}`;
    // Define the directory where files will be saved.
    // For local development, saving to 'public/uploads' is convenient for direct access.
    // In production, consider cloud storage like S3, Cloudinary, etc.
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, uniqueFileName);

    // Ensure the directory exists (basic check, more robust for production)
    // This part is crucial, if the directory doesn't exist, writeFile will fail.
    // For a simple example, we'll assume 'public/uploads' is created manually for now,
    // or add a utility to create it if it doesn't exist.
    // (You can add fs.mkdirSync(uploadDir, { recursive: true }) here)

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // The URL where the file can be accessed publicly
    const fileUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      message: 'File uploaded successfully',
      fileName: uniqueFileName,
      fileUrl: fileUrl,
      fileSize: file.size,
      fileType: file.type,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: error.message || 'File upload failed.' }, { status: 500 });
  }
}

// Optional: Add a DELETE handler for clearing files
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');

    if (!fileName) {
      return NextResponse.json({ error: 'File name is required to delete.' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, fileName);

    await rm(filePath, { force: true }); // force: true prevents error if file doesn't exist

    return NextResponse.json({ message: 'File deleted successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: error.message || 'File deletion failed.' }, { status: 500 });
  }
}