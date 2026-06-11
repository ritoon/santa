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

	// data, err := os.ReadFile("../../front/public/products.json")
	// if err != nil {
	// 	return nil, fmt.Errorf("failed to read products data: %w", err)
	// }
	// var products []model.Product
	// err = json.Unmarshal(data, &products)
	// if err != nil {
	// 	return nil, fmt.Errorf("failed to parse products data: %w", err)
	// }
	// return products, nil
}
