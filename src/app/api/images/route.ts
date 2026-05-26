import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js'; 

// Inicializamos el cliente de Supabase optimizado para el Servidor
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseServer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

const getErrorMessage = (error: unknown): string => {
  if (!error) return 'Unknown error';
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && error !== null) {
    if ('error' in error && typeof (error as any).error === 'string') {
      return (error as any).error;
    }
    if ('message' in error && typeof (error as any).message === 'string') {
      return (error as any).message;
    }
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'Unknown error';
  }
};

// GET - Recuperar todas las imágenes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let query = supabaseServer
      .from('gallery_images') // ⚠️ Si tu tabla en Supabase se llama diferente, cambia este nombre aquí
      .select('*')
      .order('created_at', { ascending: false });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching images backend:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva imagen
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image_url } = body;

    if (!title || !description || !image_url) {
      return NextResponse.json(
        { error: 'Title, description, and image URL are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('gallery_images') // ⚠️ Si tu tabla en Supabase se llama diferente, cambia este nombre aquí
      .insert([{ title, description, image_url }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating image backend:', error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}