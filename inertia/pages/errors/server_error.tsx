interface ServerErrorProps {
	error: Error;
}

export default function ServerError({ error }: ServerErrorProps) {
	return (
		<div className="container">
			<div className="title">Server Error</div>

			<span>{error.message}</span>
		</div>
	);
}
