# Storefront Backend Project

## Table of Contents

* [Description](#Description)
* [Prerequisites](#Prerequisites)
* [Instructions](#Instructions)
* [Documentation](#Documentation)

## Description

This Project is the second project in the [egFWD](https://egfwd.com/) initiative (full-stack nanodegree).
It represents a simple store API endpoints where users can signup, add items to carts and place orders.
It features the use of **Typescript**, **PostgreSQL**, **Jasmine** and **Eslint**.

## Prerequisites
Your machine must have the following installed on it:
- [Node/NPM](https://nodejs.org/en/download/) (v16 or higher)
- [Docker](https://www.docker.com/products/docker-desktop)

## Instructions

### 1. Install Dependencies
After Cloning the project, head inside the project folder and run
```
npm install
```

### 2.  DB Creation and Migrations
```
docker-compose up
cp .env.example .env
npm run migrate:up
```
### 3. Starting the project
```
npm start
```

### 4. Running the tests
```
npm test
```

Any by now you should be able to go to `localhost:3000` to test that everything is working as expected.

## Documentation
You can find everything related to the endpoints alongside examples of the data expected from your side in `postman_collection.json`, and a simplified version of it in `REQUIREMENTS.md`.