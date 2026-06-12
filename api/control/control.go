package control

import (
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"apisanta/cache"
	"apisanta/db"
	"apisanta/model"
)

// ajouter dans le constructeur le cache.Cacher
func New(d db.DB, jwtSignKey string, c cache.Cacher) *Control {
	return &Control{db: d, jwtSignKey: []byte(jwtSignKey), cache: c}
}

type Control struct {
	db         db.DB
	jwtSignKey []byte
	// ajouter cache de type cache.Cacher
	cache cache.Cacher
}

func (c *Control) Register(u *model.User) error {
	return c.db.CreateUser(u)
}

func (c *Control) GetProducts() ([]model.Product, error) {
	// chercher si le cache existe renvoyer le résultat en []model.Product
	res, ok := c.cache.Get("products")
	if ok {
		log.Println("got product from cache")
		v, ok := res.([]model.Product)
		if !ok {
			return nil, errors.New("internal error")
		}
		return v, nil
	}
	// sinon récupérer dans la base de données avec c.db.GetProducts()
	ps, err := c.db.GetProducts()
	if err != nil {
		return nil, err
	}
	log.Println("set product in cache")
	c.cache.Set("products", ps)
	// et stocker dans le cache
	return ps, nil
}

func (c *Control) GetProduct(id uint) (*model.Product, error) {
	p, err := c.db.GetProductByID(id)
	if err != nil {
		return nil, err
	}
	return &p, nil
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
		"exp":   time.Now().Add(time.Hour).Unix(),
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
func (c *Control) ValidateJWT() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		auth := ctx.Request.Header.Get("Authorization")
		if len(auth) == 0 {
			ctx.AbortWithStatusJSON(401, gin.H{"error": "Authorization header value not found"})
			return
		}
		valueAuth := strings.Split(auth, " ")
		if len(valueAuth) != 2 {
			ctx.AbortWithStatusJSON(401, gin.H{"error": "Authorization header value not found"})
			return
		}

		token, err := jwt.Parse(valueAuth[1], func(token *jwt.Token) (any, error) {
			return c.jwtSignKey, nil
		}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
		if err != nil {
			ctx.AbortWithStatusJSON(401, gin.H{"error": err.Error()})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			fmt.Println(claims["id"], claims["email"])
			ctx.Set("usr_id", claims["id"])
		} else {
			fmt.Println(err)
		}
	}
}
