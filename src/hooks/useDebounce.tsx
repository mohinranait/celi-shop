import { useEffect, useState } from "react";

// Define a generic type T to allow for any type of value
/**
 * The `useDebounce` function in TypeScript React is used to debounce a value with a specified delay.
 * @param {T} value - The `value` parameter is the input value that you want to debounce. This can be
 * of any type (`T`) and represents the value that you want to delay before updating the debounced
 * value.
 * @param {number} [delay=500] - The `delay` parameter in the `useDebounce` function specifies the
 * amount of time in milliseconds to wait before updating the debounced value with the latest value. By
 * default, the delay is set to 500 milliseconds if no value is provided when calling the function.
 * @returns The `useDebounce` custom hook returns the debounced value of the input value after a
 * specified delay.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedValue(value), delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}
