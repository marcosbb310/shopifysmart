"use client";

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface ErrorTestComponentProps {
  level?: 'component' | 'feature' | 'page';
}

export function ErrorTestComponent({ level = 'component' }: ErrorTestComponentProps) {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    // This will trigger the error boundary
    throw new Error(`Test error for ${level} level error boundary`);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Error Boundary Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This component can trigger an error to test the error boundary at the {level} level.
        </p>
        <Button 
          onClick={() => setShouldError(true)}
          variant="destructive"
          className="w-full"
        >
          Trigger Error
        </Button>
        <p className="text-xs text-muted-foreground">
          Click the button above to test error boundary functionality.
        </p>
      </CardContent>
    </Card>
  );
}
