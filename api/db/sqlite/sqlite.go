package sqlite

import (
	"apisanta/model"
	"encoding/json"
	"log"
	"os"

	"github.com/libtnb/sqlite"
	"gorm.io/gorm"
)

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
		insertSampleData(db)
	}

	return dbconn, nil
}

func insertSampleData(db *gorm.DB) {
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
		db.Create(&product)
	}
}

func (s *SQLiteDB) GetProducts() ([]model.Product, error) {
	var products []model.Product
	err := s.db.Find(&products).Error
	return products, err
}

func (s *SQLiteDB) GetUsers() ([]model.User, error) {
	var users []model.User
	err := s.db.Find(&users).Error
	return users, err
}

func (s *SQLiteDB) Login(username, password string) (model.User, error) {
	var user model.User
	err := s.db.Where("username = ? AND password = ?", username, password).First(&user).Error
	return user, err
}

func (s *SQLiteDB) Register(user model.User) error {
	return s.db.Create(&user).Error
}
