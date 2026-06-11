package main

import (
	"encoding/json"
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"apisanta/middleware"
)

func main() {
	router := gin.Default()

	logger := middleware.Logger()

	v1 := router.Group("/api/v1").Use(logger)

	v1.GET("/products", handlerGetProducts)

	router.Run(":8080")
}

// handlerGetProducts
func handlerGetProducts(c *gin.Context) {
	data, err := os.ReadFile("../front/public/products.json")
	if err != nil {
		log.Fatal(err)
	}
	var products []Product
	err = json.Unmarshal(data, &products)
	if err != nil {
		log.Fatal(err)

	}

	c.Data(200, "application/json", data)
}

type Product struct {
	Titre         string   `json:"titre"`
	Prix          string   `json:"prix"`
	Description   string   `json:"description"`
	Images        []string `json:"images"`
	Reference     string   `json:"reference"`
	Categorie     string   `json:"categorie"`
	SousCategorie string   `json:"sous_categorie"`
	URL           string   `json:"url"`
}
