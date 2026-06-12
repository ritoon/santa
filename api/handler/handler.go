package handler

import (
	"apisanta/control"
	"apisanta/middleware"
	"apisanta/model"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handers struct {
	Ctrl *control.Control
}

func Init(router *gin.Engine, ctrl *control.Control) {
	logger := middleware.Logger()
	v1 := router.Group("/api/v1").Use(logger)

	var h = &Handers{
		Ctrl: ctrl,
	}

	// TODO ajouter la validation dans le header du JWT (middleware)
	v1.GET("/products", h.Ctrl.ValidateJWT(), h.HandlerGetProducts)
	// v1.GET("/products", h.HandlerGetProducts)
	v1.POST("/login", h.HandlerLogin)
	// TODO création du nouvel endpoint create user avec POST
}

// Todo création d'un handler pour le register (création d'un utilisateur)
// il récupère dans le context de gin les informations qui sont à mapper sur la structure PayloadCreateUser
// ensuite valider si le payload est conforme
// ensuite convertir le payload en User
// save dans la db.
// renvoyer l'utilisateur

// HandlerGetProducts
func (h *Handers) HandlerGetProducts(c *gin.Context) {

	data, err := h.Ctrl.GetProducts()
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, data)
}

func (h *Handers) HandlerLogin(c *gin.Context) {
	var payload model.LoginPayload
	err := c.BindJSON(&payload)
	if err != nil {
		log.Print(err)
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "bad request"})
		return
	}
	jwtString, err := h.Ctrl.Login(&payload)
	if err != nil {
		log.Print(err)
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "not authorized"})
		return
	}
	c.JSON(200, gin.H{"jwt": jwtString})
}
