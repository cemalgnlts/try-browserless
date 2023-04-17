export async function shareCode(name, code) {
	const req = await fetch(`/api/share?name=${name}`, {
		method: "POST",
		body: code
	});

	const key = await req.text();

	if (!req.ok) throw key;

	return `${location.origin}?share=${key}`;
}

export async function loadCode(code) {
	const req = await fetch(`/api/share/${code}`);
	const text = await req.text();

	if (!req.ok) throw text;

	return JSON.parse(text);
}
