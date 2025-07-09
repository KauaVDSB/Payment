document.getElementById('buyButton').addEventListener('click', async () => {
    try {
        const productData = {
            id: 'product-001',
            title: 'Produto de Teste #1',
            unit_price: 10.50, // Use ponto para decimais em JavaScript
            quantity: 1,
            picture_url: 'https://via.placeholder.com/150' // URL de uma imagem de placeholder
        };

        const response = await fetch('/api/create-preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errorBody = await response.json(); // Tenta ler o corpo do erro como JSON
            console.error('Erro detalhado da API:', errorBody);
            throw new Error(`Erro ao criar preferência de pagamento. Status: ${response.status} - Mensagem: ${errorBody.message || 'Erro desconhecido'}`);
        }

        const data = await response.json();
        
        if (data.init_point) {
            window.location.href = data.init_point;
        } else {
            alert('Não foi possível obter a URL de pagamento. Tente novamente.');
        }

    } catch (error) {
        console.error('Erro na compra:', error);
        alert('Ocorreu um erro ao processar sua compra. Por favor, verifique o console para mais detalhes.');
    }
});