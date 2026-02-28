import { NextResponse } from 'next/server';

export function apiResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function handleApiError(error: any) {
  console.error('API Error:', error);
  return apiError(error.message || 'Internal Server Error', 500);
}