package db

import "apisanta/model"

type DB interface {
	// Define your database methods here, e.g.:
	GetProducts() ([]model.Product, error)
	GetUsers() ([]model.User, error)
	Login(username, password string) (model.User, error)
	Register(user model.User) error
}
