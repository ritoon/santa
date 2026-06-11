package config

import (
	"log"

	"github.com/spf13/viper"
)

type Config struct {
	JWTSignKey string `mapstructure:"jwt_sign_key"`
}

func Get() *Config {

	viper.SetConfigFile(".env")
	viper.SetConfigType("env")

	// Permet aussi de surcharger avec les vraies variables d'environnement
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		log.Fatalf("error Read config %v", err)
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		log.Fatal("error unmarshal to config")
	}

	return &cfg
}
