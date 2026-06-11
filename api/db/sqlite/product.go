package sqlite

import "apisanta/model"

func (s *SQLiteDB) GetProducts() ([]model.Product, error) {
	var products []model.Product
	err := s.db.Find(&products).Error
	return products, err
}

func (s *SQLiteDB) GetProductByID(id uint) (model.Product, error) {
	var product model.Product
	err := s.db.First(&product, id).Error
	return product, err
}

func (s *SQLiteDB) CreateProduct(product *model.Product) error {
	return s.db.Create(&product).Error
}

func (s *SQLiteDB) UpdateProduct(product *model.Product) error {
	return s.db.Save(&product).Error
}

func (s *SQLiteDB) DeleteProduct(id uint) error {
	return s.db.Delete(&model.Product{}, id).Error
}
