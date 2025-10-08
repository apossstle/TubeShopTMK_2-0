console.log('🔧 cart.js загружен!');

// 🔥 ДОБАВИЛ ГЛОБАЛЬНУЮ ПЕРЕМЕННУЮ
let cartItems = [];

// Переопределим функцию для дебага
async function calculateDiscountOnBackend(totalPrice, totalTons) {
    console.log('🔄 Вызов calculateDiscountOnBackend:', { totalPrice, totalTons });

    try {
        const response = await fetch('/api/products/calculate-discount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                totalPrice: totalPrice,
                totalTons: totalTons
            })
        });

        console.log('📡 Ответ от сервера:', response.status, response.statusText);

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Результат скидки:', result);
            return result;
        } else {
            console.error('❌ Ошибка сервера:', response.status);
            throw new Error('Ошибка расчета скидки');
        }
    } catch (error) {
        console.error('💥 Ошибка в calculateDiscountOnBackend:', error);
        return calculateDiscountClient(totalPrice, totalTons);
    }
}

// Функции для страницы cart.html
async function loadCart() {
    try {
        const response = await fetch('/api/cart');
        cartItems = await response.json(); // 🔥 СОХРАНЯЕМ В ГЛОБАЛЬНУЮ ПЕРЕМЕННУЮ
        await displayCart(cartItems);
    } catch (error) {
        console.error('Ошибка при загрузке корзины:', error);
        document.getElementById('cart-container').innerHTML =
            '<div class="error">❌ Ошибка загрузки корзины</div>';
    }
}

// Клиентский расчет скидки (на случай если бэкенд недоступен)
function calculateDiscountClient(totalPrice, totalTons) {
    const discountRules = [
        { minTons: 10, discountPercent: 3 },
        { minTons: 50, discountPercent: 7 },
        { minTons: 100, discountPercent: 10 },
        { minTons: 200, discountPercent: 15 }
    ];

    // Находим подходящее правило скидки
    const applicableRule = discountRules
        .filter(rule => totalTons >= rule.minTons)
        .sort((a, b) => b.minTons - a.minTons)[0];

    const discountPercent = applicableRule ? applicableRule.discountPercent : 0;
    const discountAmount = totalPrice * (discountPercent / 100);

    // Находим следующую скидку
    const nextRule = discountRules
        .filter(rule => rule.minTons > totalTons)
        .sort((a, b) => a.minTons - b.minTons)[0];

    const nextDiscount = nextRule ? {
        tonsNeeded: nextRule.minTons - totalTons,
        discountPercent: nextRule.discountPercent
    } : null;

    return {
        discountPercent,
        discountAmount,
        finalPrice: totalPrice - discountAmount,
        nextDiscount
    };
}

async function displayCart(cartItems) {
    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;

    addCartStyles();

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart">🛒 Корзина пуста</div>';
        return;
    }

    let totalPrice = 0;
    let totalTons = 0;

    // Считаем общие суммы
    cartItems.forEach(item => {
        totalPrice += item.price * item.quantityTons;
        totalTons += item.quantityTons;
    });

    console.log('🔍 ДЕБАГ: перед расчетом скидки', { totalPrice, totalTons });

    // Получаем скидку
    const discountResult = await calculateDiscountOnBackend(totalPrice, totalTons);

    console.log('🔍 ДЕБАГ: результат скидки', discountResult);

    // 🔥 УБРАЛ КНОПКИ ИЗ КОРЗИНЫ - оставил только товары
    const cartHTML = `
        <div class="cart-items">
            ${cartItems.map(item => {
        const itemPrice = item.price * item.quantityTons;

        // 🔥 ДОБАВИЛ СКИДКИ ДЛЯ КАЖДОГО ТОВАРА
        const itemDiscount = calculateDiscountClient(itemPrice, item.quantityTons);

        return `
                    <div class="cart-item">
                        <div class="cart-item-header">
                            <div class="cart-item-name">${item.productName}</div>
                            ${itemDiscount.discountPercent > 0 ?
                `<span class="discount-badge">-${itemDiscount.discountPercent}%</span>` : ''}
                        </div>
                        <div class="cart-item-quantity">Количество: ${item.quantityTons} т</div>
                        <div class="cart-item-price">
                            ${itemDiscount.discountPercent > 0 ? `
                                <div style="color: #27ae60; font-weight: bold;">
                                    Цена со скидкой: ${itemDiscount.finalPrice.toFixed(2)} руб
                                </div>
                                <div style="text-decoration: line-through; color: #666;">
                                    Было: ${itemPrice.toFixed(2)} руб
                                </div>
                            ` : `
                                Цена: ${itemPrice.toFixed(2)} руб
                            `}
                        </div>
                        <button class="button button-secondary" onclick="removeFromCart('${item.productId}')" style="margin-top: 10px;">
                            ❌ Удалить
                        </button>
                    </div>
                `;
    }).join('')}
        </div>
        <div class="cart-total">
            <h3>ИТОГО:</h3>
            <div>Сумма: ${totalPrice.toFixed(2)} руб</div>
            <div style="color: green;">Скидка: ${discountResult.discountPercent}%</div>
            <div style="color: green;">Сумма скидки: -${discountResult.discountAmount.toFixed(2)} руб</div>
            <div style="font-weight: bold; font-size: 20px;">К оплате: ${discountResult.finalPrice.toFixed(2)} руб</div>
            
            ${discountResult.nextDiscount ? `
                <div style="background: #fff5e6; padding: 10px; margin: 10px 0; border-radius: 6px;">
                    🎯 До скидки ${discountResult.nextDiscount.discountPercent}% нужно еще ${discountResult.nextDiscount.tonsNeeded.toFixed(2)} т
                </div>
            ` : ''}
        </div>
    `;

    cartContainer.innerHTML = cartHTML;
}

