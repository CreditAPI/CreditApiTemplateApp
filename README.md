![CreditAPI LOGO](https://creditapi.ru/assets/img/favicon.png)
https://creditapi.ru
# CreditApiTemplateApp
## Шаблон сайта по выдаче онлайн-кредитов при помощи сервиса credit-api.ru

### Настройки

Перед началом работы необходимо указать настройки в файле `src/assets/js/settings.js`. 
    CreditApiHost // Сервер creditAPI, по умолчанию sandbox -  https://sbapi.creditapi.ru/api
    CreditApiOrgId // ID  организации доступен в [личном кабинете](https://creditapi.ru/sandbox/#/cso/my)
    MyUrl // доменное имя вашего сайта. Необходимо для переадресации пользователя после привязки карты
    HomeLink // Ссылка на домашнюю страницу вашего сайта (при размещении личного кабинете на поддомене)

### Разработка 

После клонирования репозитория запустите `ng serve --configuration=ru` для старта сервера разработки. Перейдите по адресу `http://localhost:4200/` для просмотра шаблона.


### Кастомизация

Основные настройки цветов доступны в файле `styles.csss`

```scss
$theme-colors: (
  "primary": #C5CFD1, //Основной цвет элементов управления
  "secondary": #D6DCDE, //Второй цвет 
  "light": #fff // Цвет подложки
);
$enable-gradients:true; //использование градиентов
$my-body-bg: linear-gradient(var(--light),#fff);  //Цвет фона (может быть изображением)
$my-header-bg: transparent; //цвет заголовка
$my-footer-bg: transparent; // цвет подвала
$my-body-font: 1rem/1.5 var(--font-family-sans-serif); //шрифт по умолчанию
```

Также вы можете использовать [темы](https://themes.getbootstrap.com/) для Bootstrap

## Размещение личного кабинета на поддомене

Данный шаблон может выполнять роль полноценного сайта. Шаблон главной страницы находится в файле /src/app/mainpage.

Также шаблон может использоваться только в роли личного кабинета на подддомене (например, cabinet.yoursite.ru). Для этого необходимо задать адрес главной страницы сайта в параметре `HomeLink` (в среде разработки) или переменную окружения `HOMELINK` (при использовании контейнера Docker)

## Build

Запустите `ng build --prod --configuration=ru` для создания версии для публикации. Готовое приложение будет доступно в папке `dist/`.

## Docker

Запустите `docker build -f ./Dockerfile` для создания контейнера Docker. 
При запуске контейнера не забудьте указать переменные окружения `CREDIT_API_HOST`, `CREDIT_API_ORG` и `MY_URL`

#### Используемая среда

Angular CLI: 9.1.0
Node: 13.11.0
Bootstrap: 4.0
