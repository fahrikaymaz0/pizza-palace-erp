export default function handler(_req, res) {
	return res.status(200).json({
		success: true,
		test_cards: [
			{ brand: 'visa', number: '4355084355084358', cvv: '000', expiry: '12/30' },
			{ brand: 'mastercard', number: '5406675406675403', cvv: '000', expiry: '12/30' },
			{ brand: 'troy', number: '9792030394440796', cvv: '000', expiry: '12/30' },
		],
	});
}





