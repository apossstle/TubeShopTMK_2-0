## Описание проекта

Проект представляет собой сайт, предназначенный для компаний металлургической отрасли, занимающихся производством и продажей трубной продукции.

### Основные возможности приложения:
- Каталог товаров с возможностью сортировки и фильтрации
- Корзина покупок с сохранением выбранных позиций

---

## Структура проекта

### Фронтенд
Фронтенд реализован на JavaScript и HTML. Для повышения производительности и удобства разработки используются современные библиотеки и фреймворки.
├── Frontend/
│   ├── index.html
│   ├── cart.js
│   ├── cart.html
│   ├── nginx.conf

### Бэкенд
Бэкенд написан на C#. Используется инфраструктура ASP.NET Core для обработки запросов и взаимодействия с базой данных.
backend/
TelegramMetalTubeApp/
├── Backend/ (C# ASP.NET Core)
│   ├── Controllers/
│   │   ├── CartController.cs
│   │   ├── OrdersController.cs
│   │   └── ProductsController.cs
│   ├── Models/
│   │   ├── CartItem.cs
│   │   ├── CustomerInfo.cs
│   │   └── OrderItem.cs
│   │   └── OrderRequest.cs
│   │   └── Product.cs
│   ├── Data/
│   │   ├── bot.json
│   │   ├── nomenclature.json
│   │   ├── prices.json
│   │   ├── remnants.json
│   │   ├── stocks.json
│   │   ├── types.json
│   ├── Services/
│   │   ├── DiscountService.cs
│   │   ├── DatService.cs
│   │   └── CartService.cs
├── Frontend/
│   ├── index.html
│   ├── cart.js
│   ├── cart.html
│   ├── nginx.conf
├── README.md
├── appsettings.Development.json
├── appsettings.json
├── docker-compose.yml
├── Program.cs
├── TubeShopBackend.csproj
├── TubeShopBackend.csproj.user
├── TubeShopBackend.http
└── TubeShopBackend.sln

---

## Установка и запуск

### Инструкция по установке
1. Клонируйте репозиторий:
https://github.com/apossstle/TubeShopTMK_2-0

2. Запустите сервер:
dotnet run

3. Откройте приложение в браузере:
http://localhost:5216

---

## Авторство

Автор проекта: Чернышов Александр Васильевич

Контактная почта: sashred1@gmail.com


---

Спасибо за использование нашего приложения!

При возникновении вопросов обращайтесь к нам.
