import { useState } from 'react';

interface FormResultData<T> {
	formData: T;
	handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	handleSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
	handleClear: () => void;
}

interface UseFormProps<T> {
	initialState: T;
	onSubmit?: (formData: T) => Promise<void>;
}

export function useForm<T>({
	initialState,
	onSubmit,
}: UseFormProps<T>): FormResultData<T> {
	const [formData, setFormData] = useState<T>(initialState);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit?.(formData);
	};

	const handleClear = () => {
		setFormData(initialState);
	};

	return { formData, handleInputChange, handleSubmit, handleClear };
}
