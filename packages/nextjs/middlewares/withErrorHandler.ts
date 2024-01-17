import { NextRequest, NextResponse } from "next/server";

function withErrorHandler(fn: any) {
  return async function (request: NextRequest, ...args: any[]) {
    try {
      return await fn(request, ...args);
    } catch (error) {
      console.error({ error, requestBody: request, location: fn.name });
      return NextResponse.json(
        {
          message: "Internal Server Error",
          // @ts-ignore
          details: "message" in error ? error.message : error,
        },
        { status: 500 },
      );
    }
  };
}

export default withErrorHandler;
