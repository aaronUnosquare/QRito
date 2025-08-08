import type { ComponentPropsWithoutRef, RefAttributes } from 'react';

interface ButtonProps
	extends ComponentPropsWithoutRef<'button'>,
		RefAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	className?: string;
}

export function Button({ children, ref, className, ...props }: ButtonProps) {
	const classes = `w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed md:w-fit ${className}`;

	return (
		<button ref={ref} className={classes} {...props}>
			{children}
		</button>
	);
}
