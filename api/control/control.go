package control

import (
	"apisanta/model"
	"encoding/json"
	"fmt"
	"os"
)

func New() *Control {
	return &Control{}
}

type Control struct{}

func (c *Control) Register(u *model.User) error {
	// save user to database
	// send confirmation email
	return nil
}

func (c *Control) GetProducts() ([]model.Product, error) {
	data, err := os.ReadFile("../../front/public/products.json")
	if err != nil {
		return nil, fmt.Errorf("failed to read products data: %w", err)
	}
	var products []model.Product
	err = json.Unmarshal(data, &products)
	if err != nil {
		return nil, fmt.Errorf("failed to parse products data: %w", err)
	}
	return products, nil
}
