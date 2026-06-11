package handler

import (
	"apisanta/middleware"
	"apisanta/model"
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type Handers struct{}

func Init(router *gin.Engine) {
	logger := middleware.Logger()
	v1 := router.Group("/api/v1").Use(logger)

	var h = &Handers{}

	v1.GET("/products", h.HandlerGetProducts)
}

// HandlerGetProducts
func (h *Handers) HandlerGetProducts(c *gin.Context) {
	data, err := os.ReadFile("../front/public/products.json")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "Failed to read products data"})
		return
	}
	var products []model.Product
	err = json.Unmarshal(data, &products)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Failed to parse products data"})
		return
	}

	c.Data(200, "application/json", data)
}
