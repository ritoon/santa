package main

import (
	"time"

	"github.com/gin-contrib/cors"
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

	// ajouter une règle de cors
	// authoriser  Local:   http://localhost:5173/
	//   ➜  Network: http://192.168.29.17:5173/
	// https://github.com/gin-contrib/cors
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173", "http://192.168.29.17:5173"}
	config.AllowHeaders = []string{"Origin", "Authorization"}
	router := gin.Default()
	router.Use(cors.New(config))
	handler.Init(router, control)

	router.Run(":8080")
}
