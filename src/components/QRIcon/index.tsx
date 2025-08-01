interface QRIconProps extends React.SVGProps<SVGSVGElement> {
	className?: string;
}

export const QRIcon = ({ className, ...props }: QRIconProps) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlSpace="preserve"
		width={256}
		height={256}
		viewBox="0 -0.09 122.88 122.88"
		className={className}
		{...props}
	>
		<path
			d="M.18 0h44.63v44.45H.18V0zM111.5 111.5h11.38v11.2H111.5v-11.2zm-21.87-.02h11.38v10.67H78.25v-21.82h11.02V89.27h11.21V67.22h11.38v10.84h10.84v11.2h-10.84v11.2H89.63v11.02zM55.84 89.09h11.02v-11.2H56.2v-11.2h10.66v-11.2H56.02v11.2H44.63v-11.2h11.2V22.23h11.38v33.25h11.02v11.2h10.84v-11.2h11.38v11.2H89.63v11.2H78.25v22.05H67.22v22.23H55.84V89.09zm55.47-33.61h11.38v11.2h-11.38v-11.2zm-88.9 0h11.38v11.2H22.41v-11.2zm-22.23 0h11.38v11.2H.18v-11.2zM55.84 0h11.38v11.2H55.84V0zM0 78.06h44.63v44.45H0V78.06zm10.84 10.8h22.95v22.86H10.84V88.86zM78.06 0h44.63v44.45H78.06V0zm10.85 10.8h22.95v22.86H88.91V10.8zm-77.89 0h22.95v22.86H11.02V10.8z"
			style={{
				fillRule: "evenodd",
				clipRule: "evenodd",
			}}
		/>
	</svg>
);
