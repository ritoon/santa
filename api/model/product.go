package model

type Product struct {
	Titre         string   `json:"titre"`
	Prix          string   `json:"prix"`
	Description   string   `json:"description"`
	Images        []string `json:"images"`
	Reference     string   `json:"reference"`
	Categorie     string   `json:"categorie"`
	SousCategorie string   `json:"sous_categorie"`
	URL           string   `json:"url"`
}
