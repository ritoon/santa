package sqlite

import (
	"apisanta/model"

	"gorm.io/driver/sqlite"
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
	return &SQLiteDB{db: db}, nil
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
