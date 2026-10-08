# SecureShop — Modern Shopping Website

## 📌 Project Overview

SecureShop is a responsive e-commerce website prototype designed to demonstrate online shopping functionality and introduce web application security concepts.

Users can browse products, search and filter items, add products to a shopping cart, place demo orders, and view their order history. The project also includes a profile page and an admin-style product management interface.

## ✨ Features

* **Dashboard:** Overview of the shopping application.
* **Product Catalogue:** Browse and filter available products.
* **Search:** Find products by name.
* **Shopping Cart:** Add products, update quantities, and remove items.
* **Demo Checkout:** Simulate placing an order without real payments.
* **Order History:** View demo orders.
* **Profile:** View demo user information.
* **Admin Interface:** Demonstration of product catalogue management.
* **Responsive Design:** Supports modern desktop and mobile browsers.

## 🛠️ Technologies Used

* **HTML5** — Structures the website.
* **CSS3** — Provides styling and responsive layouts.
* **JavaScript** — Implements interactive features.
* **localStorage** — Saves demo data in the browser.

## 🚀 How to Run the Project

1. Download or clone this repository.
2. Locate the `index.html` file.
3. Open `index.html` in a modern web browser.
4. Explore the product catalogue and other demo features.

No additional installation is required for this front-end version.

## 🔐 Demo Admin Login

* **Email:** `admin@secureshop.test`
* **Password:** `admin123`

These credentials are for demonstration only. Do not use them for a real account or store actual passwords in client-side code.

## 🛡️ Security Testing

This project can serve as a starting point for learning about application security and OWASP ZAP.

**Important security limitations:**

* Authentication and admin checks implemented in browser-side JavaScript are not secure.
* Browser `localStorage` is not suitable for storing sensitive authentication data.
* This front-end prototype does not provide server-side authorization or database security.

For meaningful security testing, add a backend with server-side authentication, authorization, input validation, secure session management, and database protections. Then run OWASP ZAP against your own local test deployment and document the actual findings, fixes, and retest results.

Only scan applications you own or have permission to test.

## 📂 Project Structure

```text
SecureShop/
├── index.html
├── README.md
├── .gitignore
└── LICENSE
```

## 🔮 Future Enhancements

* Build a backend API.
* Integrate a database.
* Implement secure registration and login.
* Add server-side role-based access control.
* Improve input validation and error handling.
* Add automated tests.
* Perform authorized security scans and document remediation.

## 📄 License

This project is distributed under the MIT License. See the `LICENSE` file for details.

## 👨‍💻 Project Purpose

SecureShop is an educational prototype for learning front-end development, e-commerce workflows, and the fundamentals of web application security.