// Функция для добавления стилей
function addCartStyles() {
    if (document.getElementById('cart-styles')) return;

    const styles = `
        <style id="cart-styles">
            .cart-item {
                background: white;
                border: 2px solid #ff6600;
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
                box-shadow: 0 2px 8px rgba(255, 102, 0, 0.1);
            }

            .cart-item-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;
            }

            .cart-item-name {
                font-size: 16px;
                font-weight: 700;
                color: #000000;
                flex: 1;
            }

            .discount-badge {
                background: #27ae60;
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
            }

            .cart-item-quantity {
                font-size: 14px;
                color: #333333;
                margin-bottom: 12px;
                background: #fff5e6;
                padding: 8px 12px;
                border-radius: 6px;
                border-left: 3px solid #ff6600;
            }

            .cart-item-price {
                font-size: 16px;
                font-weight: 600;
                color: #ff6600;
                margin-bottom: 12px;
            }

            .empty-cart {
                text-align: center;
                padding: 40px;
                color: #666;
                background: #f8f9fa;
                border: 2px dashed #ff6600;
                border-radius: 12px;
                margin: 20px 0;
            }

            .error {
                text-align: center;
                padding: 40px;
                color: #ff3333;
                background: #ffe6e6;
                border: 1px solid #ff3333;
                border-radius: 8px;
                margin: 20px 0;
            }
        </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
}

async function removeFromCart(productId) {
    try {
        const response = await fetch(`/api/cart/${productId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            await loadCart();
        }
    } catch (error) {
        console.error('Ошибка при удалении из корзины:', error);
        alert('❌ Ошибка при удалении товара');
    }
}

async function clearCart() {
    if (!confirm('❓ Вы уверены, что хотите очистить корзину?')) return;

    try {
        const response = await fetch('/api/cart/clear', {
            method: 'POST'
        });

        if (response.ok) {
            await loadCart();
        }
    } catch (error) {
        console.error('Ошибка при очистке корзины:', error);
        alert('❌ Ошибка при очистке корзины');
    }
}

// 🔥 ФУНКЦИИ ДЛЯ ФОРМЫ ЗАКАЗА - ИСПРАВЛЕНЫ
function openOrderForm() {
    console.log('openOrderForm вызвана, cartItems:', cartItems);
    if (!cartItems || cartItems.length === 0) {
        alert('🛒 Корзина пуста! Добавьте товары перед оформлением заказа.');
        return;
    }
    document.getElementById('orderModal').style.display = 'block';
}

function closeOrderForm() {
    document.getElementById('orderModal').style.display = 'none';
}

async function submitOrderForm(event) {
    event.preventDefault();
    console.log('submitOrderForm вызвана');

    const formData = {
        fullName: document.getElementById('fullName').value,
        inn: document.getElementById('inn').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        comment: document.getElementById('comment').value
    };

    // Простая валидация
    if (!formData.fullName || !formData.inn || !formData.phone || !formData.email) {
        alert('❌ Заполните все обязательные поля!');
        return;
    }

    // Валидация ИНН
    if (!/^\d{10}$|^\d{12}$/.test(formData.inn)) {
        alert('❌ ИНН должен содержать 10 или 12 цифр!');
        return;
    }

    try {
        // Рассчитываем итоговую сумму
        let totalPrice = 0;
        let totalTons = 0;
        cartItems.forEach(item => {
            totalPrice += item.price * item.quantityTons;
            totalTons += item.quantityTons;
        });

        const discountResult = await calculateDiscountOnBackend(totalPrice, totalTons);

        const orderData = {
            customer: formData,
            items: cartItems,
            totalTons: totalTons,
            totalPrice: totalPrice,
            discountPercent: discountResult.discountPercent,
            discountAmount: discountResult.discountAmount,
            finalPrice: discountResult.finalPrice,
            orderDate: new Date().toISOString()
        };

        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            const result = await response.json();

            // ✅ ОТПРАВКА ДАННЫХ В TELEGRAM
            if (window.Telegram && Telegram.WebApp) {
                Telegram.WebApp.showPopup({
                    title: '✅ Заказ оформлен!',
                    message: `Номер заказа: ${result.orderId}\nСумма: ${discountResult.finalPrice.toFixed(2)} руб\n${result.message}`,
                    buttons: [{ type: 'ok' }]
                }, () => {
                    Telegram.WebApp.close();
                });
            } else {
                alert(`✅ ${result.message}\nНомер заказа: ${result.orderId}\nСумма: ${discountResult.finalPrice.toFixed(2)} руб`);
            }

            await clearCart();
            closeOrderForm();
        } else {
            const errorData = await response.json();
            alert('❌ Ошибка: ' + (errorData.errors ? errorData.errors.join(', ') : 'Неизвестная ошибка'));
        }
    } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        alert('❌ Ошибка сети при оформлении заказа');
    }
}

// Инициализация для cart.html
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔄 Загружаем корзину...');
    if (document.getElementById('cart-container')) {
        loadCart();
    }

    // Закрытие модального окна при клике вне его
    document.getElementById('orderModal')?.addEventListener('click', function (e) {
        if (e.target === this) {
            closeOrderForm();
        }
    });
});