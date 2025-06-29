import { MercadoPagoConfig, Preference } from 'mercadopago';
document.getElementById('buyButton').addEventListener('click', async () => {
    try {        
        
        const client = new MercadoPagoConfig({
            accessToken: 'APP_USR-2543918129747986-062721-224b469b33f3c8e0161a94a4ccc9e811-2207360679'
        });
        
        
        const preference = new Preference(client);

        preference.create({
        body: {
            items: [
            {
                title: 'Produto Fantasma',
                quantity: 1,
                unit_price: 1.01,
            }
            ],
        }
        })
        .then(console.log)
        .catch(console.log);


        
        } catch(error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar sua compra. Por favor, tente novamente mais tarde.');
    }
});