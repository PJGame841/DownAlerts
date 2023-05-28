import { useEffect, useState } from "react";
import Check from "./components/check";
import Checkbox from "./components/checkbox";

function App() {
	const [error, setError] = useState("");
	const [checks, setChecks] = useState([]);
	const [create, setCreate] = useState(false);
	const [canCreate, setCanCreate] = useState(false);

	const [newAddr, setNewAddr] = useState("");
	const [newPort, setNewPort] = useState("");
	const [newTimeout, setNewTimeout] = useState("");
	const [newAlert, setNewAlert] = useState(false);

	const [settings, setSettings] = useState({});

	const fetchAndSet = (url, options, setter) => {
		fetch(url, options)
			.then((response) =>
				response.status !== 200
					? setError("Unable to connect to the API !") || { data: [] }
					: response.json()
			)
			.then((data) => setter(data.data))
			.catch((error) => setError(error.message));
	};

	const getChecks = () => fetchAndSet("/api/check", {}, setChecks);
	const getSettings = () => fetchAndSet("/api/settings", {}, setSettings);

	useEffect(() => {
		setInterval(getChecks, 2000);
		getSettings();
		// eslint-disable-next-line
	}, []);

	const deleteHandler = (id) => () =>
		fetchAndSet("/api/check?id=" + id, { method: "DELETE" }, setChecks);

	const submitHandler = (e) => {
		setCreate(false);

		fetchAndSet(
			"/api/check/new",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					addr: newAddr,
					port: newPort,
					timeout: newTimeout,
					alert: newAlert,
				}),
			},
			setChecks
		);
	};

	const onAlertChange = (addr, port, alert) => (e) =>
		fetchAndSet(
			"/api/check?id=" + addr + ":" + port,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					alert: !alert,
				}),
			},
			setChecks
		);

	return (
		<div className="app">
			<div className="container mx-auto max-w-3xl">
				<h1 className="text-4xl font-medium mt-10 mb-2">DownAlerts</h1>
				<div className="mb-10"></div>
				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
						<strong className="font-bold">Error!</strong>{" "}
						<span className="block sm:inline">{error}</span>
					</div>
				)}
				<div className="shadow-md rounded-lg bg-white overflow-hidden">
					<div className="flex flex-row flex-auto items-center p-3 px-5 border border-b-2 border-gray-100">
						<div className="flex-grow">
							<p className="text-2xl font-medium">Checks</p>
						</div>
						<div className="flex-shrink-0">
							<button
								className="hover:bg-red-800 hover:border-red-800 hover:text-white text-gray-700 border-2 border-gray-100 py-2 px-4 rounded inline-flex items-center transition"
								onClick={() => setCreate(true)}
							>
								<svg
									inline=""
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-4 mr-2"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									></path>
								</svg>{" "}
								<span className="text-sm">New</span>
							</button>
						</div>
					</div>
					<div>
						{checks.map((check, id) => (
							<Check
								key={id}
								check={check}
								onAlertChange={onAlertChange(
									check.addr,
									check.port,
									check.alert
								)}
								onDelete={deleteHandler(check.addr + ":" + check.port)}
							></Check>
						))}
					</div>

					{create && (
						<div className="fixed z-10 inset-0 overflow-y-auto">
							<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
								<div
									aria-hidden="true"
									className="fixed inset-0 transition-opacity"
								>
									<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
								</div>{" "}
								<span
									aria-hidden="true"
									className="hidden sm:inline-block sm:align-middle sm:h-screen"
								>
									&ZeroWidthSpace;
								</span>{" "}
								<div
									role="dialog"
									aria-modal="true"
									aria-labelledby="modal-headline"
									className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
								>
									<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
										<div className="sm:flex sm:items-start">
											<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-800 sm:mx-0 sm:h-10 sm:w-10">
												<svg
													inline=""
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													className="h-6 w-6 text-white"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														d="M12 6v6m0 0v6m0-6h6m-6 0H6"
													></path>
												</svg>
											</div>{" "}
											<div className="flex-grow mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
												<h3
													id="modal-headline"
													className="text-lg leading-6 font-medium text-gray-900"
												>
													New check
												</h3>{" "}
												<div className="mt-2">
													<p className="text-sm text-gray-500">
														<input
															type="text"
															name="addr"
															placeholder="Address"
															className="rounded p-2 border-2 border-gray-100 focus:border-gray-200 outline-none w-full"
															value={newAddr}
															onChange={(e) => {
																setNewAddr(e.target.value);
																if (newAddr !== "" && newPort !== "") {
																	setCanCreate(true);
																} else {
																	setCanCreate(false);
																}
															}}
														/>
													</p>
												</div>
												<div className="mt-2">
													<p className="text-sm text-gray-500">
														<input
															type="number"
															name="port"
															placeholder="Port"
															className="rounded p-2 border-2 border-gray-100 focus:border-gray-200 outline-none w-full"
															value={newPort}
															onChange={(e) => {
																setNewPort(e.target.value);
																if (newAddr !== "" && newPort !== "") {
																	setCanCreate(true);
																} else {
																	setCanCreate(false);
																}
															}}
														/>
													</p>
												</div>
												<div className="mt-2">
													<p className="text-sm text-gray-500">
														<input
															type="number"
															name="timeout"
															placeholder="Timeout (ms)"
															className="rounded p-2 border-2 border-gray-100 focus:border-gray-200 outline-none w-full"
															value={newTimeout}
															onChange={(e) => {
																setNewTimeout(e.target.value);
																if (newAddr !== "" && newPort !== "") {
																	setCanCreate(true);
																} else {
																	setCanCreate(false);
																}
															}}
														/>
													</p>
												</div>
												<div className="mt-4 flex flex-row">
													<p className="text-sm text-gray-800 mr-2">
														Discord alert ?
													</p>
													<Checkbox
														title="Alert ?"
														checked={newAlert}
														onClick={() => {
															setNewAlert(!newAlert);
															if (newAddr !== "" && newPort !== "") {
																setCanCreate(true);
															} else {
																setCanCreate(false);
															}
														}}
													/>
												</div>
												<div className="mt-2"></div>
											</div>
										</div>
									</div>{" "}
									<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
										<button
											type="button"
											className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
												canCreate
													? "bg-red-800 hover:bg-red-700 focus:outline-none"
													: "bg-gray-200 cursor-not-allowed"
											} text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
											disabled={!canCreate}
											onClick={submitHandler}
										>
											Create
										</button>{" "}
										<button
											type="button"
											className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
											onClick={() => setCreate(false)}
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
				<div className="mb-10"></div>
				<div className="shadow-md rounded-lg bg-white overflow-hidden">
					<div className="flex flex-row flex-auto items-center p-3 px-5 border border-b-2 border-gray-100">
						<div className="flex-grow">
							<p className="text-2xl font-medium">Settings</p>
						</div>
						<div className="flex-shrink-0">
							<button
								className="hover:bg-red-800 hover:border-red-800 hover:text-white text-gray-700 border-2 border-gray-100 py-2 px-4 rounded inline-flex items-center transition"
								onClick={() => {}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 30 30.000001"
									inline=""
									fill="none"
									stroke="currentColor"
									className="w-4 mr-2"
								>
									<defs>
										<clipPath id="id1">
											<path
												d="M 2.328125 4.222656 L 27.734375 4.222656 L 27.734375 24.542969 L 2.328125 24.542969 Z M 2.328125 4.222656 "
												clipRule="nonzero"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
											></path>
										</clipPath>
									</defs>
									<g clipPath="url(#id1)">
										<path
											d="M 27.5 7.53125 L 24.464844 4.542969 C 24.15625 4.238281 23.65625 4.238281 23.347656 4.542969 L 11.035156 16.667969 L 6.824219 12.523438 C 6.527344 12.230469 6 12.230469 5.703125 12.523438 L 2.640625 15.539062 C 2.332031 15.84375 2.332031 16.335938 2.640625 16.640625 L 10.445312 24.324219 C 10.59375 24.472656 10.796875 24.554688 11.007812 24.554688 C 11.214844 24.554688 11.417969 24.472656 11.566406 24.324219 L 27.5 8.632812 C 27.648438 8.488281 27.734375 8.289062 27.734375 8.082031 C 27.734375 7.875 27.648438 7.679688 27.5 7.53125 Z M 27.5 7.53125 "
											fillOpacity="1"
											fillRule="nonzero"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
										></path>
									</g>
								</svg>{" "}
								<span className="text-sm">Save</span>
							</button>
						</div>
					</div>
					<div>
						{Object.keys(settings).map((settingName) => (
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
									</div>
									<div className="flex-grow">
										<div className="text-gray-700">
											<p className="inline-block border-t-2 border-b-2 border-transparent">
												{settingName}
											</p>
										</div>
										<div className="text-gray-400 text-xs">
											<span title="Description">
												{settings[settingName].description}
											</span>
											{settings[settingName].protected && (
												<span title="Protected">
													{`
													·
													`}
													Protected setting
												</span>
											)}
										</div>
									</div>
									<div className="text-right text-gray-400">
										<div className="mt-2">
											<p className="text-sm text-gray-500">
												<input
													type="text"
													name="addr"
													placeholder="Address"
													className="rounded p-2 border-2 border-gray-100 focus:border-gray-200 outline-none w-full"
													value={newAddr}
													onChange={(e) => {
														setNewAddr(e.target.value);
														if (newAddr !== "" && newPort !== "") {
															setCanCreate(true);
														} else {
															setCanCreate(false);
														}
													}}
												/>
											</p>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<p className="text-center m-10 text-gray-300 text-xs">
				Made by{" "}
				<a
					target={"_blank"}
					rel="noreferrer"
					href="https://github.com/PJGame841"
					className="hover:underline"
				>
					PJGame
				</a>
			</p>
		</div>
	);
}

export default App;
