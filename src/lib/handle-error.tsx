export interface ErrorResponse {
  success: false,
  message: string,
  error: string;
  data: {
    success: boolean;
    message: string;
    data: {
      [key: string]: string[];
    };
  };
}

import { toast } from "sonner";

/**
 * Restructures error messages from an API response.
 * @param errorResponse - The error response from the API.
 * @returns An array of error messages or a fallback message if no specific errors are found.
 */
export function restructureErrorMessages(errorResponse: ErrorResponse): string[] {
    const errors = errorResponse?.data?.data; // Optional chaining
    const notifications: string[] = [];

    if (errors) { // Check if errors exist
        for (const field in errors) {
            if (Object.prototype.hasOwnProperty.call(errors, field)) {
                errors[field].forEach((errorMessage: string) => {
                    notifications.push(errorMessage);
                });
            }
        }
    }

    // If no specific error messages are found, use the general message
    if (notifications.length === 0) { 
        notifications.push(errorResponse?.data?.message || errorResponse?.error || "Something went wrong. Please try again.");
    }

    return notifications;
}

/**
 * Handles displaying error notifications from an API response.
 * @param errorResponse - The error response from the API.
 * This function calls `restructureErrorMessages` to get the notifications
 * and then displays each notification as an error toast.
 */
export function handleErrors(errorResponse: ErrorResponse) {
    const notifications = restructureErrorMessages(errorResponse);
    notifications.forEach((notification) => {
        toast.error(notification); // Or display it in the UI
      });
}

export default handleErrors;

export interface ErrorDetail {
    message: string;
    type: string;
  }


export function handleFormErrors(errors: ErrorDetail) {
    Object.values(errors).forEach((error) => {
      if (error.message) {
        toast.error(error.message || error.error || '');
      }
    });
  }