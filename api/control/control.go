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

// TODO:
// Création d'une fonction Login
// param in payload de login
// getUserByEmail
// valider si le password est ok
// créer un token de cession JWT
// utiliser cette package https://github.com/golang-jwt/jwt
// doc https://pkg.go.dev/github.com/golang-jwt/jwt/v5#example-NewWithClaims-Hmac
// et le renvoyer
