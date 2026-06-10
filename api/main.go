package main

import "github.com/gin-gonic/gin"

func main() {
	router := gin.Default()

	router.GET("/products", handlerGetProducts)

	router.Run(":8080")
}

// handlerGetProducts
func handlerGetProducts(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Hello World",
	})
}
