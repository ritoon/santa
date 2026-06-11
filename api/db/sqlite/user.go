package sqlite

import "apisanta/model"

func (s *SQLiteDB) GetUsers() ([]model.User, error) {
	var users []model.User
	err := s.db.Find(&users).Error
	return users, err
}

func (s *SQLiteDB) GetUserByEmail(email string) (model.User, error) {
	var user model.User
	err := s.db.Where("email = ?", email).First(&user).Error
	return user, err
}

func (s *SQLiteDB) CreateUser(user *model.User) error {
	return s.db.Create(&user).Error
}
