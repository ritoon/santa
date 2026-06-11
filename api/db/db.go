package db

import "apisanta/model"

type DB interface {
	// products
	ProductDB
	// users
	UserDB
}

type ProductDB interface {
	GetProducts() ([]model.Product, error)
	GetProductByID(id uint) (model.Product, error)
	CreateProduct(product *model.Product) error
	UpdateProduct(product *model.Product) error
	DeleteProduct(id uint) error
}

type UserDB interface {
	GetUsers() ([]model.User, error)
	GetUserByEmail(email string) (model.User, error)
	CreateUser(user *model.User) error
}
