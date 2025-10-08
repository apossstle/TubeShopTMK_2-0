# Архитектура приложения "ТМК Каталог Труб"

## 🎨 Фронтенд
Фронтенд реализован на **JavaScript и HTML** с использованием современных подходов к разработке. Для обеспечения высокой производительности и удобства пользователя применены оптимизированные алгоритмы рендеринга и интерактивные элементы интерфейса.

**Структура фронтенда:**
Frontend/index.html - Главная страница каталога товаров
Frontend/cart.js - Логика работы корзины и обработки заказов
Frontend/cart.html - Страница корзины покупок
Frontend/nginx.conf - Конфигурация веб-сервера для развертывания

## ⚙️ Бэкенд
Бэкенд разработан на **C#** с использованием **ASP.NET Core** - мощного фреймворка для создания высокопроизводительных веб-приложений. Архитектура обеспечивает надежную обработку запросов, бизнес-логику и взаимодействие с данными.

**Структура проекта:**
Backend/TelegramMetalTubeApp/Backend/ (C# ASP.NET Core)
Controllers/CartController.cs - Управление корзиной покупок
Controllers/OrdersController.cs - Обработка заказов
Controllers/ProductsController.cs - Работа с каталогом товаров
Models/CartItem.cs - Элемент корзины
Models/CustomerInfo.cs - Информация о клиенте
Models/OrderItem.cs - Позиция заказа
Models/OrderRequest.cs - Запрос на оформление заказа
Models/Product.cs - Модель товара
Data/bot.json - Конфигурация бота
Data/nomenclature.json - Номенклатура товаров
Data/prices.json - Прайс-листы
Data/remnants.json - Остатки на складах
Data/stocks.json - Складские запасы
Data/types.json - Типы продукции
Services/DiscountService.cs - Расчет скидок
Services/DataService.cs - Работа с данными
Services/CartService.cs - Сервис корзины
Frontend/index.html - Главная страница каталога товаров
Frontend/cart.js - Логика работы корзины и обработки заказов
Frontend/cart.html - Страница корзины покупок
Frontend/nginx.conf - Конфигурация веб-сервера для развертывания
README.md - Документация проекта
appsettings.Development.json - Настройки разработки
appsettings.json - Основные настройки
docker-compose.yml - Конфигурация Docker
Program.cs - Точка входа приложения
TubeShopBackend.csproj - Конфигурация проекта
TubeShopBackend.csproj.user
TubeShopBackend.http - HTTP-запросы для тестирования
TubeShopBackend.sln - Решение Visual Studio

## 🚀 Ключевые особенности
- **Модульная архитектура** с четким разделением ответственности
- **RESTful API** для взаимодействия фронтенда и бэкенда
- **Поддержка Docker** для простого развертывания
- **Интеграция с Telegram** через Mini Apps
- **Система скидок** с гибкими правилами расчета
- **Реализация корзины** с конвертацией единиц измерения
