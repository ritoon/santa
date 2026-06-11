package sqlite

import (
	"apisanta/db"
	"apisanta/model"
	"encoding/json"
	"log"
	"os"

	"github.com/libtnb/sqlite"
	"gorm.io/gorm"
)

var _ db.DB = (*SQLiteDB)(nil)

type SQLiteDB struct {
	// Add fields for your SQLite connection, e.g.:
	db *gorm.DB
}

func New() (*SQLiteDB, error) {
	db, err := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&model.Product{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&model.User{})
	if err != nil {
		return nil, err
	}

	dbconn := &SQLiteDB{db: db}
	ps, _ := dbconn.GetProducts()
	if len(ps) == 0 {
		insertSampleData(dbconn)
	}

	return dbconn, nil
}

func insertSampleData(db *SQLiteDB) {
	// insert sample products from JSON file
	data, err := os.ReadFile("../front/public/products.json")
	if err != nil {
		log.Printf("failed to read products data: %v", err)
		return
	}
	var products []model.Product
	err = json.Unmarshal(data, &products)
	if err != nil {
		log.Printf("failed to parse products data: %v", err)
		return
	}
	for _, product := range products {
		db.CreateProduct(&product)
	}
	// insert sample users
	users := []model.User{
		{Username: "user1", Email: "user1@example.com", Password: "password1", Age: 10},
		{Username: "user2", Email: "user2@example.com", Password: "password2", Age: 5},
	}
	for _, user := range users {
		db.CreateUser(&user)
	}
}
