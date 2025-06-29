import MercadoPago, { Preference } from '@src/index';

/**
 * Mercado Pago Preference.
 *
 * @see {@link https://www.mercadopago.com/developers/en/reference/preference/_checkout_preference/post Documentation }.
 */

const client = new MercadoPago({ accessToken: '<APP_USR-2543918129747986-062721-224b469b33f3c8e0161a94a4ccc9e811-2207360679>', options: { timeout: 5000 } });

const preference = new Preference(client);

preference.create({
	body: {
		items: [
			{
				id: 'teste-01',
				title: 'Produto Fantasma',
				quantity: 1,
				unit_price: 1.01
			}
		],
		notification_url: 'https://webhook.site/your-dummy-url'
	}
}).then(console.log).catch(console.log);