package control

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"apisanta/db"
	"apisanta/model"
)

func New(d db.DB, jwtSignKey string) *Control {
	return &Control{db: d, jwtSignKey: []byte(jwtSignKey)}
}

type Control struct {
	db         db.DB
	jwtSignKey []byte
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
func (c *Control) Login(payload *model.LoginPayload) (tokenString string, err error) {
	usr, err := c.db.GetUserByEmail(payload.Email)
	if err != nil {
		return "", err
	}
	if !payload.IsValidPassword(usr.Password) {
		return "", errors.New("credential invalid")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":    usr.ID,
		"email": usr.Email,
		"nbf":   time.Date(2015, 10, 10, 12, 0, 0, 0, time.UTC).Unix(),
	})
	// Sign and get the complete encoded token as a string using the secret
	tokenString, err = token.SignedString(c.jwtSignKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// TODO ajouter une méthode permettant de réaliser un middleware
// https://gin-gonic.com/en/docs/middleware/custom-middleware/
// vérifier dans le header "Authorization" la valeur Bearer JWT
// valider le JWT et récupérer les valeurs de Claims et l'ajouter dans le Context de gin.
// https://pkg.go.dev/github.com/golang-jwt/jwt/v5#example-Parse-Hmac
// sinon arrêter l'execution des handlers et renvoyer un 401 à l'appel
