document.getElementById('buyButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/create-preference', 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: 'Produto Fantasma',
                    unit_price: 1.01,
                    quantity: 1,
                })
            }
        );

        if(!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro ao criar preferência de pagamento. ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if(data.init_point) {
            window.location.href = data.init_point;
        } else {
            alert('Não foi possível obter a URL de pagamento. Tente novamente.');
        }

    } catch(error) {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao processar sua compra. Por favor, tente novamente mais tarde.');
    }
});