export default function handler(req, res) {
	// CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	if (req.method === 'OPTIONS') return res.status(200).end();

	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	try {
		const envOk = Boolean(
			process.env.PAYTR_MERCHANT_ID &&
			process.env.PAYTR_MERCHANT_KEY &&
			process.env.PAYTR_MERCHANT_SALT
		);

		// Basit sahte token üretimi (test amaçlı)
		const token =
			'TEST_' + Math.random().toString(36).slice(2) + Date.now().toString(36);

		return res.status(200).json({
			success: true,
			api_type: 'Direkt API (Simulated)',
			is_simulated: !envOk,
			token,
			debug_info: {
				token_generated: token,
				hash_string: 'simulated_hash_for_demo',
				response_text: envOk ? 'ENV OK - simulated token' : 'ENV MISSING - simulated token',
			},
		});
	} catch (e) {
		return res.status(500).json({ success: false, error: e.message });
	}
}


