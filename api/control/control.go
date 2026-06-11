package control

import (
	"apisanta/db"
	"apisanta/model"
)

func New(d db.DB) *Control {
	return &Control{db: d}
}

type Control struct {
	db db.DB
}

func (c *Control) Register(u *model.User) error {
	// save user to database
	// send confirmation email
	return nil
}

func (c *Control) GetProducts() ([]model.Product, error) {
	return c.db.GetProducts()
}
