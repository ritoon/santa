package main

import (
	"github.com/gin-gonic/gin"

	"apisanta/control"
	"apisanta/db/sqlite"
	"apisanta/handler"
)

func main() {
	// TODO récupération de la configuration

	db, _ := sqlite.New()

	// TODO remplacer par la var d'env pour la signature de la clée
	control := control.New(db, "signkey123")

	router := gin.Default()
	handler.Init(router, control)

	router.Run(":8080")
}
