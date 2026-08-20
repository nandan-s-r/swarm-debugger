import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, error } = await request.json();

    if (!code || !error) {
      return NextResponse.json(
        { error: 'Code and error message are required.' },
        { status: 400 }
      );
    }

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // For Milestone 1, we are using mock data to build out the vertical slice safely and cheaply.
    const mockResponse = {
      rootCause: "The code is attempting to access a property on an undefined object, likely because the data hasn't finished loading or wasn't passed correctly.",
      proposedFix: "Add a null check before accessing the property, or use optional chaining (e.g., `data?.property`).",
      reviewerVerdict: "Approved. The proposed fix is safe and addresses the immediate crash. Consider also logging a warning if the data is unexpectedly missing."
    };

    return NextResponse.json(mockResponse);
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
