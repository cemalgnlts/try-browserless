export async function shareCode(code) {
	const req = await fetch("/api/share", {
		method: "POST",
		body: code
	});

	const key = await req.text();

	if(!req.ok()) throw key;

	return `${location.origin}?share=${key}`;
}

export async function findCode(code) {
	const req = await fetch(`/api/share/${code}`);
	const code = await req.text();

	if(!req.ok()) throw code;

	return code;
}
