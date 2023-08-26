export {}

declare global {
    type TErrorResponse = {
        error: string|null;
        description?: string;
        property?: string;
      }
  }