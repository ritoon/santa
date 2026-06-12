package main

import (
	"time"

	"github.com/gin-gonic/gin"

	"apisanta/cache/localcache"
	"apisanta/config"
	"apisanta/control"
	"apisanta/db/sqlite"
	"apisanta/handler"
)

func main() {

	conf := config.Get()

	db, _ := sqlite.New()

	// créer une instance de cache et l'envoyer dans le constructeur du control.
	c := localcache.New(time.Second * 3)

	control := control.New(db, conf.JWTSignKey, c)

	router := gin.Default()
	handler.Init(router, control)

	router.Run(":8080")
}
