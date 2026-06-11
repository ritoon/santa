package main

import (
	"github.com/gin-gonic/gin"

	"apisanta/control"
	"apisanta/db/sqlite"
	"apisanta/handler"
)

func main() {

	db, _ := sqlite.New()
	control := control.New(db)

	router := gin.Default()
	handler.Init(router, control)

	router.Run(":8080")
}
