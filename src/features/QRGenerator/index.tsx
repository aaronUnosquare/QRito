import { QRCodePreview } from "@/components/QRCodePreview";
import { useForm } from "@/hooks/useForm";

type QRForm = {
	qrInput: string;
};

export function QrGenerator() {
	const { formData, handleInputChange, handleSubmit, handleClear } =
		useForm<QRForm>({
			initialState: {
				qrInput: "",
			},
			onSubmit: async (formData: QRForm) => {
				console.log("QR Code Data:", formData);
			},
		});

	const { qrInput } = formData;

	return (
		<div className="w-full lg:flex lg:justify-center lg:items-center">
			<div className="w-full px-5">
				<h1 className="text-5xl font-black mb-4 lg:mb-8 lg:text-7xl">
					Convert your Link to QR code
				</h1>
				<form className="mb-6 flex flex-col" onSubmit={handleSubmit}>
					<input
						id="qrInput"
						name="qrInput"
						type="url"
						pattern="https://.*"
						placeholder="Enter the URL (e.g https://example.com)"
						className="w-full px-4 py-4 border border-gray-300 rounded mb-4 lg:mb-8 min-[1440px]:w-5/6"
						value={qrInput}
						onChange={handleInputChange}
					/>

					<label htmlFor="qrInput" className="text-gray-600 min-[1440px]:w-5/6">
						Your QR code will be generated automatically, your generated QR code
						will open this URL.
					</label>
				</form>
			</div>

			<QRCodePreview qrInput={qrInput} onClear={handleClear} />
		</div>
	);
}
