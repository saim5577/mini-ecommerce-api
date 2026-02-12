# Mini E-Commerce API

## 1. Setup Instructions

1. Clone the repository:
   git clone https://github.com/saim5577/mini-ecommerce-api.git
   
2.go to the project folder
  cd mini-ecommerce-api

3.create a .env in the root folder
  type
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/mini_ecommerce
JWT_SECRET=secret123

4. run the server
    done

# tech stack used

.Node.js

.Express.js

.MongoDB (Mongoose)

.JWT Authentication

.bcryptjs for password hashing

.Postman for testing

# ER diagram given to the project folder 

# Key Architectural Decisions

.RESTful API design

.JWT for authentication & role-based authorization

.Transactions to maintain data integrity

.Admin role for product management

.Customer role for cart orders


Users with too many canceled orders may be blocked temporarily
