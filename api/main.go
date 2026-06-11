package main

import (
	"github.com/gin-gonic/gin"

	"apisanta/config"
	"apisanta/control"
	"apisanta/db/sqlite"
	"apisanta/handler"
)

func main() {

	conf := config.Get()

	db, _ := sqlite.New()

	control := control.New(db, conf.JWTSignKey)

	router := gin.Default()
	handler.Init(router, control)

	router.Run(":8080")
}
