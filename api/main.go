package main

import (
	"github.com/gin-gonic/gin"

	"apisanta/handler"
)

func main() {
	router := gin.Default()

	handler.New(router)

	router.Run(":8080")
}
