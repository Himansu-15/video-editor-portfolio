import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: Record<string, unknown>
) {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    { status }
  )
}

export function errorResponse(
  message: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details ? { details } : {}),
    },
    { status }
  )
}

export function handleZodError(error: ZodError) {
  const formattedErrors = error.errors.map((err) => ({
    path: err.path.join('.'),
    message: err.message,
  }))

  return errorResponse('Validation failed', 422, formattedErrors)
}
