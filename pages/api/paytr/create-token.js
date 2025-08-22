export default function handler(req, res) {
	if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
	const token = 'TOKEN_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
	return res.status(200).json({ success: true, token });
}





