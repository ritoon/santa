package main

import (
	"github.com/gin-gonic/gin"

	"apisanta/control"
	"apisanta/handler"
)

func main() {
	router := gin.Default()

	control := control.New()

	handler.Init(router, control)

	router.Run(":8080")
}
