import Checkbox from "./checkbox";

export default function Check({check, onAlertChange, onDelete}) {
	return (
		<div className="relative overflow-hidden border-b border-gray-100 border-solid">
			<div className="relative p-5 z-10 flex flex-row">
				<div className="h-10 w-10 mr-5 rounded-full bg-gray-50 relative">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="w-6 m-2 text-gray-300"
					>
						<path
							fillRule="evenodd"
							d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
							clipRule="evenodd"
						></path>
					</svg>
					{check.status && (
						<div>
							<div className="animate-ping w-4 h-4 p-1 bg-red-100 rounded-full absolute -bottom-1 -right-1"></div>{" "}
							<div className="w-2 h-2 bg-red-800 rounded-full absolute bottom-0 right-0"></div>
						</div>
					)}
				</div>
				<div className="flex-grow">
					<div className="text-gray-700">
						<p className="inline-block border-t-2 border-b-2 border-transparent">
							{check.addr}:{check.port}
						</p>
					</div>
					<div className="text-gray-400 text-xs">
						<span title="Timeout">{check.timeout || 5000} ms</span>
						<span title="Status">
							{`
						·
						`}
							{check.status ? "Up" : "Down"}
						</span>
						{
							check.status ? (
								<span title="Ping">
									{`
								·
								`}
									{Math.round(check.ping)} ms
								</span>
							) : (
								<span title="Reason">
									{`
								·
								`}
									{check.reason}
								</span>
							)
						}
					</div>
				</div>
				<div className="text-right text-gray-400">
					<Checkbox
						title="Alert on down ?"
						checked={check.alert}
						onClick={onAlertChange}
					/>
					<button
						title="Delete entry"
						className="align-middle bg-gray-100 hover:bg-red-800 hover:text-white p-2 rounded transition"
						onClick={onDelete}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-5"
						>
							<path
								fillRule="evenodd"
								d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
								clipRule="evenodd"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
	)
}