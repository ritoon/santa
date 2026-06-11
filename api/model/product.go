package model

import "gorm.io/gorm"

type Product struct {
	gorm.Model
	Titre         string   `json:"titre"`
	Prix          string   `json:"prix"`
	Description   string   `json:"description"`
	Images        []string `json:"images" gorm:"serializer:json"`
	Reference     string   `json:"reference"`
	Categorie     string   `json:"categorie"`
	SousCategorie string   `json:"sous_categorie"`
	URL           string   `json:"url"`
}
