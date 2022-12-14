# [來去農村住一晚](https://mighty-waters-62467.herokuapp.com/)

# Demo

![Demo](./image/readme/Demo.gif)

此 [農宿景點資訊網](https://mighty-waters-62467.herokuapp.com/) 為初學約四個月之新手作品，未臻完備之處尚待學習與改進，如有建議請不吝提出，感謝您的賜教。

email: ad80352@gmail.com

&emsp;

> 資料來源：[政府資料開放平台__來到農村住一晚](https://data.gov.tw/dataset/6413)

&emsp;

# Features

- RWD 響應式頁面
- 使用者驗證（註冊／登入／登出）、授權（新增／編輯／刪除）
- 依據使用者行為產生對應的 Flash
- 將地址轉換為座標並顯示於 Cluster Map
- RESTful API

### Normal Route

| Method | Route |      |
| ------ | ----- | ---- |
| GET    | /     | 首頁 |


### Farm Route

| Method | Route             |                      |
| ------ | ----------------- | -------------------- |
| GET    | /farms            | 查看所有景點         |
| POST   | /farms            | 新增景點             |
| GET    | /farms/new        | Request 新增景點頁面 |
| GET    | /farms/clusterMap | 查看景點分布位置地圖 |
| GET    | /farms/:id        | 查看景點資訊         |
| PUT    | /farms/:id        | 更新景點資訊         |
| DELETE | /farms/:id        | 刪除景點             |
| GET    | /farms/:id/edit   | Request 編輯景點頁面 |


### Review Route

| Method | Route                        |          |
| ------ | ---------------------------- | -------- |
| POST   | /farms/:id/reviews           | 新增評論 |
| DELETE | /farms/:id/reviews/:reviewId | 刪除評論 |

### User Route

| Method | Route     |                                 |
| ------ | --------- | ------------------------------- |
| GET    | /register | Request 註冊頁面                |
| POST   | /register | 新增並儲存使用者到資料庫        |
| GET    | /login    | Request 登入頁面                |
| POST   | /login    | 以 Session 驗證身份並登入       |
| GET    | /logout   | 移除 Session 中的登入資訊並登出 |

&emsp;

# Technologies

## Frontend

- HTML
- CSS / SCSS
- JavaScript
- Promise / RESTful API / JSON

## Backend

- Node.js
- Express

## Design Pattern

- MVC

## Date Base

- MongoDB

## Template

- EJS
