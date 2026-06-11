package handler

import (
	"apisanta/control"
	"apisanta/middleware"

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

	v1.GET("/products", h.HandlerGetProducts)
}

// HandlerGetProducts
func (h *Handers) HandlerGetProducts(c *gin.Context) {

	data, err := h.Ctrl.GetProducts()
	if err != nil {
		c.AbortWithStatusJSON(500, gin.H{"error": err.Error()})
		return
	}

	c.JSON(200, data)
}
