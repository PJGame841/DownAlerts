

export default function Checkbox ({ onClick, checked, title }) {
	return (<button
		title={title}
		className={`inline-block align-middle rounded-full w-10 h-6 mr-1 ${
			checked
				? "bg-red-800 hover:bg-red-700"
				: "bg-gray-200 hover:bg-gray-300"
		} cursor-pointer transition-all`}
		onClick={onClick}
	>
		<div
			className={`rounded-full w-4 h-4 m-1 ${
				checked ? "ml-5" : ""
			} bg-white`}
		>
		</div>
	</button>)
}